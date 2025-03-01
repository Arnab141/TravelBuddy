const mongoose = require('mongoose');

const tripParticipantSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  users: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      host: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const TripParticipant = mongoose.model('TripParticipant', tripParticipantSchema);

module.exports = TripParticipant;
