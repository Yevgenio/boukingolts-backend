const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const authController = require('../controllers/auth.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// const User = require('../models/user.model');

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/settings', verifyToken, authController.settings);

router.get('/profile', verifyToken, authController.settings);

// router.get('/is-admin', authController.isAdmin)

module.exports = router;