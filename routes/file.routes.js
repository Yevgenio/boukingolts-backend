const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');

// Route to handle static file requests
router.get('/:file', fileController.serveFile);

module.exports = router;
