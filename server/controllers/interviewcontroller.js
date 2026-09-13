import resume from "../models/resumemodel.js";
import interviewsession from "../models/interviewsessionmodel.js";
import fs from "fs";
import pdf from "pdf-parse-new";
const uploadresume = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                sucess: false,
                message: "no resume uploaded"
            });
        }
        const fileBuffer = fs.readFileSync(req.file.path);

        const pdfData = await pdf(fileBuffer);

        const resumeText = pdfData.text;
        const newresume = await resume.create({
            userid: req.userid,
            originalname: req.file.originalname,
            filename: req.file.filename,
            filepath: req.file.path,
              text: resumeText
        });

        return res.status(201).json({
            sucess: true,
            message: "resume uploaded successfully",
            resumeid: newresume._id
        });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            sucess: false,
            message: error.message
        });

    }
};

/**
 * GET /api/hr/history
 * Fetches all interview sessions for the authenticated user, sorted by newest first.
 * Excludes heavy data like conversation transcript arrays and raw resume text.
 */
const getInterviewHistory = async (req, res) => {
  try {
    // 1. Get logged in user using req.userid (populated by isauth middleware)
    const userId = req.userid;
    if (!userId) {
      return res.status(401).json({ 
        sucess: false, 
        message: "Unauthorized. User session not found." 
      });
    }

    // 2. Fetch all InterviewSession documents belonging to that user
    // 3. Sort by newest first
    // 4 & 5. Exclude conversation array and resume text
    // 6. Return only: sessionid (_id), interviewtype, difficulty, experience, status, duration, createdAt, feedback.overallscore
    const history = await interviewsession.find({ userid: userId })
      .select('_id interviewtype difficulty experience status duration createdAt feedback.overallscore')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      sucess: true,
      history
    });
  } catch (error) {
    console.error("Error in getInterviewHistory controller:", error);
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error. Failed to retrieve interview history."
    });
  }
};


export {uploadresume, getInterviewHistory};