const express = require('express');
const router = express.Router();
const controller = require('../controllers/content.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

router.get('/', controller.getAllContent);

router.get('/:name', controller.getContentByName);

router.put('/:name', verifyToken, verifyAdmin, controller.setContentByName);

module.exports = router;
