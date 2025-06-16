"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SelectableTopicTags from "../components/quiz/SelectableTopicTags";

export default function GeneratePage() {
  const [studyText, setStudyText] = useState("");
  const [format, setFormat] = useState("multiple choice");
  const [num, setNum] = useState(5);
  const [uploading, setUploading] = useState(false);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!studyText.trim()) return;
    const fetchTopics = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/detect-topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ study_material: studyText }),
        });
        const data = await res.json();
        setTopics(data.topics || []);
      } catch (err) {
        console.error("Failed to extract topics", err);
      }
    };
    fetchTopics();
  }, [studyText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => setStudyText(reader.result as string);
      reader.readAsText(file);
    } else {
      const formData = new FormData();
      formData.append("file", file);
      setUploading(true);

      fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => setStudyText(data.text))
        .catch((err) => console.error("File upload error:", err))
        .finally(() => setUploading(false));
    }
  };

  const handleGenerate = async () => {
    if (!studyText.trim()) return;

    setUploading(true); // use this as a temporary loading indicator

    try {
      const res = await fetch("http://127.0.0.1:5000/detect-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ study_material: studyText }),
      });

      const data = await res.json();
      const detected = data.topics || [];

      if (detected.length > 0) {
        setTopics(detected);
        setShowPopup(true);
      } else {
        proceedToQuiz([]); // fallback if detection fails or gives nothing
      }
    } catch (err) {
      console.error("Failed to detect topics", err);
      proceedToQuiz([]); // fallback to full material
    } finally {
      setUploading(false);
    }
  };

  const proceedToQuiz = (topics: string[]) => {
    const quizid = `quiz-${Date.now()}`;
    localStorage.setItem(
      quizid,
      JSON.stringify({
        study_material: studyText,
        format,
        num,
        selected_topics: topics,
      })
    );
    router.push(`/quiz/${quizid}`);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white px-6 py-16 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Generate Your Quiz
            <span className="text-4xl font-extrabold tracking-tight text-orange-400">
              .
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Upload your notes, choose the quiz format, and start drilling. Drilr
            supports <code>.txt</code>, <code>.pdf</code>, and{" "}
            <code>.docx</code> files. You can also paste raw text below.
          </p>
        </header>

        <div className="bg-[#1F1F1F] border border-[#2A2A2A] p-6 rounded-xl text-sm text-gray-300 space-y-4">
          <h2 className="text-lg font-semibold text-white">📋 Instructions</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Use clean, factual notes for best results.</li>
            <li>Paste or upload your study material.</li>
            <li>Choose your question format and count (1–20).</li>
            <li>
              Click <strong>Generate Quiz</strong> to preview and take it.
            </li>
          </ul>
        </div>

        <div className="bg-[#1F1F1F] border border-[#2A2A2A] p-6 rounded-xl shadow space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Upload File
            </label>
            <input
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Paste Your Study Material
            </label>
            <textarea
              value={studyText}
              onChange={(e) => setStudyText(e.target.value)}
              placeholder="Paste your study guide / textbook / note content here or prompt..."
              className="w-full h-48 p-4 rounded-lg border border-[#2A2A2A] bg-[#2A2A2A] text-white placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="bg-[#1F1F1F] border border-[#2A2A2A] p-6 rounded-xl shadow space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm text-gray-400">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="bg-[#2A2A2A] text-white border border-[#3B3B3B] px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="multiple choice">Multiple Choice</option>
              <option value="fill in the blank">Fill in the Blank</option>
              <option value="free response">Free Response</option>
            </select>

            <label className="text-sm text-gray-400 ml-4"># of Questions</label>
            <input
              type="number"
              value={num}
              min={1}
              max={10}
              onChange={(e) => setNum(Number(e.target.value))}
              className="w-20 bg-[#2A2A2A] text-white border border-[#3B3B3B] px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={uploading || !studyText.trim()}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold text-sm shadow-md transition disabled:opacity-50"
          >
            {uploading ? "Processing Upload..." : "Generate Quiz"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="relative bg-[#1F1F1F] border border-[#2C2C2C] p-6 rounded-xl max-w-md w-full space-y-4 text-center">
            {/* X Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold text-orange-400">
              Pick Topics
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Select at least one topic to focus your quiz.
            </p>

            <SelectableTopicTags
              topics={topics}
              selectedTopics={selectedTopics}
              setSelectedTopics={setSelectedTopics}
            />

            <button
              onClick={() => {
                if (selectedTopics.length > 0) {
                  setShowPopup(false);
                  proceedToQuiz(selectedTopics);
                }
              }}
              disabled={selectedTopics.length === 0}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
                selectedTopics.length > 0
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue to Quiz →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
