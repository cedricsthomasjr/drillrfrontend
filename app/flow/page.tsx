"use client";

import { useState } from "react";
import FlowReader from "../components/FlowReader";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Topic = {
  topic: string;
  definition: string;
  summary: string;
};

export default function FlowPage() {
  const [input, setInput] = useState("");
  const [chunks, setChunks] = useState<string[] | null>(null);
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    const res = await fetch("http://127.0.0.1:5000/flow/process", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ study_material: input }),
    });

    const data = await res.json();
    setChunks(data.chunks);
    setTopics(data.topics);
    setLoading(false);
  };

  if (chunks && topics) {
    return <FlowReader chunks={chunks} topics={topics} />;
  }

  return (
    <main className="relative min-h-screen bg-[#1A1A1A] text-white px-6 py-12">
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-95 space-y-4">
          <div className="w-12 h-12 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Analyzing your notes…</p>
        </div>
      )}

      <div className="max-w-3xl pt-10 mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-white">
          Drilr<span className="text-[#6366F1]">.</span> Flow
        </h1>
        <p className="text-gray-400 text-sm">
          Paste your notes or slides below. Drilr will detect key topics and
          turn them into interactive study cards.
        </p>
        <Textarea
          className="min-h-[200px] bg-[#1A1A1A] border border-[#2A2A2C] text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button onClick={handleStart} className="w-full">
          Start Flow →
        </Button>
      </div>
    </main>
  );
}
