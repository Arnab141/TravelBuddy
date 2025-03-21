const mongoose = require('mongoose');

const tripRequestSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickupPoint: {
    location: { type: String, required: true },
    price: { type: Number, required: true },
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TripRequestToJoin = mongoose.model.TripRequestToJoin|| mongoose.model('TripRequestToJoin', tripRequestSchema);

module.exports = TripRequestToJoin;
