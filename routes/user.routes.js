const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // Ensure you have a User model

// Fetch user profile by username
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Removing sensitive information
    const { password, ...userData } = user.toObject();

    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
