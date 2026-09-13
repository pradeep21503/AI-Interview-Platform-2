import express from "express"
import {uploadresume,  getInterviewHistory } from "../controllers/interviewcontroller.js";
import upload from "../middlewares/multer.js";
import isauth from "../middlewares/isauth.js"
const interviewrouter = express.Router()
interviewrouter.post(
  "/upload-resume",
  isauth,
  upload.single("resume"),
  uploadresume
);
interviewrouter.get('/history', isauth, getInterviewHistory);
export default interviewrouter