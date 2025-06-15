type TopicTagsProps = {
  topics: string[];
};

export default function TopicTags({ topics }: TopicTagsProps) {
  if (!topics.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10">
      {topics.map((topic, idx) => (
        <span
          key={idx}
          className="px-3 py-1 rounded-full text-sm font-medium bg-[#2A2A2A] text-gray-300 border border-[#3A3A3C] hover:bg-[#6366F1] hover:text-white transition"
        >
          {topic}
        </span>
      ))}
    </div>
  );
}
