const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)

// ВОТ ЭТО ТЫ ЗАБЫЛ
const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {
  console.log("user connected")
})

server.listen(3000, () => {
  console.log("server running")
})