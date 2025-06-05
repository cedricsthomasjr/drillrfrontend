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

        const quizArray = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.questions)
          ? parsed.questions
          : [];

        setQuiz(quizArray);
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
          <span>🌟 Perfect!</span>
          <br />
          <span className="text-sm text-gray-500">
            You aced every question — final boss energy.
          </span>
        </>
      );
    } else if (percent >= 90) {
      return (
        <>
          <span>🔥 Excellent work!</span>
          <br />
          <span className="text-sm text-gray-500">
            Nearly flawless. Just clean up the edges.
          </span>
        </>
      );
    } else if (percent >= 75) {
      return (
        <>
          <span>✅ Strong showing!</span>
          <br />
          <span className="text-sm text-gray-500">
            You're on solid ground. Review and sharpen.
          </span>
        </>
      );
    } else if (percent >= 60) {
      return (
        <>
          <span>🧩 Making progress.</span>
          <br />
          <span className="text-sm text-gray-500">
            You've got the fundamentals — now refine.
          </span>
        </>
      );
    } else if (percent >= 40) {
      return (
        <>
          <span>🛠 Room for growth.</span>
          <br />
          <span className="text-sm text-gray-500">
            You're picking up the pieces. Stay consistent.
          </span>
        </>
      );
    } else if (percent >= 25) {
      return (
        <>
          <span>📉 Bit of a slide.</span>
          <br />
          <span className="text-sm text-gray-500">
            That's alright. Regroup, retake, repeat.
          </span>
        </>
      );
    } else {
      return (
        <>
          <span>💡 Starting point secured.</span>
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
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Your Quiz</h1>
          {study_material && (
            <p className="text-sm text-gray-400 italic">
              Based on:{" "}
              <span className="text-gray-300">
                {decodeURIComponent(study_material).slice(0, 100)}...
              </span>
            </p>
          )}
        </div>

        {/* Loading/Error State */}
        {loading && (
          <p className="text-center text-gray-400 animate-pulse">
            Generating your quiz…
          </p>
        )}
        {error && (
          <p className="text-center text-red-400 font-semibold">{error}</p>
        )}

        {/* Quiz UI */}
        {!loading && Array.isArray(quiz) && (
          <>
            <div className="space-y-8">
              {quiz.map((q, idx) => {
                const selected = selectedAnswers[idx];
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
                            const isCorrect = submitted && opt === q.answer;
                            const isIncorrect =
                              submitted && isSelected && opt !== q.answer;

                            return (
                              <li
                                key={i}
                                onClick={() => handleSelect(idx, opt)}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-200
                                  ${
                                    isCorrect
                                      ? "bg-green-900 border-green-400 text-green-200"
                                      : isIncorrect
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
                                {submitted && isCorrect && (
                                  <CheckCircle
                                    size={18}
                                    className="text-green-300"
                                  />
                                )}
                                {submitted && isIncorrect && (
                                  <XCircle size={18} className="text-red-300" />
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {submitted && showReview && (
                        <p className="text-sm mt-4 text-gray-400">
                          Correct Answer:{" "}
                          <span className="font-semibold text-[#8B5CF6]">
                            {q.answer}
                          </span>
                        </p>
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
                      className="h-3"
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
