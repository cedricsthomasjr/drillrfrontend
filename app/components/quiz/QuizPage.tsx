"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import QuizCard from "./QuizCard";
import QuizHeader from "./QuizHeader";
import TopicTags from "./TopicTags";
import LoadingOverlay from "./LoadingOverlay";
import QuizResults from "./QuizResults";
import { Button } from "@/components/ui/button";

export type QuizQuestion = {
  number: number;
  topic: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

type QuizPageProps = {
  study_material: string;
  format: string;
  num: number;
  selected_topics?: string[] | null; // <-- Add this line
};

export default function QuizPage({
  study_material,
  format,
  num,
  selected_topics = null, // <- Add this default
}: QuizPageProps) {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [grading, setGrading] = useState(false);
  const [gradedFeedback, setGradedFeedback] = useState<
    Record<number, { score: number; feedback: string; confidence?: number }>
  >({});

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!study_material) {
        setError("Missing study material");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:5000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            study_material,
            format,
            num,
            selected_topics: selected_topics ?? [],
          }),
        });

        const text = await res.text();
        let parsed = JSON.parse(text);
        if (typeof parsed === "string") parsed = JSON.parse(parsed);

        const quizArray = Array.isArray(parsed.questions)
          ? parsed.questions
          : [];
        setQuiz(quizArray);

        const rawSummary = parsed.summary || "";
        setSummary(rawSummary);
        setTopics(
          rawSummary
            .split(",")
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0)
        );
      } catch (err) {
        setError("Failed to generate quiz. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [study_material, format, num, selected_topics]);

  useEffect(() => {
    if (submitted) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < score) {
          current += 0.1;
          if (current > score) current = score;
          setAnimatedScore(parseFloat(current.toFixed(1)));
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [submitted, score]);

  const handleSelect = (index: number, option: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [index]: option }));
  };

  const handleSubmit = async () => {
    if (!quiz || !Array.isArray(quiz)) return;

    setGrading(true);
    let totalScore = 0;
    const feedbackMap: typeof gradedFeedback = {};

    for (let i = 0; i < quiz.length; i++) {
      const q = quiz[i];
      const userAnswer = selectedAnswers[i];
      if (!userAnswer) continue;

      if (!q.options || format === "free response") {
        try {
          const res = await fetch("http://127.0.0.1:5000/grade-free-response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              question: q.question,
              user_answer: userAnswer,
              correct_answer: q.answer,
            }),
          });

          const result = await res.json();
          const score = parseFloat(result.score) || 0;

          totalScore += score;
          feedbackMap[i] = {
            score,
            feedback: result.feedback,
            confidence: result.confidence,
          };
        } catch (err) {
          console.error(`Error grading question ${i + 1}`, err);
          feedbackMap[i] = {
            score: 0,
            feedback: "Grading failed.",
          };
        }
      } else {
        const isCorrect =
          userAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase();
        if (isCorrect) totalScore += 1;
      }
    }

    setGradedFeedback(feedbackMap);
    setScore(totalScore);
    setSubmitted(true);
    setGrading(false);
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-6 pt-28 pb-12 font-sans">
      {grading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-95 space-y-4">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-orange-300 text-sm">
            Drillr is grading your quiz…
          </p>
        </div>
      )}

      <Navbar />
      <section className="max-w-4xl mx-auto mt-6">
        <QuizHeader study_material={study_material} summary={summary} />

        {(selected_topics ?? topics).length > 0 && (
          <div className="flex justify-center  mb-8">
            <TopicTags topics={selected_topics ?? topics} />
          </div>
        )}

        {loading && <LoadingOverlay />}

        {!loading && quiz && (
          <>
            <div className="space-y-8">
              {quiz.map((q, idx) => (
                <QuizCard
                  key={idx}
                  question={q}
                  index={idx}
                  selected={selectedAnswers[idx]}
                  submitted={submitted}
                  showReview={showReview}
                  handleSelect={handleSelect}
                  format={format}
                  feedback={gradedFeedback[idx]}
                />
              ))}
            </div>

            <div className="mt-16 max-w-xl mx-auto">
              {!submitted ? (
                <div className="text-center">
                  <Button
                    onClick={handleSubmit}
                    className="px-8 py-3 text-md font-semibold text-white bg-[#1F1F1F] border border-[#2C2C2C] hover:bg-[#2A2A2E] hover:border-orange-400 transition-all duration-200"
                  >
                    Submit Quiz
                  </Button>
                </div>
              ) : (
                <QuizResults
                  quizLength={quiz.length}
                  score={score}
                  animatedScore={animatedScore}
                  showReview={showReview}
                  setShowReview={setShowReview}
                />
              )}
            </div>
          </>
        )}

        {!loading && quiz && quiz.length === 0 && (
          <p className="text-center text-orange-400">
            No questions were generated.
          </p>
        )}
      </section>
    </main>
  );
}
