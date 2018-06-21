const foursquareKey = '';

class Search {
  constructor(searchTerm) {
    this.searchTerm = searchTerm;
  }

  searchCoords() {
    loadedMap.clearPoints();
    if (userLocation.length !== 0) {
      return [userLocation[1], userLocation[0]];
    } else {
      return [loadedMap.map.getCenter().lat, loadedMap.map.getCenter().lng];
    }
  }

  searchByView() {
    const disclaimerDiv = document.querySelector('div#search-disclaimer');
    disclaimerDiv.addEventListener('click', () => {
      userLocation = [];
      disclaimerDiv.innerHTML = '';
    })
  }

  search() {
    return fetch(`https://api.foursquare.com/v2/venues/search?ll=${this.searchCoords()[0]},${this.searchCoords()[1]}&query=${this.searchTerm}&oauth_token=${foursquareKey}`)
      .then(res => res.json()).then(json => this.createVenues(json));
  }

  addSearchResults() {
    Venue.all.forEach(venue => venue.appendResults());
  }

  createVenues(venues) {
    return new Promise((resolve) => {
      venues.response.venues.forEach((venue) => {
        resolve(new Venue(venue.name, venue.location.lat, venue.location.lng, venue.location.formattedAddress, venue.categories[0].name, venue.contact.phone, venue.id));
      });
    }).then(sortByDistance())
      .then(loadedMap.plotVenues())
      .then(this.addSearchResults())
      .then(Venue.all.forEach(venue => venue.infoPage()));
  }
}

function enableSearch() {
  const searchBox = document.querySelector('input#search-box');
  const searchForm = document.querySelector('form#search');
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const foursquareSearch = new Search(searchBox.value);
    foursquareSearch.searchByView();
    foursquareSearch.search();
  });
}
