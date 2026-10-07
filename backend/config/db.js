const mongoose=require('mongoose')
const connectdb=async()=>{
    try {
       const connect=await mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB connected"))
    } catch (error) {
        console.log("DB not connect",error)
    }
}
module.exports=connectdb