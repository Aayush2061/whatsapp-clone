const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true}
        ],
        isGroup: {type:Boolean, default:false},
        groupName: {type:String, default:''}, //only used when isGroup is true
        groupAdmin: {type:mongoose.Schema.Types.ObjectId, ref:'User'}, //only used when isGroup is true
        lastMessage: {type:mongoose.Schema.Types.ObjectId, ref:'Message'},
    },
    {timestamps:true}
)

module.exports = mongoose.model('Conversation', conversationSchema);