let savedPosition = [];

class Venue {
  constructor(name, latitude, longitude, formattedAddress, category, phone, foursquareId) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.formattedAddress = formattedAddress;
    this.category = category;
    this.phone = phone;
    this.foursquareId = foursquareId;
    this.id = ++venueId;
    Venue.all.push(this);
  }

  infoDiv() {
    return document.querySelector(`[data-id='${this.foursquareId}']`);
  }

  infoPage() {
    this.infoDiv().addEventListener('click', () => {
      this.renderInfo();
    });
  }

  renderInfo() {
    savedPosition.push(loadedMap.map.getCenter());
    savedPosition.push(loadedMap.map.getZoom());
    const resultsDiv = document.querySelector('div#results');
    loadedMap.zoomToLocation({ lng: this.longitude, lat: this.latitude }, 17.5, 55, 0.7);
    resultsDiv.innerHTML = '';
    resultsDiv.innerHTML +=
        `<div id="show-venue">
          <div id='back'>Back</div>
            <h2>${this.name}</h2>
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
        <p>${this.formattedAddress[0]}</p>
      </div>`;
  }
}

let venueId = 0;
Venue.all = [];
