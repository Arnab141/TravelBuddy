const express = require('express');
const { postTrip, requestTrip, allTrips, joinTrip } = require('../controller/TripController');

const TripRoute = express.Router();

// Routes
// TripRoute.get('/:id', getTripById);
TripRoute.post('/post-trip', postTrip);
TripRoute.post('/request-trip', requestTrip);
TripRoute.get('/all-trips', allTrips);
TripRoute.post('/join-trip', joinTrip);

module.exports = TripRoute;