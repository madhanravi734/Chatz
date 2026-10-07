const express=require('express')
const router=express.Router();
const protectroute = require('../middleware/authMiddleware.js');
const messageController = require('../controllers/messageController.js');
router.get('/:roomId',protectroute,messageController.getMessages)
module.exports=router