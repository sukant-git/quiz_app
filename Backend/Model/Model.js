import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correct: { type: Number, required: true } // store index 0-3
}, { timestamps: true });

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
