"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white font-sans transition-colors duration-300">
      {/* 🧭 Navbar */}
      <nav className="w-full border-b border-[#2A2A2A] py-4 bg-[#1A1A1A]">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          {/* Replace this with logo + links if needed */}
          <h2 className="text-xl font-semibold text-white">
            Drilr<span className="text-[#6366F1]">.</span>
          </h2>
        </div>
      </nav>

      {/* 🧠 Hero */}
      <section className="text-center py-24 px-4 border-b border-[#1F1F1F]">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Study Smarter with Drilr<span className="text-[#F59E0B]">.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          Turn your class notes into instant quizzes. Upload. Convert. Drill.
        </p>
        <section className="flex flex-col gap-4 md:flex-row md:justify-center md:gap-6">
          <button
            onClick={() => router.push("/generate")}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-8 py-3 rounded-full text-sm font-medium shadow transition"
          >
            Generate a Quiz
          </button>
        </section>
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

      {/* 🚫 Removed Generator Section – now on /generate */}

      {/* 🦶 Footer */}
      <Footer />
    </div>
  );
}
