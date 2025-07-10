const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { verifyToken , verifyAdmin } = require('../middleware/auth.middleware');
const productController = require('../controllers/product.controller');
const { upload , processUploadedImages , manageProductImages  } = require('../middleware/file.middleware');
 

// GET all products
router.get('/', productController.getAllProducts);

// GET products ordered by rank
router.get('/ranked', productController.getProductsByRank);

// GET featured products
router.get('/featured', productController.getFeaturedProducts);

// GET product by ID
router.get('/id/:id', productController.getProductById); 
 
// GET products by query
router.get('/search', productController.searchProducts);

// GET distinct categories
router.get('/categories', productController.getDistinctCategories);

// POST new product
router.post(
    '/', 
    verifyToken, // Verify user token
    verifyAdmin, // Verify admin access
    upload, // Upload images
    processUploadedImages, // Process uploaded images
    manageProductImages,
    productController.addNewProduct // Add new product
);

// PUT update product by ID
router.put(
    '/id/:id',
    verifyToken, // Verify user token
    verifyAdmin, // Verify admin access
    upload, // Upload images
    processUploadedImages, // Process uploaded images
    manageProductImages,
    productController.updateProductById // Update product by ID
  );

// DELETE product by ID
router.delete(
    '/id/:id',
    verifyToken,
    verifyAdmin,
    productController.deleteProductById
  ); 
  
module.exports = router;
