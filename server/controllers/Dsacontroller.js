import DsaInterviewSession from "../models/DsaInterviewSession.js";
import DsaQuestion from "../models/DsaQuestion.js";
import Resume from "../models/resumemodel.js";

export const startDsaInterview = async (req, res) => {
  try {
    const { language, difficulty, experience, duration } = req.body;

    // Basic Validation
    if (!language || !difficulty || !experience || !duration) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create Interview Session
    const session = await DsaInterviewSession.create({
      userid: req.userid,

      language,

      difficulty,

      experience,

      duration,

      status: "ACTIVE",

      stage: "INTRODUCTION",
    });

    return res.status(201).json({
      success: true,
      message: "Interview session created successfully.",
      sessionId: session._id,
    });
  } catch (error) {
    console.error("Start DSA Interview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create interview session.",
    });
  }
};
export const getDsaInterviewSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await DsaInterviewSession.findById(sessionId)
      .populate("currentQuestion");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Interview session not found.",
      });
    }

    if (session.userid.toString() !== req.userid.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access.",
      });
    }

    // First visit
    if (session.conversation.length === 0) {

      // TODO:
      // const aiMessage = await LangGraph.generateIntroduction(session);

      session.conversation.push({
        role: "ai",
        message:
          "Hello! Welcome to your AI DSA Interview. Tell me about yourself.",
      });

      await session.save();
    }

    return res.status(200).json({
      success: true,
      session,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load interview session.",
    });
  }
};

export const getInternalQuestion = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    if (!topic || !difficulty) {
      return res.status(400).json({ success: false, message: "Topic and difficulty are required" });
    }

    const count = await DsaQuestion.countDocuments({ primaryTopic: topic, difficulty });
    if (count === 0) {
      // Fallback: match topic only
      const countTopic = await DsaQuestion.countDocuments({ primaryTopic: topic });
      if (countTopic === 0) {
        // Fallback: get any question
        const randomQ = await DsaQuestion.findOne();
        return res.status(200).json({ success: true, question: randomQ });
      }
      const randomIdx = Math.floor(Math.random() * countTopic);
      const question = await DsaQuestion.findOne({ primaryTopic: topic }).skip(randomIdx);
      return res.status(200).json({ success: true, question });
    }

    const randomIdx = Math.floor(Math.random() * count);
    const question = await DsaQuestion.findOne({ primaryTopic: topic, difficulty }).skip(randomIdx);
    return res.status(200).json({ success: true, question });
  } catch (error) {
    console.error("Error fetching internal question:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const respondDsaInterview = async (req, res) => {
  try {
    const sessionId = req.headers["x-session-id"] || req.query.sessionId || req.body.sessionId;
    const { message, code } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "Session ID is required" });
    }

    const session = await DsaInterviewSession.findById(sessionId).populate("currentQuestion");
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.userid.toString() !== req.userid.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    // Update code if provided
    if (code !== undefined) {
      session.code = code;
    }

    // Append user response
    session.conversation.push({
      role: "user",
      message: message,
      createdAt: new Date()
    });

    // Fetch candidate resume
    const resumedata = await Resume.findOne({ userid: req.userid });
    const resumeText = resumedata ? resumedata.text : "";

    // Format state for AI reasoning service
    const payload = {
      difficulty: session.difficulty,
      experience: session.experience,
      resume: resumeText,
      stage: session.stage,
      topicStatus: session.topicStatus,
      conversation: session.conversation.map(msg => ({
        role: msg.role,
        message: msg.message
      })),
      code: session.code,
      currentQuestion: session.currentQuestion ? {
        id: session.currentQuestion._id.toString(),
        title: session.currentQuestion.title,
        difficulty: session.currentQuestion.difficulty,
        primaryTopic: session.currentQuestion.primaryTopic,
        problemStatement: session.currentQuestion.problemStatement,
        examples: session.currentQuestion.examples.map(ex => `${ex.input} -> ${ex.output}`),
        constraints: session.currentQuestion.constraints
      } : null,
      askedTopics: session.completedTopics,
      candidateProfile: {
        name: "",
        level: session.level || null,
        summary: ""
      }
    };

    // Call Python service
    const pyResponse = await fetch(`${process.env.AI_SERVICE_URL}/dsa/respond`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!pyResponse.ok) {
      const errText = await pyResponse.text();
      throw new Error(`AI service error: ${errText}`);
    }

    const pyData = await pyResponse.json();

    // Update conversation from AI response
    session.conversation = pyData.conversation.map(msg => ({
      role: msg.role,
      message: msg.message,
      createdAt: new Date()
    }));

    // Update stage and status fields
    session.stage = pyData.stage;
    session.topicStatus = pyData.topicStatus;
    if (pyData.candidateProfile && pyData.candidateProfile.level) {
      session.level = pyData.candidateProfile.level;
    }

    // Update coding question details if selected in stage TECHNICAL
    if (pyData.stage === "TECHNICAL" && pyData.currentQuestion) {
      const questionId = pyData.currentQuestion.id;
      if (!session.currentQuestion || session.currentQuestion._id.toString() !== questionId) {
        session.currentQuestion = questionId;
        session.topicStatus = pyData.topicStatus || "DISCUSSION";
      }
    }

    await session.save();

    const updatedSession = await DsaInterviewSession.findById(session._id).populate("currentQuestion");

    return res.status(200).json({
      success: true,
      session: updatedSession
    });
  } catch (error) {
    console.error("Error in respondDsaInterview:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};