document.addEventListener('DOMContentLoaded', () => {
  const svgHTML = `<svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M2 9V3c0-0.55 0.45-1 1-1h18c0.55 0 1 0.45 1 1v10c0 0.55-0.45 1-1 1h-5l-5 5v-5H3c-0.55 0-1-0.45-1-1V9z"/></svg>`;
    fetch('/getfriends')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const friendContainer = document.getElementById('friendContainer');
      const list = document.createElement('ul');
      list.classList.add('friend-list');
      data.forEach(friend => {
        const item = document.createElement('li');
        item.classList.add('friend');
        item.innerHTML = `<p class="name">${friend}</p> <button class="chatButtonRequest" data-friend="${friend}">${svgHTML}</button>`;
        list.appendChild(item);
      });
      friendContainer.appendChild(list);

      var chatButton = document.querySelectorAll('.chatButtonRequest');

      chatButton.forEach(button => {
        button.addEventListener('click', function() {
          const friend = this.dataset.friend;
          fetch(`/getchat?friend=${friend}`)
            .then(response => response.text())
            .then(data => {
              if (data === 'Chat erstellt') {
                // window.location.href = `/chat?friend=${friend}`;
                console.log('Chat erstellt')
                window.location.href = `/chatarea`;
              } else if (data === 'Chat already exists') {
                console.log('Chat already exists');
                window.location.href = `/chatarea`;
              }
            })
            .catch(error => {
              console.error('Fehler:', error);
            });
        });
      });
    });
});