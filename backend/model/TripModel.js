// const mongoose = require('mongoose');

// const tripSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   origin: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   destination: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   originCoords: {
//     type: [Number], // Format: [latitude, longitude]
//     required: true,
//   },
//   destinationCoords: {
//     type: [Number], // Format: [latitude, longitude]
//     required: true,
//   },
//   date: {
//     type: Date,
//     required: true,
//   },
//   time: {
//     type: String,
//     required: true,
//   },
//   seatsAvailable: {
//     type: Number,
//     required: true,
//   },
//   pricePerSeat: {
//     type: Number,
//     required: true,
//   },
//   vehicle: {
//     type: String,
//     required: true,
//   },
//   pickupPoint: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     trim: true,
//   },
//   mobileNumber: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   participants: {
//     type: [
//       {
//         userId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'User',
//         },
//         joinedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     default: [], 
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

// module.exports = Trip;




const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  origin: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  originCoords: {
    type: [Number], // Format: [latitude, longitude]
    required: true,
  },
  destinationCoords: {
    type: [Number], // Format: [latitude, longitude]
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  pickupPoints: [
    {
      location: { type: String, required: true },
      price: { type: Number, required: true },
    }
  ],
  description: {
    type: String,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  participants: {
    type: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        selectedPickup: {
          location: { type: String, required: true },
          price: { type: Number, required: true },
        },
      },
    ],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);

module.exports = Trip;
