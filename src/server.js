const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 🔗 подключение к MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB подключена"))
  .catch(err => console.log("❌ MongoDB ошибка:", err));

// 📦 модель сообщения
const Message = mongoose.model("Message", {
  text: String,
  createdAt: { type: Date, default: Date.now }
});

// 📁 статика
app.use(express.static("src/public"));

// 🔌 socket (ОДИН!)
io.on("connection", async (socket) => {
  console.log("🔥 Пользователь подключился");

  try {
    // 📥 загрузка старых сообщений
    const messages = await Message.find().sort({ createdAt: 1 });
    socket.emit("loadMessages", messages);

    // 📤 новое сообщение
    socket.on("chatMessage", async (msg) => {
      console.log("📩 Сообщение:", msg);

      const message = new Message({ text: msg });
      await message.save();

      console.log("💾 Сохранено в БД");

      io.emit("chatMessage", message);
    });

  } catch (err) {
    console.log("❌ Ошибка:", err);
  }
});

// 🚀 запуск сервера
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🚀 Server started on port", PORT);
});