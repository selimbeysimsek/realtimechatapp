document.addEventListener('DOMContentLoaded', () => {
  fetch('/getrequests')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const requestContainer = document.getElementById('requestList');
      const list = document.createElement('ul');
      data.forEach(request => {
        const item = document.createElement('li');
        item.innerHTML = request;
        list.appendChild(item);
      });
      requestContainer.appendChild(list);
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
    })
});