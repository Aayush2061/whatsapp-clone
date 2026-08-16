const express = require('express');
const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const {getConversations, accessConversation,deleteConversation} = require('../controllers/conversationController');

router.get('/',protect,getConversations);
router.post('/',protect,accessConversation);
router.delete('/:conversationId', protect, deleteConversation);

module.exports = router;
