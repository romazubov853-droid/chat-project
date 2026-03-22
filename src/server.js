const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 🔗 ВСТАВЬ СЮДА СВОЮ СТРОКУ
mongoose.connect("mongodb+srv://romazubov853_db_user:kICIRCfpmzB75iSq@cluster0.ciqcbrl.mongodb.net/chat?retryWrites=true&w=majority")
.then(() => console.log("MongoDB подключена"))
.catch(err => console.log(err));

// 📦 модель сообщения
const Message = mongoose.model("Message", {
  text: String,
  createdAt: { type: Date, default: Date.now }
});

app.use(express.static("src/public"));

// 🔌 socket
io.on("connection", async (socket) => {
  console.log("Пользователь подключился");

  // отправляем старые сообщения
  const messages = await Message.find().sort({ createdAt: 1 });
  socket.emit("loadMessages", messages);

  // новое сообщение
  socket.on("chatMessage", async (msg) => {
    const message = new Message({ text: msg });
    await message.save();

    io.emit("chatMessage", message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Сервер запущен"));