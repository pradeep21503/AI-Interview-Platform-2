import mongoose from "mongoose";
import dotenv from "dotenv";
import * as cheerio from "cheerio";

import DsaQuestion from "../models/DsaQuestion.js";

dotenv.config();

await mongoose.connect(process.env.DATABASE_URL);

console.log("✅ MongoDB Connected");

const questions = await DsaQuestion.find();

console.log(`Found ${questions.length} Questions`);

for (const question of questions) {
  const $ = cheerio.load(question.problemStatement);

  // ----------------------------
  // Extract Constraints
  // ----------------------------

  const constraints = [];

  $("strong").each((_, element) => {
    if ($(element).text().trim() === "Constraints:") {
      $(element)
        .parent()
        .next("ul")
        .find("li")
        .each((_, li) => {
          constraints.push($(li).text().trim());
        });
    }
  });

  // ----------------------------
  // Extract Examples
  // ----------------------------

  const examples = [];
  const visibleTestCases = [];

  $("pre").each((_, pre) => {
    const text = $(pre).text();

    const inputMatch = text.match(/Input:\s*([\s\S]*?)Output:/i);

    const outputMatch = text.match(/Output:\s*([\s\S]*?)(Explanation:|$)/i);

    const explanationMatch = text.match(/Explanation:\s*([\s\S]*)/i);

    if (inputMatch && outputMatch) {
      const input = inputMatch[1].trim();

      const output = outputMatch[1].trim();

      const explanation = explanationMatch
        ? explanationMatch[1].trim()
        : "";

      examples.push({
        input,
        output,
        explanation,
      });

      visibleTestCases.push({
        input,
        output,
      });
    }
  });

  question.constraints = constraints;
  question.examples = examples;
  question.visibleTestCases = visibleTestCases;

  await question.save();
}

console.log("🎉 Parsing Completed");

process.exit();