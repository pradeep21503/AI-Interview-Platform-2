import express from "express";
import isauth from "../middlewares/isauth.js";
import { startDsaInterview, getDsaInterviewSession, respondDsaInterview } from "../controllers/DsaController.js";

const dsarouter = express.Router();

// Start DSA Interview
dsarouter.post("/start", isauth, startDsaInterview);
dsarouter.get("/session/:sessionId", isauth, getDsaInterviewSession);
dsarouter.post("/respond", isauth, respondDsaInterview);

export default dsarouter;