function getUserLocation {
  navigator.geolocation.getCurrentPosition((position) => {
    resolve([position.coords.longitude, position.coords.latitude]);
  })
}