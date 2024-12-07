const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Deal = require('../models/deal.model');

const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const dealController = require('../controllers/deal.controller');
const upload = require('../middleware/file.middleware'); 
 

// GET all deals
router.get('/', dealController.getAllDeals);

// POST create a new deal
router.post(
    '/', 
    verifyToken, 
    verifyAdmin, 
    upload.fields([{ name: 'imagePath', maxCount: 1 }, { name: 'barcodePath', maxCount: 1 }]),
    dealController.addNewDeal
);
// router.post('/', verifyToken, verifyAdmin, upload.single('image'), dealController.addNewDeal);

// Route to get a specific deal by ID
router.get('/id/:id', dealController.getDealById);
//http://localhost:5000/api/deals/id/674b6eea083e2ffc1296ac46

// Route definitions with category parameters
// router.post('/new', dealController.catalog("new"));
// router.post('/popular', dealController.catalog("popular"));
// router.post('/sale', dealController.catalog("sale"));

module.exports = router;
