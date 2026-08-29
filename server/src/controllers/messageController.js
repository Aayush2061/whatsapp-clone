const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const {getReceiverSocketId,getIO} = require('../socket/socket');

//Send a new message in a conversation
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ message: 'conversationId and content are required' });
    }

    const message = await Message.create({
      conversationId,
      sender: req.userId,
      content,
    });

    const conversation = await Conversation.findById(conversationId);

    // Un-hide this conversation for everyone, since there's new activity
    conversation.hiddenFor = [];
    conversation.lastMessage = message._id;
    await conversation.save();

    const fullMessage = await Message.findById(message._id).populate('sender', 'username profilePic isOnline');

    const receiverId = conversation.participants.find(
      (participantId) => participantId.toString() !== req.userId
    );

    if (receiverId) {
      const receiverSocketId = getReceiverSocketId(receiverId.toString());
      if (receiverSocketId) {
        getIO().to(receiverSocketId).emit('newMessage', fullMessage);
      }
    }

    res.status(201).json(fullMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};


//Get all the message in the conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    const deletedEntry = conversation?.deletedFor.find(
      (d) => d.user.toString() === req.userId
    );

    const filter = { conversationId };
    if (deletedEntry) {
      filter.createdAt = { $gt: deletedEntry.deletedAt }; // only messages sent AFTER the delete
    }

    const messages = await Message.find(filter)
      .populate('sender', 'username profilePic')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};