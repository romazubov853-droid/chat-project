io.on("connection", (socket) => {
    console.log("Пользователь подключился");

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
        console.log("Пользователь вышел");
    });
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Сервер запущен");
});