const express=require('express')
const router=express.Router();
const protectroute = require('../middleware/authMiddleware.js');
const roomController = require('../controllers/roomController.js');
router.post('/create',protectroute,roomController.createRoom)
router.get('/list',protectroute,roomController.getRooms)
module.exports=router