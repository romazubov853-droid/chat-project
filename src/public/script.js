<script src="/socket.io/socket.io.js"></script>

<script>
const socket = io();

const roomSelect = document.getElementById("roomSelect");
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

socket.on("connect", () => {
  console.log("✅ Socket подключен");
  socket.emit("joinRoom", roomSelect.value);
});

roomSelect.addEventListener("change", () => {
  messages.innerHTML = "";
  socket.emit("joinRoom", roomSelect.value);
});

socket.on("loadMessages", (msgs) => {
  msgs.forEach(addMessage);
});

socket.on("chatMessage", (msg) => {
  addMessage(msg);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chatMessage", input.value);
    input.value = "";
  }
});

function addMessage(msg) {
  const li = document.createElement("li");
  li.textContent = msg.text;
  messages.appendChild(li);
}
</script>