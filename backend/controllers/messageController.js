const express=require('express')
const Message = require('../models/Message.js');
const getMessages=async (req,res)=>{
try {
    const {roomId}=req.params
    const messages = await Message.find({room:roomId}).sort({createdAt:1})
    return res.status(200).json({messages})
} catch (error) {
    return res.status(500).json({msg:"No messages found"})
}
}
module.exports={getMessages}