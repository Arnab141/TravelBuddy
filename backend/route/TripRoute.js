const express = require('express');
const { postTrip, requestTrip, allTrips, joinTrip, getUserTrip, requestToJoinTrip, getRequestMessage, respondToRequest, leaveTrip } = require('../controller/TripController');
const authenticateUser = require('../auth/UserAuth');
const TripRoute = express.Router();

// Routes
// TripRoute.get('/:id', getTripById);
TripRoute.post('/post-trip', postTrip);
TripRoute.post('/request-trip', requestTrip);
TripRoute.get('/all-trips', allTrips);
TripRoute.post('/join-trip', joinTrip);
TripRoute.post('/leave-trip', leaveTrip);
TripRoute.post('/request-to-join', requestToJoinTrip);
TripRoute.get('/get-request-message',authenticateUser, getRequestMessage);
TripRoute.post('/respond-to-request',authenticateUser, respondToRequest);
TripRoute.get('/get-user-trip',authenticateUser ,getUserTrip);

module.exports = TripRoute;