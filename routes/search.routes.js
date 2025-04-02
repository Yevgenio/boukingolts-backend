const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const searchController = require('../controllers/search.controller');
const upload = require('../middleware/file.middleware'); 
 

// GET global search
router.get('/', searchController.globalSearch);

// GET search by ID
router.get('/log/id/:id', searchController.getSearchLogById); 
 
// GET searches by query
router.get('/log', searchController.getSearchLogHistory);

// // POST new search
// router.post('/', searchController.addNewSearch);

// // PUT update search by ID
// router.put('/id/:id',
//     verifyToken, 
//     verifyAdmin, 
//     upload.fields([{ name: 'imagePath', maxCount: 1 }, { name: 'barcodePath', maxCount: 1 }]),
//     searchController.updateSearchById
// );

// // DELETE search by ID
// router.delete('/id/:id', 
//     verifyToken, 
//     verifyAdmin, 
//     searchController.deleteSearchById
// );
// router.post('/', verifyToken, verifyAdmin, upload.single('image'), searchController.addNewSearch);

// Route definitions with category parameters
// router.post('/new', searchController.catalog("new"));
// router.post('/popular', searchController.catalog("popular"));
// router.post('/sale', searchController.catalog("sale"));

module.exports = router;
