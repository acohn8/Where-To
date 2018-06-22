let userLocation = [];

let loadedMap;

class MapboxMap {
  constructor() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/adamcohn/cjim8q06y01b52srxxq1an9sy',
      center: [-98.5795, 39.8283],
      zoom: 3,
    });
    loadedMap = this;
  }

  zoomToLocation(coords, newZoom = 14.5, newPitch = 0, newSpeed = 1.2) {
    this.map.flyTo({
      center: coords, zoom: newZoom, pitch: newPitch, speed: newSpeed,
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

  routeGeolocatedView() {
    const searchBox = document.getElementById('inputLarge search-box');
    if (searchBox.value.length > 0) {
      const foursquareSearch = new Search(searchBox.value);
      foursquareSearch.search();
    }
    this.zoomToLocation(userLocation);
  }

  locationAlert() {
    return `<div class="alert alert-dismissible alert-info">
    <button type="button" class="close" data-dismiss="alert">&times;</button>
    <strong>Searching relative to your current location.</strong> Dismiss to search by map view.
    </div>`;
  }

  getUserLocation() {
    const geoLocate = new mapboxgl.GeolocateControl();
    this.map.addControl(geoLocate);
    geoLocate.on('geolocate', (e) => {
      const disclaimerDiv = document.querySelector('div#search-disclaimer');
      userLocation = [];
      this.clearPoints();
      userLocation.push(e.coords.longitude);
      userLocation.push(e.coords.latitude);
      disclaimerDiv.innerHTML = this.locationAlert();
      this.routeGeolocatedView();
    });
  }

  addZoomControl() {
    const nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav);
  }

  plotVenues() {
    this.map.addLayer(makeGeoJson());
    this.createBoundingBox();
  }

  createBoundingBox() {
    const boundingBox = turf.bbox(this.map.getSource('venues')._data);
    this.map.setPitch(0);
    this.map.fitBounds(boundingBox, { padding: 10 });
  }

  enableReCentering() {
    this.map.on('click', 'venues', (e) => {
      const targetId = e.features[0].properties.foursquareId;
      const targetVenue = Venue.all.filter(venue => venue.foursquareId === targetId);
      targetVenue[0].renderInfo();
    });

    this.map.on('mouseenter', 'venues', () => {
      this.map.getCanvas().style.cursor = 'pointer';
    });

    this.map.on('mouseleave', 'venues', () => {
      this.map.getCanvas().style.cursor = '';
    });
  }

  enable3D() {
    this.map.addLayer({
      id: '3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15.5,
      paint: {
        'fill-extrusion-color': '#B2B1AE',
        'fill-extrusion-height': [
          'interpolate', ['linear'], ['zoom'],
          15, 0,
          15.05, ['get', 'height'],
        ],
        'fill-extrusion-base': [
          'interpolate', ['linear'], ['zoom'],
          15, 0,
          15.05, ['get', 'min_height'],
        ],
        'fill-extrusion-opacity': 0.6,
      },
    });
  }
}

function init() {
  const map = new MapboxMap();
  map.map.on('load', () => {
    map.enableReCentering();
    map.getUserLocation();
    map.addZoomControl();
    map.enable3D();
    enableSearch();
  });
}

document.addEventListener('DOMContentLoaded', (init));
