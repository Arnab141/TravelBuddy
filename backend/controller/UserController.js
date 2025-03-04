const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/UserModel.js');
const fs = require('fs');
const path = require('path');
const url = "http://localhost:5000";

// Register a new user
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const profileImage = '';

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
      expiresIn: '30d',
    });

    res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
const login = async (req, res) => {
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

// Get user by token
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user



const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.file) {
      // Ensure the old image exists and is not a default placeholder
      if (user.profileImage && user.profileImage.startsWith('uploads/')) {
        const oldImagePath = path.join(__dirname, '..', user.profileImage);
        
        // Delete the old image only if it exists
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (unlinkError) {
            console.error('Error deleting old profile image:', unlinkError);
          }
        }
      }

      // Store new image path
      user.profileImage = `uploads/${req.file.filename}`;
    }

    await user.save();

    // Send back full URL
    const fullImageUrl = `${req.protocol}://${req.get('host')}/${user.profileImage}`;
    res.status(200).json({ message: 'User updated successfully', user: { ...user._doc, profileImage: fullImageUrl } });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Forget password
const nodemailer = require('nodemailer');
let otpStore = {};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    otpStore[email] = otp;

    // Send OTP via email (configure nodemailer)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'your_email@gmail.com', pass: 'your_password' }, // Your email (sender)
    });

    await transporter.sendMail({
      from: 'your_email@gmail.com', // Your email (sender)
      to: email, // User's email (receiver)
      subject: 'Password Reset OTP',
      text: `Your OTP is: ${otp}`,
    });

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Verify OTP
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

// Reset password
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

module.exports = { register, login, getUser, updateUser, forgetPassword, verifyOtp, resetPassword };