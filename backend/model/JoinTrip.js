const mongoose = require('mongoose');

const joinedTripSchema = new mongoose.Schema({
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seatsBooked: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
  joinedAt: { type: Date, default: Date.now },
});

const JoinedTrip = mongoose.models.JoinedTrip || mongoose.model('JoinedTrip', joinedTripSchema);
module.exports = JoinedTrip;
