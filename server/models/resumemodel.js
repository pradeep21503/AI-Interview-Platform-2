import mongoose from "mongoose"
const resumeschema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

   originalname: {
    type: String,
    required: true,
},

filename: {
    type: String,
    required: true,
},

filepath: {
    type: String,
    required: true,
},
text:{
        type:String,
        required:true
    }



},{
    timestamps:true
})
const resume = mongoose.model("Resume",resumeschema)
export default resume