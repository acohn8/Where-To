function makeGeoJson() {
  return {
    id: 'venues',
    type: 'symbol',
    source: {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: Venue.all.map(venue => ({
          type: 'Feature',
          properties: {
            foursquareId: venue.foursquareId,
            name: venue.name,
          },
          geometry: {
            type: 'Point',
            coordinates: [venue.longitude, venue.latitude],
          },
        })),
      },
    },
    layout: {
      'icon-image': 'marker-15',
      'icon-size': 2,
    },
    paint: {},
  };
}
