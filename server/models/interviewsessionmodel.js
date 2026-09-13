import mongoose from "mongoose";

const interviewsessionschema = new mongoose.Schema({

    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    resumeid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resume",
        required:true
    },

    interviewtype:String,

    difficulty:String,

    experience:String,

    duration:Number,

    status:{
        type:String,
        default:"active"
    },
    currentquestion: {
            type: Number,
            default: 1
     },

   totalquestions: {
            type: Number,
            default: 5
     },

    conversation: [
            {
                question: String,
                answer: String
            }
    ],
    feedback: {
    overallscore: Number,
    communication: Number,
    confidence: Number,
    hrskills: Number,
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    roadmap: String
}

},{
    timestamps:true
});

const interviewsession = mongoose.model(
    "InterviewSession",
    interviewsessionschema
);

export default interviewsession;