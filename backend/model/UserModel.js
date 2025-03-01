const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150',
  },
  trips: {
    type: [
      {
        origin: { type: String, required: true },
        destination: { type: String, required: true },
        date: { type: Date, default: Date.now }, 
      },
    ],
    default: [], 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
