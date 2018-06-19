mapboxgl.accessToken = '';

let loadedMap;

class MapboxMap {
  constructor() {
    this.startingPosition = {};
    this.map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/streets-v9', // stylesheet location
      center: [-98.5795, 39.8283], // starting position [lng, lat]
      zoom: 2, // starting zoom
    });
    loadedMap = this;
  }

  zoomToLocation(coords, newZoom = 14) {
    this.map.flyTo({ center: coords, zoom: newZoom });
  }

  resetPosition() {
    const button = document.getElementById('reset-pos');
    button.addEventListener('click', () => {
      this.zoomToLocation(this.startingPosition);
    });
  }

  clearPoints() {
    if (Venue.all.length > 0) {
      this.map.removeLayer('venues');
      this.map.removeSource('venues');
      Venue.all = [];
      document.querySelector('div#results').innerHTML = '';
    }
  }

  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const userPosition = { lng: position.coords.longitude, lat: position.coords.latitude };
      this.position = userPosition;
      this.zoomToLocation(userPosition);
      this.startingPosition = userPosition;
    });
    this.resetPosition();
  }

  plotVenues() {
    this.map.addLayer(makeGeoJson());
  }

  enableReCentering() {
    this.map.on('click', 'venues', (e) => {
      this.zoomToLocation(e.lngLat);
    });
    this.map.on('mouseenter', 'venues', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });
    this.map.on('mouseleave', 'venues', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }
}


function init() {
  const map = new MapboxMap();
  map.getUserLocation();
  map.enableReCentering();
  enableSearch();
}

document.addEventListener('DOMContentLoaded', (init));
