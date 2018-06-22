class Venue {
  constructor(name, latitude, longitude, formattedAddress = '', category = '', phone = '', foursquareId) {
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

  makeGetFetch() {
    return fetch('http://localhost:3000/api/v1/places')
      .then(res => res.json());
  }

  getReviewIds() {
    this.makeGetFetch()
      .then(json => json.data)
      .then(places => places.forEach(place => this.checkMatch(place)));
  }

  getAllReviews() {
    return this.makeGetFetch()
      .then(json => json.included);
  }

  checkMatch(place) {
    const placeId = place.attributes['foursquare-id'];
    if (placeId === this.foursquareId) {
      const matchingIds = place.relationships.reviews.data.map(review => review.id);
      this.getAllReviews()
        .then(reviews => reviews
          .filter(review => matchingIds.includes(review.id))
          .forEach(review => this.formatReview(review)));
    }
  }

  formatReview(json) {
    this.appendReview({ user: json.attributes.user, content: json.attributes.content });
  }

  appendReview(review) {
    const reviewsDiv = document.querySelector('div#show-reviews');
    const reviewHeader = document.querySelector('div#review-header');
    reviewHeader.innerHTML = '<h4>Messages</h4>';
    reviewsDiv.innerHTML += `
    <div class="card bg-light mb-3">
    <div class="card-body">
      <h4 class="card-title">${review.user}</h4>
      <p class="card-text">${review.content}</p>
    </div>
  </div>`;
  }

  makePostFetch(options) {
    fetch('http://localhost:3000/api/v1/places', options)
      .then(res => res.json()).then(json => json);
  }

  submitNewReview() {
    const button = document.querySelector('button#submit-message');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const nameField = document.querySelector('input#inputDefault');
      const messageField = document.querySelector('textarea.form-control');
      const newMessage = { place: { foursquare_id: this.foursquareId, reviews: [{ user: nameField.value, content: messageField.value }] } };
      this.makePostRequest(newMessage);
      this.appendReview({ user: nameField.value, content: messageField.value });
      nameField.value = '';
      messageField.value = '';
    });
  }

  makePostRequest(message) {
    const options = {
      method: 'POST',
      body: JSON.stringify(message),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    this.makePostFetch(options);
  }

  renderInfo() {
    const resultsDiv = document.querySelector('div#results');
    const backSpan = document.querySelector('span#back');
    loadedMap.zoomToLocation({ lng: this.longitude, lat: this.latitude }, 16.77, 55, 0.8);
    backSpan.innerText = 'Back to results';
    resultsDiv.innerHTML = '';
    resultsDiv.innerHTML = this.makeVenueShowPage();
    this.getReviewIds();
    this.submitNewReview();
    this.hideHeader();
    this.backToFullListing();
    this.enableBackButton();
  }

  enableBackButton() {
    const disclaimerDiv = document.querySelector('#search-disclaimer > div > button');
    disclaimerDiv.addEventListener('click', () => {
      userLocation = [];
      disclaimerDiv.innerHTML = '';
    });
  }

  hideHeader() {
    const header = document.querySelector('div#header-container');
    const search = document.querySelector('form#search');
    header.classList.add('hide');
    search.classList.add('hide');
  }

  showHeader() {
    const header = document.querySelector('div#header-container');
    const search = document.querySelector('form#search');
    header.classList.remove('hide');
    search.classList.remove('hide');
  }

  backToFullListing() {
    const resultsDiv = document.querySelector('div#results');
    const backSpan = document.querySelector('span#back');
    backSpan.addEventListener('click', () => {
      resultsDiv.innerHTML = '';
      backSpan.innerHTML = '';
      this.showHeader();
      Venue.all.forEach(venue => venue.appendResults());
      Venue.all.forEach(venue => venue.infoPage());
      loadedMap.createBoundingBox();
    });
  }

  makeVenueCard() {
    return `
    <div class="card" id="venue" data-id="${this.foursquareId}">
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
      <h3>Leave a Message</h3>
      <input type="text" class="form-control" placeholder="Name" id="inputDefault">
      <textarea class="form-control" id="exampleTextarea" rows="5" placeholder="What's on your mind?"></textarea>
      <button type="submit" class="btn btn-primary" id="submit-message">Submit</button>
      </form>
    <div id="review-header"></div>
    <div id="show-reviews"></div>
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
