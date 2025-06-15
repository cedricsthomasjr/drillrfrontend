"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type QuizQuestion = {
  question: string;
  options?: string[];
  answer: string;
};

export default function DrillModal({
  content,
  onClose,
}: {
  content: string;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://127.0.0.1:5000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            study_material: content,
            format: "multiple choice",
            num: 1,
          }),
        });
        const data = await res.json();
        setQuestion(data[0]); // assuming backend returns array
      } catch (err) {
        console.error("Error generating quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [content]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C1E] text-white border border-[#2A2A2C]">
        <DialogHeader>
          <DialogTitle className="text-xl">🧠 Drill Mode</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : question ? (
          <div className="space-y-4">
            <p className="font-medium text-gray-300">{question.question}</p>
            <div className="space-y-2">
              {question.options?.map((opt, i) => (
                <Button
                  key={i}
                  variant={selected === opt ? "default" : "outline"}
                  className={`w-full justify-start ${
                    selected && opt === question.answer
                      ? "border-green-500 text-green-400"
                      : selected && opt === selected
                      ? "border-red-500 text-red-400"
                      : ""
                  }`}
                  onClick={() => setSelected(opt)}
                  disabled={!!selected}
                >
                  {opt}
                </Button>
              ))}
            </div>

            {selected && (
              <p className="text-sm text-gray-400">
                {selected === question.answer
                  ? "✔ Correct!"
                  : `✖ Correct answer: ${question.answer}`}
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-red-400">Failed to load question.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
