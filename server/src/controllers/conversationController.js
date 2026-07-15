const Conversation = require('../models/Conversation');

// Get all conversations for the logged-in user (for the chat list sidebar)
exports.getConversations = async (req, res) => {
    try{
        const conversations = await Conversation.find({participants:req.userId})
        .populate('participants','username profilePic isOnline')
        .populate('lastMessage')
        .sort({updatedAt:-1}); //sort by last updated time, most recent first
        
        res.status(200).json(conversations);
    }catch(error){
        res.status(500).json({message:'Failed to fetch conversations', error:error.message});
    }
}

//Get or create a 1:1 conversation between two users
exports.accessConversation = async (req, res) => {
    try{
        const {userId} = req.body;

        if(!userId){
           return res.status(400).json({message:'UserId is required'});
        }

        // Look for an existing 1:1 conversation containing exactly these two participants
        let conversation = await Conversation.findOne({
            isGroup:false,
            participants:{$all:[req.userId, userId], $size:2},
        })
        .populate('participants', 'username profilePic isOnline')
        .populate('lastMessage');

        if(conversation){
            return res.status(200).json(conversation);
        }

        // If no conversation exists, create a new one
        const newConversation = await Conversation.create({
            participants:[req.userId, userId],
            isGroup:false,
        });

        res.status(201).json(newConversation);
    }catch(error){
        res.status(500).json({message:'Server error',error:error.message});
    }
}


