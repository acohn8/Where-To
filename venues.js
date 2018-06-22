class Venue {
  constructor(name, latitude, longitude, formattedAddress, category, phone, foursquareId) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.distance = this.calculateDistance();
    this.formattedAddress = formattedAddress;
    this.category = category;
    this.phone = phone;
    this.foursquareId = foursquareId;
    Venue.all.push(this);
  }

  infoDiv() {
    return document.querySelector(`div#venue[data-id='${this.foursquareId}']`);
  }

  infoPage() {
    this.infoDiv().addEventListener('click', () => {
      this.renderInfo();
    });
  }

  fromPoint() {
    if (userLocation.length === 2) {
      return turf.point(userLocation);
    }
    return turf.point([loadedMap.map.getCenter().lng, loadedMap.map.getCenter().lat]);
  }

  calculateDistance() {
    const from = this.fromPoint();
    const options = { units: 'miles' };
    const to = [this.longitude, this.latitude];
    return turf.distance(from, to, options);
  }

  getReviews() {
    fetch(`http://localhost:3000/api/v1/places`)
    .then(res => res.json())
    .then(json => this.filterReviews(json));
  }

  filterReviews(json) {
    const resultDiv = document.getElementById("show-venue")
    const resultDataId = resultDiv.getAttribute("data-id")
    return json.data.find(place => place.attributes['foursquare-id'] === resultDataId)
  }

  renderInfo() {
    savedPosition.push(loadedMap.map.getCenter());
    savedPosition.push(loadedMap.map.getZoom());
    const resultsDiv = document.querySelector('div#results');
    const backSpan = document.querySelector('span#back');
    loadedMap.zoomToLocation({ lng: this.longitude, lat: this.latitude }, 16.77, 55, 0.8);
    backSpan.innerText = 'Back to results'
    resultsDiv.innerHTML = '';
    resultsDiv.innerHTML = this.makeVenueShowPage();
    this.backToFullListing();
  }

  backToFullListing() {
    const resultsDiv = document.querySelector('div#results');
    const backSpan = document.querySelector('span#back');
    backSpan.addEventListener('click', () => {
      resultsDiv.innerHTML = '';
      backSpan.innerHTML = '';
      Venue.all.forEach(venue => venue.appendResults());
      Venue.all.forEach(venue => venue.infoPage());
      loadedMap.zoomToLocation(savedPosition[0], savedPosition[1]);
      savedPosition = [];
    });
  }

  makeVenueCard() {
    return `<div class="card" id="venue" data-id="${this.foursquareId}">
    <div class="card-body">
    <h4 class="card-title">${this.name}</h4>
    <h6 class="card-subtitle mb-2 text-muted">${(Math.ceil(this.distance * 20) / 20).toFixed(2)} miles</h6>
    <p class="card-text">${this.formattedAddress[0]}</p>
    </div>
    </div>`;
  }

  makeVenueShowPage() {
    return `<div id="show-venue" data-id="${this.foursquareId}">
    <div class="venue-card">
      <h2>${this.name}</h2>
      <p class="lead">${(Math.ceil(this.distance * 20) / 20).toFixed(2)} miles</p>
      <p>${this.formattedAddress.join('<br/>')}</p>
      <p>${this.phone}</p>
    </div>
    <form id="new-review" class="form-group">
      <h3>Leave a review</h3>
      <input type="text" class="form-control" placeholder="Name" id="inputDefault">
      <textarea class="form-control" id="exampleTextarea" rows="8" placeholder="Review"></textarea>
    </form>
  </div>`;
  }

  appendResults() {
    const venueList = document.querySelector('div#results');
    venueList.innerHTML += this.makeVenueCard();
  }
}

function sortByDistance() {
  Venue.all.sort((a, b) => a.distance - b.distance);
}

Venue.all = [];