import mongoose from "mongoose";

const dsaInterviewSessionSchema = new mongoose.Schema(
  {
    // Candidate
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Interview Configuration
    language: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    // Interview Status
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "ABANDONED"],
      default: "ACTIVE",
    },

    // Current Interview Stage
    stage: {
      type: String,
      enum: ["INTRODUCTION", "TECHNICAL", "FEEDBACK"],
      default: "INTRODUCTION",
    },

    // Candidate Level (Generated once after introduction)
    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: null,
    },

    // Current Topic
    currentTopic: {
      type: String,
      default: "",
    },

    // Current Technical Phase
    topicStatus: {
      type: String,
      enum: ["DISCUSSION", "CODING", "REVIEW"],
      default: "DISCUSSION",
    },

    // Completed Topics
    completedTopics: {
      type: [String],
      default: [],
    },

    // Current Question
    currentQuestion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DsaQuestion",
        default: null,
    },

    // Candidate Solution
    code: {
      type: String,
      default: "",
    },

    // Judge0 Result
    judgeResult: {
      passed: Boolean,

      passedCases: Number,

      totalCases: Number,

      runtime: String,

      memory: String,

      compileOutput: String,

      stderr: String,
    },

    // Entire Interview Conversation
    conversation: [
      {
        role: {
          type: String,
          enum: ["ai", "user"],
        },

        message: {
          type: String,
          required: true,
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Final Feedback
    feedback: {
      overallScore: Number,

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      recommendation: String,

      summary: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DsaInterviewSession",
  dsaInterviewSessionSchema
);