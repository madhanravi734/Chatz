const express=require('express')
const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');
const User=require('../models/User.js')

const signup=async (req,res)=>{
    const { username, password,email} = req.body;
try {
    let existingUser=await User.findOne({$or:[{username:username},{email:email}]})
    if(existingUser){
        return res.status(400).json({msg:"User or email already exists"})
    }
  const user = new User({ username, password,email});
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    return res.status(201).json({msg:"User created"})
} catch (error) {
    return res.status(500).json({msg:"Invalid credentials"})
}
}

const login=async (req,res)=>{
    const { username, password} = req.body;
    try {
        let existingUser=await User.findOne({username})
       if (!existingUser){
         return res.status(400).json({msg:"No user found"})
       }
       const isMatch=await bcrypt.compare(password,existingUser.password)
       if (!isMatch){
        return res.status(401).json({msg:"Invalid credentials"})
       }
       const payload={
        user:{
            id:existingUser.id
        },
       }
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({msg:"Invalid credentials"})
    }
}

module.exports = { signup,login}