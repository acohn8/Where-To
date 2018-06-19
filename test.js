function createVenuePoints() {
  return Venue.all.map(venue => ({
    type: 'Feature',
    properties: {
      name: venue.name,
    },
    geometry: {
      type: 'Point',
      coordinates: [venue.longitude, venue.latitude],
    },
  }));
}

loadedMap.map.addLayer({
  id: 'places',
  type: 'circle',
  source: {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: createVenuePoints(),
    },
  },
  paint: {
    'circle-radius': 6,
    'circle-color': '#8a8acb',
  },
});
