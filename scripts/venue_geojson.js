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
      'circle-color': '#F15A2D',
      'circle-radius': 6,
      'circle-stroke-width': 1.7,
      'circle-stroke-color': '#ffffff',
    },
  };
}
