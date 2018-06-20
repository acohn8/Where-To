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
    const resultsDiv = document.querySelector('div#results');
    this.infoDiv().addEventListener('click', () => {
      loadedMap.zoomToLocation({ lng: this.longitude, lat: this.latitude }, 18);
      resultsDiv.innerHTML = '';
      resultsDiv.innerHTML +=
        `<div id="show-venue">
        <div id='back'>Back</div>
        <h2>${this.name}</h2>
        <p><em>${this.category}</em></p>
        <p>${this.formattedAddress}</p>
        <p>${this.phone}</p>
        <form id="new-review">
          Name: <input type="text" id="user-name"> <br/>
          Review: <input type="text" id="venue-review"> <br/>
          <input type="submit" value="Post">
        </form>
        </div>`;
      this.backToFullListing();
    });
  }

  backToFullListing() {
    const resultsDiv = document.querySelector('div#results');
    const backDiv = document.querySelector('div#back');
    backDiv.addEventListener('click', () => {
      resultsDiv.innerHTML = '';
      Venue.all.forEach(venue => venue.appendResults())
      Venue.all.forEach(venue => venue.infoPage())
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

// function zoomToVenue() {
//   const venueDivs = document.querySelectorAll('div#venue');
//   venueDivs.forEach((div) => {
//     div.addEventListener('click', () => {
//       const clickedVenue = Venue.all.filter(venue => venue.foursquareId === div.dataset.id)[0];
//       loadedMap.zoomToLocation({ lng: clickedVenue.longitude, lat: clickedVenue.latitude }, 18);
//     });
//   });
// }

let venueId = 0;
Venue.all = [];
