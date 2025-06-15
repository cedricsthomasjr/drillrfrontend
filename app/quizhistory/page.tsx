"use client";

import { useEffect, useState } from "react";

type QuizHistoryItem = {
  id: number;
  format: string;
  score: number;
  total: number;
  study_material_excerpt: string;
  timestamp: string;
};

export default function QuizHistoryPage() {
  const [quizzes, setQuizzes] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/quiz-history")
      .then((res) => res.json())
      .then((data) => setQuizzes(data))
      .catch((err) => console.error("Error fetching quiz history:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white px-6 py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">📚 Quiz History</h1>

        {loading ? (
          <p className="text-gray-400 animate-pulse">Loading...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-400">No quizzes saved yet.</p>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-[#1F1F1F] border border-[#2A2A2A] rounded-xl p-6 shadow space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold capitalize">
                      {quiz.format}
                    </h2>
                    <p className="text-sm text-gray-400">
                      Taken on {new Date(quiz.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-indigo-400 font-bold text-xl">
                    {quiz.score}/{quiz.total}
                  </div>
                </div>

                <p className="text-gray-300 text-sm italic">
                  “{quiz.study_material_excerpt.slice(0, 100)}...”
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
