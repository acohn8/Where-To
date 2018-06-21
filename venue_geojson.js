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
      'circle-color': '#8a8acb',
      'circle-radius': 4.5,
      'circle-stroke-width': 1.2,
      'circle-stroke-color': '#ffffff',
    },

  };
}
