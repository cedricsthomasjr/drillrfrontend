"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DrillModal from "./DrillModal";
import HighlightedTerm from "./HighlightedTerm";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FlowReader({
  chunks,
  topics,
}: {
  chunks: string[];
  topics: { topic: string; definition: string; summary: string }[];
}) {
  const [modalData, setModalData] = useState<string | null>(null);

  const renderChunk = (text: string) => {
    // Create a regex to match any topic
    const topicMap = Object.fromEntries(
      topics.map(({ topic, definition }) => [topic.toLowerCase(), definition])
    );

    const regex = new RegExp(
      `\\b(${topics.map((t) => t.topic).join("|")})\\b`,
      "gi"
    );

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    text.replace(regex, (match, _g, offset) => {
      // Push text before the match
      if (offset > lastIndex) {
        elements.push(
          <span key={lastIndex}>{text.slice(lastIndex, offset)}</span>
        );
      }

      const definition = topicMap[match.toLowerCase()];
      elements.push(
        <HighlightedTerm key={offset} term={match} definition={definition} />
      );

      lastIndex = offset + match.length;
      return match;
    });

    // Push remaining text
    if (lastIndex < text.length) {
      elements.push(<span key={lastIndex}>{text.slice(lastIndex)}</span>);
    }

    return elements;
  };

  return (
    <ScrollArea className="space-y-10 max-h-[calc(100vh-5rem)] px-1 pr-3">
      {/* Key Concepts Panel */}
      <Card className="bg-[#1A1A1D] border border-[#2F2F33] p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl pt-20 font-bold text-indigo-400 mb-2">
          Key Concepts
        </h2>
        <Separator className="bg-[#333]" />
        <div className="mt-4 space-y-4">
          {topics.map((t, i) => (
            <div key={i} className="bg-[#262626] rounded-xl p-4">
              <p className="text-indigo-400 font-semibold text-lg">{t.topic}</p>
              <p className="text-gray-400 text-sm mt-1 leading-snug">
                {t.summary}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Text Chunks with Highlighted Terms */}
      {chunks.map((chunk, i) => (
        <Card
          key={i}
          className="bg-[#1C1C1E] border border-[#2A2A2C] rounded-2xl p-6 shadow transition duration-200 hover:border-indigo-400 group relative"
        >
          <p className="text-gray-200 leading-relaxed text-[15px]">
            {renderChunk(chunk)}
          </p>
        </Card>
      ))}

      {/* Modal */}
      {modalData && (
        <DrillModal content={modalData} onClose={() => setModalData(null)} />
      )}
    </ScrollArea>
  );
}
