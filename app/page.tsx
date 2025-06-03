'use client';

import { useState } from 'react';

export default function Home() {
  const [studyText, setStudyText] = useState('');
  const [format, setFormat] = useState('multiple choice');
  const [num, setNum] = useState(5);
  const [quiz, setQuiz] = useState<string | object | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setQuiz(null);

    const res = await fetch('http://127.0.0.1:5000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        study_material: studyText,
        format,
        num,
      }),
    });

    const data = await res.json();
    setQuiz(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-5xl font-bold text-blue-500 mb-8">Drilr 🔥</h1>
      <input
  type="file"
  accept=".txt,.pdf,.docx"
  className="block mb-4"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    // For text files
    if (file.type === "text/plain") {
      reader.onload = () => setStudyText(reader.result as string);
      reader.readAsText(file);
    } else {
      // For other types (PDF, DOCX), we upload to backend
      const formData = new FormData();
      formData.append("file", file);

      fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
    })

        .then((res) => res.json())
        .then((data) => setStudyText(data.text))
        .catch((err) => console.error("File upload error:", err));
    }
  }}
/>

      <textarea
        value={studyText}
        onChange={(e) => setStudyText(e.target.value)}
        placeholder="Paste your study guide or notes here..."
        className="w-full h-48 p-4 bg-gray-900 text-white rounded-lg mb-6 border border-gray-700"
      />

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="bg-gray-900 border border-gray-700 px-4 py-2 rounded"
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
          className="w-20 bg-gray-900 border border-gray-700 px-4 py-2 rounded"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-medium"
        >
          {loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>

      {quiz && (
        <pre className="bg-gray-900 p-6 rounded-lg border border-gray-700 text-sm whitespace-pre-wrap">
          {typeof quiz === 'object' ? JSON.stringify(quiz, null, 2) : quiz}
        </pre>
      )}
    </main>
  );
}
