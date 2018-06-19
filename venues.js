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

  appendResults() {
    const venueList = document.querySelector('div#results');
    venueList.innerHTML +=
      `<div id="venue" data-id="${this.foursquareId}">
      <h3>${this.name}</h3>
      <p>${this.formattedAddress[0]}</p>
      <p>${this.formattedAddress[1]}
      </div>`;
  }
}

function zoomToLocation() {
  const venueDivs = document.querySelectorAll('div#venue');
  venueDivs.forEach((div) => {
    div.addEventListener('click', () => {
      const clickedVenue = Venue.all.filter(venue => venue.foursquareId === div.dataset.id)[0];
      loadedMap.zoomToLocation({ lng: clickedVenue.longitude, lat: clickedVenue.latitude }, 18);
    });
  });
}

let venueId = 0;
Venue.all = [];
