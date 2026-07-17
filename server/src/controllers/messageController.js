const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const {getReceiverSocketId,getIO} = require('../socket/socket');

//Send a new message in a conversation
exports.sendMessage = async(req, res) => {
    try{
        const {conversationId,content} = req.body;

        if(!conversationId || !content){
            return res.status(400).json({message:'conversationId and content are required'});
        }

        const message = await Message.create({
            conversationId,
            sender:req.userId,
            content,
        })

        //Update the lastMessage field in the conversation 
        await Conversation.findByIdAndUpdate(conversationId, {lastMessage:message._id});

        const fullMessage = await Message.findById(message._id).populate('sender','username profilePic isOnline');

        // res.status(201).json(fullMessage);

        //Find the conversation to know who the other participant is
        const conversation = await Conversation.findById(conversationId);
        const receiverId = conversation.participants.find(
            (participantId) =>participantId.toString() !== req.userId
        );

        if(receiverId){
            const receiverSocketId = getReceiverSocketId(receiverId.toString());
            if(receiverSocketId){
                //Send the message to the receiver via socket.io
                getIO().to(receiverSocketId).emit('newMessage', fullMessage);
            }
        }

        res.status(201).json(fullMessage);
    }catch(error){
        res.status(500).json({message:'Failed to send message', error:error.message});
    }
}


//Get all the message in the conversation
exports.getMessages = async(req, res) => {
    try{
        const {conversationId} = req.params;

        const messages = await Message.find({conversationId})
        .populate('sender','username profilePic')
        .sort({createdAt:1}); //sort by created time, oldest first
        
        res.status(200).json(messages);
    }catch(error){
        res.status(500).json({message:'Failed to fetch messages', error:error.message});
    }
}