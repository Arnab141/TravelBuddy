const jwt = require('jsonwebtoken');
const UserModel = require('../model/UserModel');

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found, authorization denied' });
    }
    req.body.userId = req.user._id; // Store user ID in req.body
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authenticateUser;
