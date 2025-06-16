// components/quiz/TopicSelector.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TopicSelector({
  topics,
  onConfirm,
}: {
  topics: string[];
  onConfirm: (selected: string[]) => void;
}) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggle = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <Dialog open>
      <DialogContent className="bg-[#1C1C1E] border border-[#2A2A2C] text-white">
        <DialogHeader>
          <DialogTitle className="text-lg text-orange-400">
            Select Topics
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2 my-4">
          {topics.map((topic) => (
            <Button
              key={topic}
              variant={selectedTopics.includes(topic) ? "default" : "outline"}
              onClick={() => toggle(topic)}
              className="capitalize"
            >
              {topic}
            </Button>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button
            onClick={() => onConfirm(selectedTopics)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={selectedTopics.length === 0}
          >
            Generate Quiz
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
