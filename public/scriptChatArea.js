// ----------------- Chat-Code -----------------
// Verbindung zum Socket.io-Server herstellen
const socket = io('http://localhost:3000');

// Auf 'message'- Event hören
socket.on('message', (data) => {
  const chat = document.getElementById('chat');
  const message = document.createElement('div');
  const messageTime = document.createElement('span');
  const input = document.getElementById('message-input');
  const chatPartner = document.getElementById('chatId').dataset.username;
  // Erstelle ein Date-Objekt aus dem Timestamp
  var date = new Date(data.time);
  // Hole Stunden und Minuten
  var hours = date.getHours();
  var minutes = date.getMinutes();
  // Führende Null hinzufügen, falls nötig
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  // Formatieren als "Stunden:Minuten"
  var timeString = hours + ':' + minutes;
  messageTime.textContent = timeString;
  messageTime.classList.add('message-time');
  message.innerHTML = `${data.text}${messageTime.outerHTML}`;
  message.classList.add('message');
  if(data.sender === chatPartner) {
    message.classList.add('received');
  } else {
    message.classList.add('sent');
  }
  document.getElementById(data.chatId).textContent = timeString;
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