const express = require('express');
const multer = require('multer');
const { register, login, resetPassword, verifyOtp, forgetPassword, getUser, updateUser } = require('../controller/UserController');
const authenticateUser = require('../auth/UserAuth');

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
UserRoute.post('/register', register);
UserRoute.post('/login', login);
UserRoute.post('/me', authenticateUser, getUser);
UserRoute.post('/update', authenticateUser, upload.single('profileImage'), updateUser);

UserRoute.post('/forget-password', forgetPassword);
UserRoute.post('/verify-otp', verifyOtp);
UserRoute.post('/reset-password', resetPassword);

module.exports = UserRoute;