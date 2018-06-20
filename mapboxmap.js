mapboxgl.accessToken = '';

let loadedMap;

class MapboxMap {
  constructor() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [-98.5795, 39.8283],
      zoom: 4,
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
    }));
  }

  plotVenues() {
    this.map.addLayer(makeGeoJson());
    this.createBoundingBox();
  }


  createBoundingBox() {
    const boundingBox = turf.bbox(this.map.getSource('venues')._data);
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
}

function init() {
  const map = new MapboxMap();
  map.getUserLocation();
  map.enableReCentering();
  enableSearch();
}

document.addEventListener('DOMContentLoaded', (init));

