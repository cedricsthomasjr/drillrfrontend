type SelectableTopicTagsProps = {
  topics: string[];
  selectedTopics: string[];
  setSelectedTopics: (topics: string[]) => void;
};

export default function SelectableTopicTags({
  topics,
  selectedTopics,
  setSelectedTopics,
}: SelectableTopicTagsProps) {
  const toggle = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {topics.map((topic, idx) => (
        <button
          key={idx}
          onClick={() => toggle(topic)}
          className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
            selectedTopics.includes(topic)
              ? "bg-orange-500 text-white border-orange-400"
              : "bg-[#2A2A2A] text-gray-300 border-[#3A3A3C] hover:bg-[#6366F1] hover:text-white"
          }`}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
