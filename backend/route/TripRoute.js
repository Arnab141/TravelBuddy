const express = require('express');
const { postTrip, requestTrip, allTrips } = require('../controller/TripController');

const TripRoute = express.Router();

// Routes
TripRoute.post('/post-trip', postTrip);
TripRoute.post('/request-trip', requestTrip);
TripRoute.get('/all-trips', allTrips);

module.exports = TripRoute;