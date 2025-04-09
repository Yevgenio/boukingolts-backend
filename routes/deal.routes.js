const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const dealController = require('../controllers/product.controller');
const upload = require('../middleware/file.middleware'); 
 

// GET all deals
router.get('/', dealController.getAllDeals);

// GET product by ID
router.get('/id/:id', dealController.getDealById); 
 
// GET deals by query
router.get('/search', dealController.searchDeals);

// GET distinct categories
router.get('/categories', dealController.getDistinctCategories);

// POST new product
router.post(
    '/', 
    verifyToken, 
    verifyAdmin, 
    upload.fields([
        { 
            name: 'imagePath', 
            maxCount: 1 }, 
        { 
            name: 'barcodePath', 
            maxCount: 1 }
    ]),
    dealController.addNewDeal
);

// PUT update product by ID
router.put(
    '/id/:id',
    verifyToken,
    verifyAdmin,
    upload.fields([
      { name: 'imagePath', maxCount: 1 },
      { name: 'barcodePath', maxCount: 1 },
    ]),
    dealController.updateDealById
  );

// DELETE product by ID
router.delete(
    '/id/:id',
    verifyToken,
    verifyAdmin,
    dealController.deleteDealById
  );
  
module.exports = router;
