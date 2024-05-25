const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
room.hidden = true;

let roomName = "";

function enterRoom(e) {
  e.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enterRoom", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector("input");
  const inputValue = input.value;
  socket.emit("newMessage", inputValue, roomName, () => {
    addMessage(`You: ${inputValue}`);
  });
  input.value = "";
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerHTML = `Room ${roomName}`;
  const form = room.querySelector("form");
  form.addEventListener("submit", handleMessageSubmit);
}

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

form.addEventListener("submit", enterRoom);

socket.on("welcome", () => {
  addMessage("Someone joined!");
});

socket.on("bye", () => {
  addMessage("Someone Left!");
});

socket.on("newMessage", addMessage);
