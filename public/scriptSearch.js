document.addEventListener('DOMContentLoaded', () => {
  const resultsContainer = document.getElementById('search-results');
  let chat = "off";
  let requestContext = document.querySelector('#search-input').dataset.searchcontext
  document.querySelector('#search-input').addEventListener('input', function() {
    if(chat === "off") {
      document.querySelector('.chat-options').style.display = 'none';
      document.querySelector('#search-results').style.display = 'flex';
      document.querySelector('#search-btn').style.display = 'none';
      document.querySelector('#back-btn').style.display = 'inline-block';
      chat = "on";
    }
    const searchInput = document.getElementById('search-input');

    const searchTerm = searchInput.value;
    // -------------> Users
    if(searchTerm !== '' && requestContext == 'user'){
      fetch(`/search?q=${encodeURIComponent(searchTerm)}&qc=${requestContext}`)
        .then(response => response.json())
        .then(data => {
          resultsContainer.innerHTML = '';
          if (data.length > 0) {
            data.forEach(user => {
              const itemContainer = document.createElement('div');
              itemContainer.classList.add('search-result');
              const item = document.createElement('span');
              item.classList.add('search-name');
              item.innerHTML = user.username;
              itemContainer.appendChild(item);
              const addButton = document.createElement('button');
              addButton.classList.add('add-btn');
              addButton.dataset.username = user.username;
              addButton.id = `add-${user.username}`;
              addButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24">
              <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                  <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12Zm10-8a8 8 0 1 0 0 16a8 8 0 0 0 0-16Z"/>
                  <path d="M13 7a1 1 0 1 0-2 0v4H7a1 1 0 1 0 0 2h4v4a1 1 0 1 0 2 0v-4h4a1 1 0 1 0 0-2h-4V7Z"/>
              </g>
          </svg>`;
              itemContainer.appendChild(addButton);
              const declineButton = document.createElement('button');
              declineButton.classList.add('cancle');
              declineButton.dataset.username = user.username;
              declineButton.id = `decline-${user.username}`;
              declineButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="26" viewBox="0 0 32 32">
              <path fill="currentColor" d="M7.219 5.781L5.78 7.22L14.563 16L5.78 24.781l1.44 1.439L16 17.437l8.781 8.782l1.438-1.438L17.437 16l8.782-8.781L24.78 5.78L16 14.563z"/>
          </svg>`;
              itemContainer.appendChild(declineButton);
              if(user.requestUser == 0){
                declineButton.style.display = 'none';
              } else if (user.requestUser == 1){
                declineButton.style.display = 'inline-block';
                addButton.style.display = 'none';
              }
              resultsContainer.appendChild(itemContainer);
            });
            var addButton = document.querySelectorAll('.add-btn');
            var cancleButton = document.querySelectorAll('.cancle');

            addButton.forEach(button => {
              button.addEventListener('click', function() {
                document.getElementById(`decline-${button.dataset.username}`).style.display = 'inline-block';
                button.style.display = 'none';
                const username = this.dataset.username;
                fetch(`/add?username=${username}`)
                  .then(response => response.json())
                  .then(data => {
                    console.log(data);
                  })
                  .catch(error => {
                    console.error('Fehler:', error);
                  });
              });
            });
            cancleButton.forEach(button => {
              button.addEventListener('click', function() {
                document.getElementById(`add-${button.dataset.username}`).style.display = 'inline-block';
                button.style.display = 'none';
                const username = this.dataset.username;
                fetch(`/deleteRequest?user=${username}`)
                  .then(response => response.json())
                  .then(data => {
                    console.log(data);
                  })
                  .catch(error => {
                    console.error('Fehler:', error);
                  });
              });
            });
          } else {
            resultsContainer.textContent = 'Keine Benutzer gefunden';
          }
        })
        .catch(error => {
          console.error('Fehler:', error);
          if(searchInput.textContent === ''){
            resultsContainer.innerHTML = '';
          } else {
            resultsContainer.textContent = 'Fehler bei der Suche nach Benutzern';
          }
        });
    }
    // -------------> Empty
    else if (searchTerm === '') {
      resultsContainer.innerHTML = '';
    }
  });
  document.querySelector('#icon-requests').addEventListener('click', function() {
    document.querySelector('#search-input').dataset.searchcontext = 'requests'
    if(chat === "off") {
      document.querySelector('.chat-options').style.display = 'none';
      document.querySelector('#search-results').style.display = 'flex';
      document.querySelector('#search-btn').style.display = 'none';
      document.querySelector('#back-btn').style.display = 'inline-block';
      chat = "on";
    }
    // -------------> Requests
    if (document.querySelector('#search-input').dataset.searchcontext == 'requests') {
      fetch('/getrequests')
      .then(response => response.json())
      .then(data => {
        resultsContainer.innerHTML = '';
        if (data.length > 0) {
          data.forEach(user => {
            const itemContainer = document.createElement('div');
            itemContainer.classList.add('search-result');
            const item = document.createElement('span');
            item.classList.add('search-name');
            item.innerHTML = user.sender;
            itemContainer.appendChild(item);
            const acceptDeclineContainer = document.createElement('div');
            acceptDeclineContainer.classList.add('acceptDeclineContainer');
            const acceptButton = document.createElement('button');
            acceptButton.classList.add('accept');
            acceptButton.dataset.sender = user.sender;
            acceptButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" viewBox="0 0 448 448">
            <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7l233.4-233.3c12.5-12.5 32.8-12.5 45.3 0z"/>
        </svg>`;
            acceptDeclineContainer.appendChild(acceptButton);
            const declineButton = document.createElement('button');
            declineButton.classList.add('decline');
            declineButton.dataset.sender = user.sender;
            declineButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" viewBox="0 0 32 32">
            <path fill="currentColor" d="M7.219 5.781L5.78 7.22L14.563 16L5.78 24.781l1.44 1.439L16 17.437l8.781 8.782l1.438-1.438L17.437 16l8.782-8.781L24.78 5.78L16 14.563z"/>
        </svg>`;
            acceptDeclineContainer.appendChild(declineButton);
            itemContainer.appendChild(acceptDeclineContainer);
            resultsContainer.appendChild(itemContainer);
          });
          var acceptButton = document.querySelectorAll('.accept');
          var declineButton = document.querySelectorAll('.decline');
    
          acceptButton.forEach(button => {
            button.addEventListener('click', function() {
              const sender = this.dataset.sender;
              fetch(`/accept?sender=${sender}`)
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                })
                .catch(error => {
                  console.error('Fehler:', error);
                });
            });
          });
    
          declineButton.forEach(button => {
            button.addEventListener('click', function() {
              const sender = this.dataset.sender;
              fetch(`/decline?sender=${sender}`)
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                })
                .catch(error => {
                  console.error('Fehler:', error);
                });
            });
          });
        } else {
          resultsContainer.textContent = 'Keine Benutzer gefunden';
        }
      })
    }
  })
  document.querySelector('#search-btn').addEventListener('click', function() {
    if(chat === "off") {
      document.querySelector('.chat-options').style.display = 'none';
      document.querySelector('#search-results').style.display = 'flex';
      document.querySelector('#search-btn').style.display = 'none';
      document.querySelector('#back-btn').style.display = 'inline-block';
      chat = "on";
    }
  });
  document.querySelector('#back-btn').addEventListener('click', function() {
    if(chat === "on") {
      document.querySelector('.chat-options').style.display = 'flex';
      document.querySelector('#search-results').style.display = 'none';
      document.querySelector('#back-btn').style.display = 'none';
      document.querySelector('#search-btn').style.display = 'inline-block';
      document.querySelector('#search-input').value = '';
      chat = "off";
      document.querySelector('#search-input').dataset.searchcontext = 'user'
    }
  });
  
});