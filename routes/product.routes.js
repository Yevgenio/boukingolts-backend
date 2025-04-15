const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const productController = require('../controllers/product.controller');
const upload = require('../middleware/file.middleware'); 
 

// GET all products
router.get('/', productController.getAllProducts);

// GET product by ID
router.get('/id/:id', productController.getProductById); 
 
// GET products by query
router.get('/search', productController.searchProducts);

// GET distinct categories
router.get('/categories', productController.getDistinctCategories);

// POST new product
router.post(
    '/', 
    verifyToken, 
    verifyAdmin, 
    upload.fields([
      { name: 'images', maxCount: 10 }, // Allow up to 10 images
    ]),
    productController.addNewProduct
);

// PUT update product by ID
router.put(
    '/id/:id',
    verifyToken,
    verifyAdmin,
    upload.fields([
      { name: 'images', maxCount: 10 }, // Allow up to 10 images
    ]),
    productController.updateProductById
  );

// DELETE product by ID
router.delete(
    '/id/:id',
    verifyToken,
    verifyAdmin,
    productController.deleteProductById
  ); 
  
module.exports = router;
