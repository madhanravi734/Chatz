const express = require('express');
const jwt=require('jsonwebtoken')

const protectroute=(req,res,next)=>{
    const token=req.headers.authorization?.split('Bearer')?.[1]?.trim()
    if(!token){
        return res.status(401).json({ message: "Not authorized, token missing" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token failed" });
    }
}
module.exports = protectroute;