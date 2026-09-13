import resume from "../models/resumemodel.js";
import interviewsession from "../models/interviewsessionmodel.js";
import user from "../models/usermodel.js"

const  starthrinterview = async (req, res) => {
    try {

        const {
            resumeid,
            interviewtype,
            difficulty,
            experience,
            duration
        } = req.body;
        const presentuser = await user.findById(req.userid);
 
        if (presentuser.credits < 50) {
            return res.status(400).json({
                sucess: false,
                message: "insufficient credits"
            });
        }
        
        const session = await interviewsession.create({
            userid: req.userid,
            resumeid,
            interviewtype,
            difficulty,
            experience,
            duration,
            status: "active"
        });
        presentuser.credits -= 50;
        await presentuser.save();
        return res.status(201).json({
            sucess: true,
            sessionid: session._id,
            message: "interview session created"
        });

    } catch (error) {

        return res.status(500).json({
            sucess: false,
            message: error.message
        });

    }
};
 const  getInterviewSession = async (req, res) => {
    try {

        const { sessionid } = req.params;

        const session = await interviewsession.findById(sessionid);
    
        if (!session) {
            return res.status(404).json({
                sucess: false,
                message: "Interview session not found"
            });
        }

        if (session.userid.toString() !== req.userid) {
            return res.status(403).json({
                sucess: false,
                message: "Unauthorized"
            });
        }
        if (session.status === "completed") {
            return res.status(400).json({
                sucess: false,
                message: "Interview already completed"
            });
        }
      if (session.conversation.length === 0) {

          const resumedata = await resume.findById(session.resumeid);

            if (!resumedata) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found",
                });
            }

            const response = await fetch(
                `${process.env.AI_SERVICE_URL}/generate-first-question`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        resume: resumedata.text,
                        difficulty: session.difficulty,
                        experience: session.experience,
                    }),
                }
            );

            if (!response.ok) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to generate AI question",
                });
            }

            const data = await response.json();

            session.conversation.push({
                question: data.question,
                answer: "",
            });

            await session.save();
}
        const currentQuestion =
            session.conversation[session.conversation.length - 1].question;

            return res.status(200).json({
                sucess: true,
                session,
                question: currentQuestion,
                currentquestion: session.conversation.length
                });
    } catch (error) {
        res.status(500).json({
            sucess: false,
            message: error.message
        });
    }
};
const submitAnswer = async (req, res) => {
    try {

        const { sessionid, answer } = req.body;

        const session = await interviewsession.findById(sessionid);

        if (!session) {
            return res.status(404).json({
                sucess: false,
                message: "Interview session not found"
            });
        }

        if (session.userid.toString() !== req.userid) {
            return res.status(403).json({
                sucess: false,
                message: "Unauthorized"
            });
        }

        if (session.status === "completed") {
            return res.status(400).json({
                sucess: false,
                message: "Interview already completed"
            });
        }

        // Save answer for the current question
        const lastQuestion =
            session.conversation[session.conversation.length - 1];

        lastQuestion.answer = answer;

      
        // If interview is complete, generate feedback later
//         if (session.conversation.length >= 5) {

//                 const resumedata = await resume.findById(session.resumeid);

//                 if (!resumedata) {
//                     return res.status(404).json({
//                         sucess: false,
//                         message: "Resume not found"
//                     });
//                 }

//                 const response = await fetch(
//                     "http://localhost:8001/generate-feedback",
//                     {
//                         method: "POST",
//                         headers: {
//                             "Content-Type": "application/json"
//                         },
//                         body: JSON.stringify({
//                             resume: resumedata.text,
//                             conversation: session.conversation
//                         })
//                     }
//                 );

//                 if (!response.ok) {
//                     const error = await response.json();

//                     return res.status(response.status).json({
//                         sucess: false,
//                         message: error.detail
//                     });
//                 }

//                 const feedback = await response.json();

//                 session.feedback = feedback;
//                 session.status = "completed";

//                 await session.save();

//                 return res.status(200).json({
//                     sucess: true,
//                     completed: true
//                 });
// }
        // Get resume text
        const resumedata = await resume.findById(session.resumeid);

        if (!resumedata) {
            return res.status(404).json({
                sucess: false,
                message: "Resume not found"
            });
        }

        // Ask FastAPI for the next question
        const response = await fetch(
            `${process.env.AI_SERVICE_URL}/generate-next-question`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resume: resumedata.text,
                    difficulty: session.difficulty,
                    experience: session.experience,
                    conversation: session.conversation
                })
            }
        );

        if (!response.ok) {

            const error = await response.json();

            return res.status(response.status).json({
                sucess: false,
                message: error.detail || "Failed to generate next question"
            });
        }

        const data = await response.json();
        if (data.completed) {

            const feedbackResponse = await fetch(
                `${process.env.AI_SERVICE_URL}/generate-feedback`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        resume: resumedata.text,
                        conversation: session.conversation
                    })
                }
            );

            if (!feedbackResponse.ok) {

                const error = await feedbackResponse.json();

                return res.status(feedbackResponse.status).json({
                    sucess: false,
                    message: error.detail
                });
            }

            const feedback = await feedbackResponse.json();

            session.feedback = feedback;
            session.status = "completed";

            await session.save();

            return res.status(200).json({
                sucess: true,
                completed: true
            });
}
        session.conversation.push({
            question: data.question,
            answer: ""
        });

        await session.save();

        return res.status(200).json({
            sucess: true,
            completed: false,
            question: data.question,
            currentquestion: session.conversation.length
        });

    } catch (error) {
        return res.status(500).json({
            sucess: false,
            message: error.message
        });
    }
};
const getFeedback = async (req, res) => {
    try {

        const { sessionid } = req.params;

        const session = await interviewsession.findById(sessionid);

        if (!session) {
            return res.status(404).json({
                sucess: false,
                message: "Interview session not found"
            });
        }

        if (session.userid.toString() !== req.userid) {
            return res.status(403).json({
                sucess: false,
                message: "Unauthorized"
            });
        }

        if (session.status !== "completed") {
            return res.status(400).json({
                sucess: false,
                message: "Interview not completed"
            });
        }

        return res.status(200).json({
            sucess: true,
            feedback: session.feedback
        });

    } catch (error) {

        return res.status(500).json({
            sucess: false,
            message: error.message
        });

    }
};
export {
    starthrinterview,
    getInterviewSession,
    submitAnswer,
    getFeedback
};