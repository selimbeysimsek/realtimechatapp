document.getElementById('toggle-search-btn').addEventListener('click', function() {
  var searchContainer = document.getElementById('search-container');
  if (searchContainer.style.display === 'none') {
    searchContainer.style.display = 'block';
  } else {
    searchContainer.style.display = 'none';
  }
})
