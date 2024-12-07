const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Chat = require('../models/chat.model');

const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const chatController = require('../controllers/chat.controller');
const upload = require('../middleware/file.middleware'); 

// GET all chats
router.get('/', chatController.getAllChats);

// POST create a new chat
// router.post('/', verifyToken, verifyAdmin, chatController.addNewChat);
// POST create a new deal
router.post(
    '/',
    verifyToken, 
    verifyAdmin, 
    upload.fields([{ name: 'imagePath', maxCount: 1 }]),
    chatController.addNewChat
);
// router.post('/', verifyToken, verifyAdmin, upload.single('image'), dealController.addNewDeal);


// Route to get a specific chat by ID
router.get('/id/:id', chatController.getChatById);

// Route definitions with category parameters
// router.post('/new', chatController.catalog("new"));
// router.post('/popular', chatController.catalog("popular"));
// router.post('/sale', chatController.catalog("sale"));

module.exports = router;
