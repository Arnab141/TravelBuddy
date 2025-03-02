const express = require('express');
const multer = require('multer');
const { register, login, resetPassword, verifyOtp, forgetPassword  } = require('../controller/UserController');

const UserRoute = express.Router();

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
UserRoute.post('/register', upload.single('profileImage'), register);
UserRoute.post('/login', login);

UserRoute.post('/forget-password',forgetPassword);
UserRoute.post('/verify-otp',verifyOtp);
UserRoute.post('/reset-password',resetPassword);

module.exports = UserRoute;