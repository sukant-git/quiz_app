import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import axios from "axios";

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/questions")
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, []);

  const handleAnswer = (optionIndex) => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = optionIndex;
      return copy;
    });

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      toast.success("🎉 Test Submitted!");
      setSubmitted(true);
    }
  };

  if (loading) return <h2>Loading Questions...</h2>;
  if (!questions.length) return <h2>No questions found!</h2>;

  const score = answers.filter((ans, i) => ans === questions[i].correct).length;

  return (
    <div className="quiz-container">
      <ToastContainer position="top-center" autoClose={2000} />

      {!submitted ? (
        <div className="quiz-box">
          <h2>Question {index + 1}/{questions.length}</h2>
          <p>{questions[index].question}</p>
          <div className="options">
            {questions[index].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`option-btn ${answers[index] === i ? "selected" : ""}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="result-box">
          <h2>🎯 Your Score: {score}/{questions.length}</h2>
          {questions.map((q, i) => (
            <div key={i} className="result-question">
              <p><strong>Q{i + 1}.</strong> {q.question}</p>
              {q.options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`option-result
                    ${idx === q.correct ? "correct" : ""}
                    ${answers[i] === idx && idx !== q.correct ? "wrong" : ""}`}
                >
                  {opt}
                  {idx === q.correct && <span> ✅</span>}
                  {answers[i] === idx && idx !== q.correct && <span> ❌</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
