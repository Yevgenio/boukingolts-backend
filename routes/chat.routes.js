const express = require('express');
const router = express.Router();

const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const chatController = require('../controllers/chat.controller');
const upload = require('../middleware/file.middleware'); 

// GET all deals
router.get('/', chatController.getAllChats);         

// Route to get a specific chat by ID
router.get('/id/:id', chatController.getChatById);

router.get('/search', chatController.searchChats);    // GET deal by query

// POST new deal
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
    chatController.addNewChat
);

// PUT update deal by ID
router.put('/id/:id', 
    verifyToken, 
    verifyAdmin, 
    upload.fields([
        { 
            name: 'imagePath', 
            maxCount: 1 
        }
    ]),
    chatController.updateChatById);  

// DELETE deal by ID
router.delete('/id/:id',
    verifyToken, 
    verifyAdmin, 
    chatController.deleteChatById
); 

// Route definitions with category parameters
// router.post('/new', chatController.catalog("new"));
// router.post('/popular', chatController.catalog("popular"));
// router.post('/sale', chatController.catalog("sale"));

module.exports = router;
