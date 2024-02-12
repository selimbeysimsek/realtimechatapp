// ----------------- Chat-Code -----------------
// Verbindung zum Socket.io-Server herstellen
const socket = io('http://localhost:3000');

// Auf 'message'- Event hören
socket.on('message', (data) => {
  const chat = document.getElementById('chat');
  const message = document.createElement('p');
  const input = document.getElementById('message-input');
  message.textContent = data.text;
  message.classList.add('you');
  chat.appendChild(message);
  input.value = '';
})

// Senden-Button-Event
document.getElementById('send-button').addEventListener('click', () => {
  const messsage = {
    text: document.getElementById('message-input').value,
    sender: 'me',
    receiver: 'someone else',
    time: Date.now()
  }
  socket.emit('message', messsage);
})

// Senden mit Enter-Click
document.getElementById('message-input').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    const messsage = {
      text: document.getElementById('message-input').value,
      sender: 'me',
      receiver: 'someone else',
      time: Date.now()
    }
    socket.emit('message', messsage);
  }
})
