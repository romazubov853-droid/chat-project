const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

// 👇 подключаем фронт
app.use(express.static(path.join(__dirname, "public")))

// 👇 чат логика
io.on("connection", (socket) => {
  console.log("user connected")

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg) // отправка всем
  })
})

server.listen(3000, () => {
  console.log("server running")
})