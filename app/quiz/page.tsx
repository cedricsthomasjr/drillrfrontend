"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type QuizQuestion = {
  number: number;
  topic: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

export default function QuizPage() {
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

  const searchParams = useSearchParams();
  const study_material = searchParams.get("study_material");
  const format = searchParams.get("format") || "multiple choice";
  const num = Number(searchParams.get("num")) || 5;

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
          body: JSON.stringify({ study_material, format, num }),
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
  }, [study_material, format, num]);

  useEffect(() => {
    if (submitted) {
      let current = 0;
      const interval = setInterval(() => {
        if (current < score) {
          current++;
          setAnimatedScore(current);
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [submitted, score]);

  const handleSelect = (qIndex: number, option: string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    if (!quiz || !Array.isArray(quiz)) return;
    let correct = 0;
    quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const renderResultMessage = () => {
    if (!quiz || quiz.length === 0) return null;
    const percent = (score / quiz.length) * 100;
    if (percent === 100) {
      return (
        <>
          🌟 Perfect!
          <br />
          <span className="text-sm text-gray-500">
            You aced every question — final boss energy.
          </span>
        </>
      );
    } else if (percent >= 90) {
      return (
        <>
          🔥 Excellent work!
          <br />
          <span className="text-sm text-gray-500">
            Nearly flawless. Just clean up the edges.
          </span>
        </>
      );
    } else if (percent >= 75) {
      return (
        <>
          ✅ Strong showing!
          <br />
          <span className="text-sm text-gray-500">
            You're on solid ground. Review and sharpen.
          </span>
        </>
      );
    } else if (percent >= 60) {
      return (
        <>
          🧩 Making progress.
          <br />
          <span className="text-sm text-gray-500">
            You've got the fundamentals — now refine.
          </span>
        </>
      );
    } else if (percent >= 40) {
      return (
        <>
          🛠 Room for growth.
          <br />
          <span className="text-sm text-gray-500">
            You're picking up the pieces. Stay consistent.
          </span>
        </>
      );
    } else if (percent >= 25) {
      return (
        <>
          📉 Bit of a slide.
          <br />
          <span className="text-sm text-gray-500">
            That's alright. Regroup, retake, repeat.
          </span>
        </>
      );
    } else {
      return (
        <>
          💡 Starting point secured.
          <br />
          <span className="text-sm text-gray-500">
            You showed up. That’s the first step. Let’s level up.
          </span>
        </>
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white px-6 pt-28 pb-12 font-sans">
      <Navbar />
      <section className="max-w-4xl mx-auto mt-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Quiz<span className="text-indigo-400">.</span>
          </h1>
          {summary ? (
            <p className="text-sm text-gray-400 italic"></p>
          ) : study_material ? (
            <p className="text-sm text-gray-400 italic">
              Based on:{" "}
              <span className="text-gray-300">
                {decodeURIComponent(study_material).slice(0, 100)}...
              </span>
            </p>
          ) : null}
        </div>

        {/* Topic Tags */}
        {topics.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {topics.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm font-medium bg-[#2A2A2A] text-gray-300 border border-[#3A3A3C] hover:bg-[#6366F1] hover:text-white transition"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Loading/Error */}
        {loading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-95 space-y-4">
            <div className="w-12 h-12 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Generating your quiz…</p>
          </div>
        )}

        {!loading && Array.isArray(quiz) && (
          <>
            {/* Quiz Questions */}
            <div className="space-y-8">
              {quiz.map((q, idx) => {
                const selected = selectedAnswers[idx];
                const isCorrect = selected === q.answer;
                return (
                  <Card
                    key={idx}
                    className="bg-[#1C1C1E] border border-[#2A2A2C] text-white"
                  >
                    <CardHeader>
                      <CardTitle className="text-xs uppercase text-gray-400 tracking-wider">
                        Q{q.number || idx + 1} • {q.topic}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-semibold mb-4 leading-snug">
                        {q.question}
                      </p>

                      {q.options && (
                        <ul className="space-y-2">
                          {q.options.map((opt, i) => {
                            const isSelected = selected === opt;
                            const isOptionCorrect =
                              submitted && opt === q.answer;
                            const isOptionIncorrect =
                              submitted && isSelected && opt !== q.answer;

                            return (
                              <li
                                key={i}
                                onClick={() => handleSelect(idx, opt)}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-200
                                  ${
                                    isOptionCorrect
                                      ? "bg-green-900 border-green-400 text-green-200"
                                      : isOptionIncorrect
                                      ? "bg-red-900 border-red-400 text-red-200"
                                      : isSelected
                                      ? "bg-[#2A2A2A] border-[#6366F1] text-white"
                                      : "bg-[#1F1F1F] border-[#2C2C2C] text-gray-300"
                                  }
                                  ${
                                    !submitted &&
                                    "hover:bg-[#2A2E3B] hover:border-[#6366F1] hover:scale-[1.02] active:scale-[0.98]"
                                  }`}
                              >
                                {opt}
                                {submitted && isOptionCorrect && (
                                  <CheckCircle
                                    size={18}
                                    className="text-green-300"
                                  />
                                )}
                                {submitted && isOptionIncorrect && (
                                  <XCircle size={18} className="text-red-300" />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {submitted && showReview && (
                        <div className="mt-4 text-sm text-gray-400 space-y-1">
                          <p>
                            Correct Answer:{" "}
                            <span className="font-semibold text-[#8B5CF6]">
                              {q.answer}
                            </span>
                          </p>
                          {q.explanation && (
                            <p className="italic text-gray-500">
                              <span className="text-gray-400 font-medium">
                                Why:
                              </span>{" "}
                              {q.explanation}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Results */}
            <div className="mt-16 max-w-xl mx-auto">
              {!submitted ? (
                <div className="text-center">
                  <Button
                    onClick={handleSubmit}
                    className="px-8 py-3 text-md font-semibold text-white bg-[#1F1F1F] border border-[#2C2C2C] hover:bg-[#2A2A2E] hover:border-[#6366F1] transition-all duration-200"
                  >
                    Submit Quiz
                  </Button>
                </div>
              ) : (
                <Card className="bg-[#1C1C1E] border border-[#2A2A2C] text-white">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#10B981]">
                      Quiz Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-6 text-sm">
                      <div className="bg-[#111112] p-4 rounded-lg border border-[#27272A]">
                        <p className="text-gray-400 mb-1">Total Questions</p>
                        <p className="text-xl font-bold text-white">
                          {quiz.length}
                        </p>
                      </div>
                      <div className="bg-[#111112] p-4 rounded-lg border border-[#27272A]">
                        <p className="text-gray-400 mb-1">Correct Answers</p>
                        <p className="text-xl font-bold text-green-400">
                          {animatedScore}
                        </p>
                      </div>
                      <div className="bg-[#111112] p-4 rounded-lg border border-[#27272A]">
                        <p className="text-gray-400 mb-1">Incorrect Answers</p>
                        <p className="text-xl font-bold text-red-400">
                          {quiz.length - animatedScore}
                        </p>
                      </div>
                      <div className="bg-[#111112] p-4 rounded-lg border border-[#27272A]">
                        <p className="text-gray-400 mb-1">Score Percentage</p>
                        <p className="text-xl font-bold text-white">
                          {((animatedScore / quiz.length) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <Progress
                      value={(animatedScore / quiz.length) * 100}
                      className="h-3 [&>div]:bg-indigo-400"
                    />

                    <div className="mt-6 text-center text-lg font-medium text-gray-300">
                      {renderResultMessage()}
                    </div>

                    <div className="mt-6 text-center space-y-2">
                      <Button
                        variant="ghost"
                        onClick={() => setShowReview((prev) => !prev)}
                      >
                        {showReview
                          ? "Hide Answer Review"
                          : "Show Answer Review"}
                      </Button>
                      <Link href="/">
                        <Button
                          variant="outline"
                          className="w-full text-black dark:text-white"
                        >
                          Try Another Quiz →
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        {!loading && Array.isArray(quiz) && quiz.length === 0 && (
          <p className="text-center text-gray-500">
            No questions were generated.
          </p>
        )}
      </section>
    </main>
  );
}
