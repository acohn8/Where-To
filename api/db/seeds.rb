Place.create(foursquare_id: '5642aef9498e51025cf4a7a5')
User.create(name: 'Bob')
Review.create(content: 'This place is good', user: User.first, place: Place.first)