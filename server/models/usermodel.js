import mongoose from "mongoose";
const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        Unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    credits:{
        type:Number,
        default:50
    }
},{timestamps:true})
const user  = mongoose.model("User",userschema)
export default user