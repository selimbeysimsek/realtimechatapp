// ----------------- Chat-Code -----------------
// Verbindung zum Socket.io-Server herstellen
const socket = io('http://localhost:3000');

// Auf 'message'- Event hören
socket.on('message', (data) => {
  const chat = document.getElementById('chat');
  const message = document.createElement('p');
  const input = document.getElementById('message-input');
  const chatPartner = document.getElementById('chatId').dataset.username;
  // console.log(chatPartner);
  // console.log(data.sender);
  message.textContent = data.text;
  if(data.sender === chatPartner) {
    message.classList.add('them');
  } else {
    message.classList.add('you');
  }
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
  input.value = '';
})

// Senden-Button-Event
document.getElementById('send-button').addEventListener('click', () => {
  const chatId = document.getElementById('chatId').dataset.id;
  const messsage = {
    text: document.getElementById('message-input').value,
    sender: 'me',
    receiver: 'someone else',
    time: Date.now(),
    chatId: chatId
  }
  socket.emit('message', messsage);
})

// Senden mit Enter-Click
document.getElementById('message-input').addEventListener('keyup', (e) => {
  const chatId = document.getElementById('chatId').dataset.id;
  if (e.key === 'Enter') {
    const messsage = {
      text: document.getElementById('message-input').value,
      sender: 'me',
      receiver: 'someone else',
      time: Date.now(),
      chatId: chatId
    }
    socket.emit('message', messsage);
  }
})