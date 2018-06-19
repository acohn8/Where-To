function makeGeoJson() {
  return {
    id: 'venues',
    type: 'circle',
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
    paint: {
      'circle-radius': 9,
      'circle-color': '#8a8acb',
    },
  };
}
