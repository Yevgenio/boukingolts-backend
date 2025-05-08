const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.verifyToken = async (req, res, next) => {

  console.log('Verifying token...');
  let access_token = req.cookies?.access_token;
  let refresh_token = req.cookies?.refresh_token;

  // Support mobile clients (Authorization header)
  if (!access_token && req.headers.authorization?.startsWith('Bearer ')) {
    access_token = req.headers.authorization.split(' ')[1];
    refresh_token = req.body?.refreshToken || req.cookies?.refresh_token;
  }

  if (access_token) {
    console.log('Access token found:', access_token);
    try {
      const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
      const userId = decoded.userId;
      const user = await User.findById(userId).select('-password');

      req.user = user; // Attach user to request object
      return next();
    } catch (err) {
      if (err.name !== 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid access token' });
      }
      // fall through to refresh handling
    }
  }
  console.log('Access token expired or not found:', access_token);
  // Try refreshing if access token is missing or expired
  if (refresh_token) {
    console.log('Refresh token found:', refresh_token);
    try {
      const decodedRefresh = jwt.verify(refresh_token, process.env.JWT_SECRET);
      const userId = decodedRefresh.userId;
      const user = await User.findById(userId).select('-password');

      req.user = user; // Attach user to request object

      const newAccessToken = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Send new access token as cookie
      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      
      console.log('User found:', user);
      return next();
    } catch (refreshErr) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  }
  console.log('No valid token found:', access_token, refresh_token);
  return res.status(403).json({ message: 'No valid token provided' });
};

// Middleware to check if the user is an admin
exports.verifyAdmin = (req, res, next) => {
  console.log('User:', req.user); // Log the user ID for debugging
  const user = req.user;
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only.' });
  }
  console.log('User is admin, proceeding...');
  next();
};
