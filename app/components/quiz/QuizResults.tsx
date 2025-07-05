"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type QuizResultsProps = {
  quizLength: number;
  score: number; // can be partial like 3.5
  animatedScore: number; // also partial
  showReview: boolean;
  setShowReview: (value: boolean) => void;
};

export default function QuizResults({
  quizLength,
  score,
  animatedScore,
  showReview,
  setShowReview,
}: QuizResultsProps) {
  const percent = (animatedScore / quizLength) * 100;

  const renderMessage = () => {
    if (percent === 100) {
      return (
        <>
          🌟 Perfect!
          <br />
          <span className="text-sm text-gray-500">
            You aced every question — boss moves.
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
    <Card className="bg-[#1C1C1E] border border-[#2A2A2C] text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-[#10B981]">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="bg-[#111112] p-4 rounded-lg border border-[#27272A]">
            <p className="text-gray-400 mb-1">Total Questions</p>
            <p className="text-xl font-bold text-white">{quizLength}</p>
          </div>

          <div className="bg-[#111112] p-4 rounded-lg border border-[#27272A]">
            <p className="text-gray-400 mb-1">Total Points</p>
            <p className="text-xl font-bold text-green-400">
              {animatedScore.toFixed(1)} / {quizLength}
            </p>
          </div>

          <div className="bg-[#111112] p-4 rounded-lg border border-[#27272A]">
            <p className="text-gray-400 mb-1">Points Lost</p>
            <p className="text-xl font-bold text-red-400">
              {(quizLength - animatedScore).toFixed(1)}
            </p>
          </div>

          <div className="bg-[#111112] p-4 rounded-lg border border-[#27272A]">
            <p className="text-gray-400 mb-1">Score Percentage</p>
            <p className="text-xl font-bold text-white">
              {((animatedScore / quizLength) * 100).toFixed(1)}%
            </p>
          </div>
        </div>

        <Progress value={percent} className="h-3 [&>div]:bg-orange-400" />

        <div className="mt-6 text-center text-lg font-medium text-gray-300">
          {renderMessage()}
        </div>

        <div className="mt-6 text-center space-y-2">
          <Button variant="ghost" onClick={() => setShowReview(!showReview)}>
            {showReview ? "Hide Answer Review" : "Show Answer Review"}
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
  );
}
