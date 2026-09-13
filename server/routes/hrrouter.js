import express from "express"
import {starthrinterview,getInterviewSession, submitAnswer,getFeedback} from "../controllers/hrcontroller.js"
import isauth from "../middlewares/isauth.js"
const hrrouter = express.Router()
hrrouter.post("/start",isauth,starthrinterview)
hrrouter.get("/session/:sessionid",isauth,getInterviewSession)
hrrouter.post("/answer",isauth,submitAnswer)
hrrouter.get(
    "/feedback/:sessionid",
    isauth,
    getFeedback
);
export default hrrouter