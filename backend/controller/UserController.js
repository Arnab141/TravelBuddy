const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/UserModel.js');

// Register a new user
const register = async (req, res) => {

  const { name, email, password } = req.body;
  const profileImage = req.file ? req.file.path : 'https://via.placeholder.com/150';

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
const login = async (req, res) => {
  // console.log(req.body)
  const { email, password } = req.body;
  try {
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//forget password
const nodemailer = require('nodemailer');
let otpStore = {};


const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = otp;

    // Send OTP via email (configure nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'your_email@gmail.com', pass: 'your_password' },
    });

    await transporter.sendMail({
      from: 'your_email@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`,
    });

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//verify otp


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (otpStore[email] !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    
    delete otpStore[email]; // Clear OTP after successful verification
    res.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// reset password

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports = { register, login, forgetPassword, verifyOtp, resetPassword };