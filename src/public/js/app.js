const socket = io();
const welcome = document.getElementById('welcome');
const form = welcome.querySelector('form');
const room = document.getElementById('room');
room.hidden = true;

let roomName = '';

function enterRoom(e) {
  e.preventDefault();
  const roomNameInput = form.querySelector('#roomName');
  const nickNameInput = form.querySelector('#nickname');
  socket.emit(
    'enterRoom',
    {
      room: { name: roomNameInput.value },
      user: { nickname: nickNameInput.value },
    },
    showRoom,
  );
  roomName = roomNameInput.value;
  roomNameInput.value = '';
}

function handleMessageSubmit(e) {
  e.preventDefault();
  const input = room.querySelector('input');
  const inputValue = input.value;
  socket.emit('newMessage', inputValue, roomName, () => {
    addMessage(`You: ${inputValue}`);
  });
  input.value = '';
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerHTML = `Room ${roomName}`;
  const form = room.querySelector('form');
  form.addEventListener('submit', handleMessageSubmit);
}

function addMessage(nickname, message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = `${nickname}: ${message}`;
  ul.appendChild(li);
}

form.addEventListener('submit', enterRoom);

socket.on('welcome', (nickname) => {
  addMessage(nickname, 'joined!');
});

socket.on('bye', (nickname) => {
  addMessage(nickname, 'Left!');
});

socket.on('newMessage', (message, nickname) => {
  addMessage(nickname, message);
});
