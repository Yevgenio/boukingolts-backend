const express = require('express');
const router = express.Router();

const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const eventController = require('../controllers/event.controller');
const upload = require('../middleware/file.middleware'); 

// GET all products
router.get('/', eventController.getAllEvents);         

// Route to get a specific event by ID
router.get('/id/:id', eventController.getEventById);

router.get('/search', eventController.searchEvents);    // GET product by query

// POST new product
router.post(
    '/',
    verifyToken, 
    verifyAdmin, 
    upload.fields([
        { 
            name: 'imagePath', 
            maxCount: 1 
        }
    ]),
    eventController.addNewEvent
);

// PUT update product by ID
router.put('/id/:id', 
    verifyToken, 
    verifyAdmin, 
    upload.fields([
        { 
            name: 'imagePath', 
            maxCount: 1 
        }
    ]),
    eventController.updateEventById);  

// DELETE product by ID
router.delete('/id/:id',
    verifyToken, 
    verifyAdmin, 
    eventController.deleteEventById
); 

// Route definitions with category parameters
// router.post('/new', eventController.catalog("new"));
// router.post('/popular', eventController.catalog("popular"));
// router.post('/sale', eventController.catalog("sale"));

module.exports = router;
