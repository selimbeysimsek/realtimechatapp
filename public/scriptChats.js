document.addEventListener('DOMContentLoaded', () => {
  fetch('/getchats')
    .then(response => response.json())
    .then(data => {
      const chatContainer = document.getElementById('chat-selection');
      data.forEach(chat => {
        const item = document.createElement('div');
        item.classList.add('chat-option');
        item.setAttribute('data-id', chat.chatId);
        item.setAttribute('data-username', chat.receiver);
        item.innerText = `${chat.receiver}`;
        chatContainer.appendChild(item);
      });
      var chatOption = document.querySelectorAll('.chat-option');

      chatOption.forEach(option => {
        option.addEventListener('click', function() {
          const chatId = this.dataset.id;
          fetch(`/getmessages?chatId=${chatId}`)
            .then(response => response.json())
            .then(data => {
              const chat = document.getElementById('chat');
              chat.innerHTML = '';
              data.forEach(message => {
                const messageElement = document.createElement('p');
                messageElement.textContent = message.message;
                if(message.sender === this.dataset.username) {
                  messageElement.classList.add('them');
                } else {
                  messageElement.classList.add('you');
                }
                messageElement.classList.add(message.sender);
                chat.appendChild(messageElement);
              });
              const chatIdElement = document.getElementById('chatId');
              chatIdElement.dataset.id = chatId;
              chatIdElement.dataset.username = this.dataset.username;
            })
            .catch(error => {
              console.error('Fehler:', error);
            });
        });
      });

    });
});