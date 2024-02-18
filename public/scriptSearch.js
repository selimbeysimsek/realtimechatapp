document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('search-results');

  searchButton.addEventListener('click', function() {
    const searchTerm = searchInput.value;
    fetch(`/search?q=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        resultsContainer.innerHTML = '';
        if (data.length > 0) {
          const list = document.createElement('ul');

          data.forEach(user => {
            const item = document.createElement('li');
            item.innerHTML = user;
            list.appendChild(item);
          });
          resultsContainer.appendChild(list);
          resultsContainer.style.display = 'block';
          var addButton = document.querySelectorAll('.addButton');

          addButton.forEach(button => {
            button.addEventListener('click', function() {
              const username = this.dataset.username;
              alert(username);
              // fetch(`/add?username=${username}`)
              //   .then(response => response.json())
              //   .then(data => {
              //     console.log(data);
              //   })
              //   .catch(error => {
              //     console.error('Fehler:', error);
              //   });
            });
          });
        } else {
          resultsContainer.textContent = 'Keine Benutzer gefunden';
        }
      })
      .catch(error => {
        console.error('Fehler:', error);
        resultsContainer.textContent = 'Fehler bei der Suche nach Benutzern';
      });
  })

  

  document.addEventListener('click', function(event) { 
    const meinDiv = document.getElementById('search-results');

    // Überprüfe, ob das geklickte Element das div oder ein Kind davon ist
    if (meinDiv !== event.target && !meinDiv.contains(event.target)) {
      meinDiv.style.display = 'none'; // Verstecke das div
    }
  });

});