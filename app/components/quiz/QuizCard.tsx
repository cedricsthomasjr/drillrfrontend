"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuizQuestion = {
  number: number;
  topic: string;
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
};

type QuizCardProps = {
  question: QuizQuestion;
  index: number;
  selected: string | undefined;
  submitted: boolean;
  showReview: boolean;
  handleSelect: (index: number, option: string) => void;
  format: string;
  feedback?: { score: number; feedback: string; confidence?: number };
};

export default function QuizCard({
  question,
  index,
  selected,
  submitted,
  showReview,
  handleSelect,
  format,
  feedback,
}: QuizCardProps) {
  const isSelected = (opt: string) => selected === opt;

  return (
    <Card className="bg-[#1C1C1E] border border-[#2A2A2C] text-white">
      <CardHeader>
        <CardTitle className="text-xs uppercase text-orange-400 tracking-wider">
          Question {question.number || index + 1}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-lg font-semibold mb-4 leading-snug">
          {question.question}
        </p>

        {format === "free response" ? (
          <div className="mt-2">
            <textarea
              disabled={submitted}
              value={selected || ""}
              onChange={(e) => handleSelect(index, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full mt-2 bg-[#1F1F1F] border border-[#2C2C2C] text-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              rows={4}
            />
            {submitted && showReview && (
              <div className="mt-4 text-sm text-gray-400 space-y-1">
                <p>
                  Correct Answer:{" "}
                  <span className="font-semibold text-orange-400">
                    {question.answer}
                  </span>
                </p>
                {question.explanation && (
                  <p className="italic text-gray-500">
                    <span className="text-gray-400 font-medium">Why:</span>{" "}
                    {question.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          question.options && (
            <ul className="space-y-2">
              {question.options.map((opt, i) => {
                const correct = submitted && opt === question.answer;
                const incorrect =
                  submitted && isSelected(opt) && opt !== question.answer;

                return (
                  <li
                    key={i}
                    onClick={() => handleSelect(index, opt)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium cursor-pointer transition-all duration-200
    ${
      correct
        ? "bg-[#122819] border-green-500 text-green-300"
        : incorrect
        ? "bg-[#2A1A1A] border-red-500 text-red-300"
        : isSelected(opt)
        ? "bg-[#2A2A2A] border-orange-400 text-white"
        : "bg-[#1F1F1F] border-[#2C2C2C] text-gray-300"
    }
    ${
      !submitted &&
      " hover:border-orange-400 hover:scale-[1.02] active:scale-[0.98]"
    }`}
                  >
                    {opt}
                    {submitted && correct && (
                      <CheckCircle size={18} className="text-green-400" />
                    )}
                    {submitted && incorrect && (
                      <XCircle size={18} className="text-red-400" />
                    )}
                  </li>
                );
              })}
            </ul>
          )
        )}

        {/* Review section */}
        {submitted && showReview && (
          <div className="mt-4 text-sm text-gray-400 space-y-1">
            <p>
              Correct Answer:{" "}
              <span className="font-semibold text-green-400">
                {question.answer}
              </span>
            </p>
            {question.explanation && (
              <p className="italic text-gray-500">
                <span className="text-gray-400 font-medium">Why:</span>{" "}
                {question.explanation}
              </p>
            )}
          </div>
        )}

        {/* Free response feedback */}
        {format === "free response" && submitted && feedback && (
          <div className="mt-4 text-sm text-orange-300 space-y-2">
            <p
              className={`font-medium ${
                feedback.score === 1
                  ? "text-green-400"
                  : feedback.score >= 0.5
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {feedback.score === 1
                ? "✅ Marked Correct"
                : feedback.score > 0
                ? "⚠️ Partially Correct"
                : "❌ Marked Incorrect"}
            </p>
            <p className="text-orange-200 italic">{feedback.feedback}</p>
            <p className="text-xs text-gray-500 mt-1">
              Points Awarded: {(feedback.score * 1).toFixed(1)} / 1.0
              {feedback.confidence !== undefined &&
                ` • AI Confidence: ${feedback.confidence}%`}
            </p>

            {/* Manual override button */}
            {feedback.score < 1 && (
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const event = new CustomEvent("overrideCorrect", {
                      detail: { index },
                    });
                    window.dispatchEvent(event);
                  }
                }}
                className="text-xs px-3 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition mt-2"
              >
                This Answers the Question
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
