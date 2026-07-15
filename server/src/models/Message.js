const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        conversationId: {type:mongoose.Schema.Types.ObjectId, ref:'Conversation', required:true},
        sender: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
        content:{type:String, trim:true},
        mediaUrl: { type: String, default: '' }, // for images/files, filled in later phase
        status:{
            type:String,
            enum:['sent','delivered','seen'],
            default:'sent'
        },
        readBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}], //users who have read the message
    },
    {timestamps:true}
)

module.exports = mongoose.model('Message', messageSchema);