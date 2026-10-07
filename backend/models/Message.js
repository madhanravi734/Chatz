const mongoose=require('mongoose')

const messageSchema=new mongoose.Schema({
    chat:{
     type:String,
     required:true
    },
   sentby:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
    room:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Room",
    required:true
   },
},
{
    timestamps:true,

}
)
module.exports=mongoose.model("Message",messageSchema)