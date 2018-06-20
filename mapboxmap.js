mapboxgl.accessToken = '';

let loadedMap;

class MapboxMap {
  constructor() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-98.5795, 39.8283],
      zoom: 2,
    });
    loadedMap = this;
  }

  zoomToLocation(coords, newZoom = 14) {
    this.map.flyTo({ center: coords, zoom: newZoom });
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
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: false,
    }));
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

