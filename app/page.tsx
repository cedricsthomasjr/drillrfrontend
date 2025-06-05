"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Home() {
  const [activeTab, setActiveTab] = useState("generate");
  const [studyText, setStudyText] = useState("");
  const [format, setFormat] = useState("multiple choice");
  const [num, setNum] = useState(5);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

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

  const handleGenerate = () => {
    if (!studyText.trim()) return;

    const params = new URLSearchParams({
      study_material: studyText,
      format,
      num: num.toString(),
    });

    router.push(`/quiz?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans transition-colors duration-300">
      <nav className="w-full border-b border-[#2A2A2A] py-4 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* your logo + nav items go here */}
        </div>
      </nav>

      {/* 🧠 Hero */}
      <section className="text-center py-24 px-4 border-b border-[#1F1F1F]">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Study Smarter with Drilr<span className="text-[#6366F1]">.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          Turn your class notes into instant quizzes. Upload. Convert. Drill.
        </p>
        <button
          onClick={() => setActiveTab("generate")}
          className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-3 rounded-full text-sm font-medium shadow transition"
        >
          Generate a Quiz
        </button>
      </section>

      {/* ⚡ Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "📝 Upload Notes",
            desc: "Accepts .txt, .pdf, and .docx files for fast content extraction.",
          },
          {
            title: "⚙️ Choose Format",
            desc: "Multiple choice, fill in the blank, or free response—your call.",
          },
          {
            title: "🚀 Instant Quizzes",
            desc: "Get study questions generated in seconds. Fast and accurate.",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1F1F1F] border border-[#2A2A2A] p-6 rounded-xl shadow hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-semibold mb-2 text-white">
              {item.title}
            </h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* 🧪 Generator */}
      <section className="bg-[#1F1F1F] border border-[#2A2A2A] rounded-2xl p-8 max-w-4xl mx-auto shadow-xl mb-32">
        {activeTab === "generate" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Upload File
              </label>
              <input
                type="file"
                accept=".txt,.pdf,.docx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#4F46E5] file:text-white hover:file:bg-[#4338CA] cursor-pointer"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Paste Your Study Material
              </label>
              <textarea
                value={studyText}
                onChange={(e) => setStudyText(e.target.value)}
                placeholder="Paste your study guide or notes here..."
                className="w-full h-48 p-4 rounded-lg border border-[#2A2A2A] bg-[#2A2A2A] text-white placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center mb-8">
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="bg-[#2A2A2A] text-white border border-[#3B3B3B] px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              >
                <option value="multiple choice">Multiple Choice</option>
                <option value="fill in the blank">Fill in the Blank</option>
                <option value="free response">Free Response</option>
              </select>

              <input
                type="number"
                value={num}
                min={1}
                max={20}
                onChange={(e) => setNum(Number(e.target.value))}
                className="w-20 bg-[#2A2A2A] text-white border border-[#3B3B3B] px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
              />

              <button
                onClick={handleGenerate}
                disabled={uploading}
                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-6 py-2 rounded-lg font-medium shadow-md transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Generate Quiz"}
              </button>
            </div>
          </>
        )}

        {activeTab === "my sets" && (
          <div className="text-gray-500 text-sm">
            You haven’t created any sets yet.
          </div>
        )}

        {activeTab === "settings" && (
          <div className="text-gray-500 text-sm">Feature coming soon.</div>
        )}
      </section>
      <Footer />
    </div>
  );
}
