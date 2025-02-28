const express = require('express');
const multer = require('multer');
const { register, login } = require('../controller/UserController');

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

module.exports = UserRoute;