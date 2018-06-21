let savedPosition = [];

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
    this.id = ++venueId;
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
    loadedMap.zoomToLocation({ lng: this.longitude, lat: this.latitude }, 16.77, 55, 0.8);
    resultsDiv.innerHTML = '';
    resultsDiv.innerHTML +=
        `<div id="show-venue" data-id="${this.foursquareId}">
          <div id='back'>Back</div>
            <h2>${this.name}</h2>
            <strong>${(Math.ceil(this.distance * 20) / 20).toFixed(2)} miles</strong>
            <p><em>${this.category}</em></p>
            <p>${this.formattedAddress}</p>
            <p>${this.phone}</p>
            <form id="new-review">
              <h3>Leave a review</h3>
              <input type="text" id="user-name" placeholder="Name"> <br/>
              <textarea id="venue-review" placeholder="Review"> </textarea><br/>
            </form>
        </div>`;
    this.backToFullListing();
  }

  backToFullListing() {
    const resultsDiv = document.querySelector('div#results');
    const backDiv = document.querySelector('div#back');
    backDiv.addEventListener('click', () => {
      resultsDiv.innerHTML = '';
      Venue.all.forEach(venue => venue.appendResults());
      Venue.all.forEach(venue => venue.infoPage());
      loadedMap.zoomToLocation(savedPosition[0], savedPosition[1]);
      savedPosition = [];
    });
  }

  appendResults() {
    const venueList = document.querySelector('div#results');
    venueList.innerHTML +=
      `<div id="venue" data-id="${this.foursquareId}">
        <h3>${this.name}</h3>
        <strong>${(Math.ceil(this.distance * 20) / 20).toFixed(2)} miles </strong>
        <p>${this.formattedAddress[0]}</p>
      </div>`;
  }
}

function sortByDistance() {
  Venue.all.sort((a, b) => a.distance - b.distance);
}

let venueId = 0;
Venue.all = [];
