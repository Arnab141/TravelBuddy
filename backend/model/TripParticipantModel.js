// const mongoose = require('mongoose');

// const tripParticipantSchema = new mongoose.Schema({
//   tripId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Trip',
//     required: true,
//   },
//   users: [
//     {
//       userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//       },
//       host: {
//         type: Boolean,
//         default: false,
//       },
//     },
//   ],
// });

// const TripParticipant = mongoose.model('TripParticipant', tripParticipantSchema);

// module.exports = TripParticipant;



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
      pickupPoint: {
        location: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    },
  ],
});

const TripParticipant = mongoose.model('TripParticipant', tripParticipantSchema);

module.exports = TripParticipant;
