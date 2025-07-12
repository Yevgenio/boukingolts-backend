const express = require('express');
const router = express.Router();
const controller = require('../controllers/content.controller');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const { upload, processUploadedImages, manageImages } = require('../middleware/file.middleware');

router.get('/', controller.getAllContent);

router.get('/:name', controller.getContentByName);

router.put(
  '/:name',
  verifyToken,
  verifyAdmin,
  upload,
  processUploadedImages,
  manageImages,
  controller.setContentByName
);

module.exports = router;
