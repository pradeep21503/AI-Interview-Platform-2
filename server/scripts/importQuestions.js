import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";

import DsaQuestion from "../models/DsaQuestion.js";

dotenv.config();
console.log("Script Started");

async function importQuestions() {
  try {
    // Connect MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ MongoDB Connected");

    // Read dataset
    const filePath = path.join(process.cwd(), "datasets", "leetcode.json");

    const rawData = fs.readFileSync(filePath, "utf8");
    const questions = JSON.parse(rawData);

    console.log(`📚 Total Questions in Dataset: ${questions.length}`);

    // Keep only free Algorithm questions
    const filteredQuestions = questions.filter(
      (q) =>
        q.category === "Algorithms" &&
        q.paidOnly === false &&
        q.title &&
        q.description
    );

    console.log(
      `✅ Free Algorithm Questions Found: ${filteredQuestions.length}`
    );

    // Balanced difficulty distribution
    const easy = filteredQuestions
      .filter((q) => q.difficulty === "Easy")
      .slice(0, 100);

    const medium = filteredQuestions
      .filter((q) => q.difficulty === "Medium")
      .slice(0, 150);

    const hard = filteredQuestions
      .filter((q) => q.difficulty === "Hard")
      .slice(0, 50);

    const selectedQuestions = [...easy, ...medium, ...hard];

    console.log(`🚀 Importing ${selectedQuestions.length} Questions...`);

    const formattedQuestions = selectedQuestions.map((q) => ({
      title: q.title,

      difficulty: q.difficulty,

      primaryTopic:
        q.topics && q.topics.length > 0
          ? q.topics[0]
          : "General",

      tags: q.topics || [],

      companies: [],

      problemStatement: q.description,

      constraints: [],

      examples: [],

      solutionCode: {
        cpp: q.solution_code_cpp || "",
        java: q.solution_code_java || "",
        python: q.solution_code_python || "",
      },

      visibleTestCases: [],

      hiddenTestCases: [],

      hints: q.hints || [],
    }));

    // Remove previous data
    await DsaQuestion.deleteMany({});

    // Insert new questions
    await DsaQuestion.insertMany(formattedQuestions);

    console.log(
      `🎉 Successfully Imported ${formattedQuestions.length} Questions`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Import Failed");
    console.error(error);
    process.exit(1);
  }
}

importQuestions();