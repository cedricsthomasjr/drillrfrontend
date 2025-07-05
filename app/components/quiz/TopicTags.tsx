"use client";

type TopicTagsProps = {
  topics: string[] | null | undefined;
};

export default function TopicTags({ topics }: TopicTagsProps) {
  if (!topics || topics.length === 0) return null;

  return (
    <div className="text-center">
      <ul className="flex flex-wrap justify-center gap-2">
        {topics.map((topic, i) => (
          <li
            key={i}
            className="
              px-3 py-1 rounded-full text-xs font-medium 
              bg-[#1C1C1E] border border-[#2A2A2C] text-gray-200
              hover:border-orange-400 transition-colors duration-200
            "
          >
            {topic}
          </li>
        ))}
      </ul>
    </div>
  );
}
