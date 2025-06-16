"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuizPage from "@/app/components/quiz/QuizPage";

export default function QuizPageWrapper() {
  const { quizid } = useParams();
  const [studyMaterial, setStudyMaterial] = useState<string | null>(null);
  const [format, setFormat] = useState<string>("multiple choice");
  const [num, setNum] = useState<number>(5);
  const [selectedTopics, setSelectedTopics] = useState<string[] | null>(null); // ✅ Add this

  useEffect(() => {
    if (!quizid) return;

    const cached = localStorage.getItem(quizid as string);
    if (!cached) return;

    try {
      const parsed = JSON.parse(cached);
      setStudyMaterial(parsed.study_material || "");
      setFormat(parsed.format || "multiple choice");
      setNum(parsed.num || 5);
      setSelectedTopics(parsed.selected_topics || null); // ✅ Grab this
    } catch (err) {
      console.error("Failed to parse quiz data:", err);
    }
  }, [quizid]);

  if (!studyMaterial) return <p className="text-white p-6">Loading...</p>;

  return (
    <QuizPage
      study_material={studyMaterial}
      format={format}
      num={num}
      selected_topics={selectedTopics} // ✅ Now it's defined
    />
  );
}
