const jwt = require('jsonwebtoken');
const User = require('../models/user.model'); // Ensure you have your User model

exports.verifyToken = async (req, res, next) => {
  try {
    // Ensure the authorization header exists and is in the correct format
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'No token provided or incorrect format.' });
    }

    // Extract token from 'Bearer token'
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token

    // Check if the user exists in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token, user not found.' });
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Unauthorized: Invalid token.' });
  }
};

// Middleware to check if the user is an admin
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only.' });
  }

  next(); // Proceed to the next middleware if admin
};
