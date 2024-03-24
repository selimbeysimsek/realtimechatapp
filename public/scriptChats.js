function messageDate(timestamp) {
  const today = new Date();
  const date = new Date(timestamp);

  // Set the time of both dates to 0 to compare only the dates
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) {
    return "Heute";
  } else if (date.getTime() === today.getTime() - 86400000) {
    return "Gestern";
  } else {
    return date.toLocaleDateString();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('/getMyName')
    .then(response => response.json())
    .then(data => {
      const myName = document.getElementById('ownName');
      myName.textContent = data.charAt(0).toUpperCase() + data.slice(1);
    })
  fetch('/getchats')
    .then(response => response.json())
    .then(data => {
      const chatContainer = document.getElementById('chat-selection');
      data.forEach(chat => {
        const item = document.createElement('div');
        item.classList.add('chat-option');
        const chatName = document.createElement('span');
        chatName.classList.add('chat-name');
        const chatTime = document.createElement('span');
        chatTime.classList.add('chat-time');
        chatTime.id = chat.chatId;
        var dateChat = new Date(chat.lastMessage);
        // Hole Stunden und Minuten
        var hoursChat = dateChat.getHours();
        var minutesChat = dateChat.getMinutes();
        // Führende Null hinzufügen, falls nötig
        hoursChat = hoursChat < 10 ? '0' + hoursChat : hoursChat;
        minutesChat = minutesChat < 10 ? '0' + minutesChat : minutesChat;
        // Formatieren als "Stunden:Minuten"
        var timeStringChat = hoursChat + ':' + minutesChat;
        chatName.innerText = chat.receiver.charAt(0).toUpperCase() + chat.receiver.slice(1);
        chatTime.textContent = timeStringChat;
        item.setAttribute('data-id', chat.chatId);
        item.setAttribute('data-username', chat.receiver);
        item.innerHTML = chatName.outerHTML + chatTime.outerHTML;
        chatContainer.appendChild(item);
      });
      var chatOption = document.querySelectorAll('.chat-option');
      chatOption.forEach(option => {
        option.addEventListener('click', function() {
          const chatId = this.dataset.id;
          fetch(`/getmessages?chatId=${chatId}`)
            .then(response => response.json())
            .then(data => {
              socket.emit('joinRoom', chatId);
              const chat = document.getElementById('chat');
              const input = document.getElementById('message-input');
              chat.innerHTML = '';
              let messageDay = 0;
              data.forEach(message => {
                const messageElement = document.createElement('div');
                const messageTime = document.createElement('span');
                // Erstelle ein Date-Objekt aus dem Timestamp
                var date = new Date(message.timestamp);
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
                messageElement.innerHTML = `${message.message}${messageTime.outerHTML}`;
                messageElement.classList.add('message');
                if(messageDate(message.timestamp) !== messageDay) {
                  const dateElement = document.createElement('div');
                  dateElement.textContent = messageDate(message.timestamp);
                  dateElement.classList.add('message-day');
                  chat.appendChild(dateElement);
                  messageDay = messageDate(message.timestamp);
                }
                if(message.sender === this.dataset.username) {
                  messageElement.classList.add('received');
                } else {
                  messageElement.classList.add('sent');
                }
                document.getElementById('friendName').textContent = this.dataset.username.charAt(0).toUpperCase() + this.dataset.username.slice(1);
                chat.appendChild(messageElement);
              });
              const chatIdElement = document.getElementById('chatId');
              chatIdElement.dataset.id = chatId;
              chatIdElement.dataset.username = this.dataset.username;
              chat.scrollTop = chat.scrollHeight;
              input.value = '';
            })
            .catch(error => {
              console.error('Fehler:', error);
            });
        });
      });

    });
});