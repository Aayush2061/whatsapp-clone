const express = require('express');
const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const {getConversations, accessConversation} = require('../controllers/conversationController');

router.get('/',protect,getConversations);
router.post('/',protect,accessConversation);

module.exports = router;
