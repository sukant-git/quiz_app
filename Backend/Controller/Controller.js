import fs from "fs";
import pdfParse from "pdf-parse";
import Question from "../Model/Model.js";

// ✅ Get all questions
export const getQs = async (req, res) => {
  try {
    const qs = await Question.find();
    res.json(qs);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Add single question manually
export const addQs = async (req, res) => {
  const { question, options, correct } = req.body;
  if (!question || !options || options.length !== 4 || correct === undefined) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const newQ = new Question({ question, options, correct: Number(correct) });
    await newQ.save();
    res.json({ message: "✅ Question added" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Upload & Parse PDF
export const uploadPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const lines = pdfData.text.split("\n").map(l => l.trim()).filter(l => l);

    const questions = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^Q\d+\./i)) {
        const question = lines[i].replace(/^Q\d+\.\s*/, "");
        const options = [lines[i+1], lines[i+2], lines[i+3], lines[i+4]].map(o => o.replace(/^[A-D]\)\s*/, ""));
        const answerLine = lines[i+5].match(/Correct Answer:\s*([A-D])/i);
        const correctIndex = answerLine ? answerLine[1].toUpperCase().charCodeAt(0) - 65 : -1;

        if (options.length === 4 && correctIndex >= 0) {
          questions.push({ question, options, correct: correctIndex });
        }
      }
    }

    if (questions.length > 0) await Question.insertMany(questions);
    fs.unlinkSync(filePath);

    res.json({ message: "✅ PDF processed successfully", count: questions.length });
  } catch (err) {
    res.status(500).json({ message: "Error processing PDF", error: err.message });
  }
};
