const express=require('express')
const Room = require('../models/Room.js');
const createRoom=async (req,res)=>{
    const {name} = req.body;
try {
    const userId=req.user.user.id
    const newRoom = new Room({ name, createdby: userId })
     await newRoom.save()
     return res.status(201).json({msg:"Room created"})
} catch (error) {
    return res.status(500).json({msg:"Invalid credentials"})
}
}

const getRooms=async (req,res)=>{
    try {
        const rooms=await Room.find({})
        return res.status(200).json({rooms})   
    } catch (error) {
        return res.status(500).json({msg:"Unable to retrieve data"})
    }
}

module.exports = { createRoom, getRooms }