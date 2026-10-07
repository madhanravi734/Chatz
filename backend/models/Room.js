const mongoose=require('mongoose')

const roomSchema=new mongoose.Schema({
    name:{
     type:String,
     required:true
    },
   createdby:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
})
module.exports=mongoose.model("Room",roomSchema)