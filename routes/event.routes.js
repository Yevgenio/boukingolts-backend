const express = require('express');
const router = express.Router();

const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const eventController = require('../controllers/event.controller');
const { upload, processUploadedImages, manageImages } = require('../middleware/file.middleware');


// GET all products
router.get('/', eventController.getAllEvents);         

// Route to get a specific event by ID
router.get('/id/:id', eventController.getEventById);

router.get('/search', eventController.searchEvents);    // GET product by query

// GET distinct categories
router.get('/categories', eventController.getDistinctCategories);

// POST new product
router.post(
    '/',
    verifyToken, 
    verifyAdmin, 
    upload,
    processUploadedImages,
    manageImages,
    eventController.addNewEvent
);

// PUT update product by ID
router.put('/id/:id', 
    verifyToken, 
    verifyAdmin, 
    upload,
    processUploadedImages,
    manageImages,
    eventController.updateEventById
);

// DELETE product by ID
router.delete('/id/:id',
    verifyToken, 
    verifyAdmin, 
    eventController.deleteEventById
); 

module.exports = router;
