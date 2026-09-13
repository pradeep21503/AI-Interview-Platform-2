import mongoose from "mongoose";

const dsaQuestionSchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    // Main Interview Topic
    primaryTopic: {
      type: String,
      required: true,
    },

    // All Related Topics
    tags: {
      type: [String],
      default: [],
    },

    // AI Generated Later
    companies: {
      type: [String],
      default: [],
    },

    // HTML Problem Statement
    problemStatement: {
      type: String,
      required: true,
    },

    constraints: {
      type: [String],
      default: [],
    },

    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],

    // Accepted Solutions (comes directly from dataset)
    solutionCode: {
      cpp: String,
      java: String,
      python: String,
    },

    // Generated Later
    visibleTestCases: [
      {
        input: String,
        output: String,
      },
    ],

    hiddenTestCases: [
      {
        input: String,
        output: String,
      },
    ],

    hints: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DsaQuestion", dsaQuestionSchema);