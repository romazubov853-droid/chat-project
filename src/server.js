const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB подключена"))
  .catch(err => console.log("❌ MongoDB ошибка:", err));

// модель
const Message = mongoose.model("Message", {
  text: String,
  room: String,
  createdAt: { type: Date, default: Date.now }
});

app.use(express.static("src/public"));

// socket
io.on("connection", (socket) => {
  console.log("🔥 Пользователь подключился");

  // вход в комнату
  socket.on("joinRoom", async (room) => {
    socket.join(room);
    socket.room = room;

    console.log(`➡️ Вошёл в комнату: ${room}`);

    // загрузка сообщений комнаты
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    socket.emit("loadMessages", messages);
  });

  // сообщение
  socket.on("chatMessage", async (msg) => {
    if (!socket.room) return;

    const message = new Message({
      text: msg,
      room: socket.room
    });

    await message.save();

    io.to(socket.room).emit("chatMessage", message);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🚀 Server started on port", PORT);
});