type QuizHeaderProps = {
  study_material?: string;
  summary?: string | null;
};

export default function QuizHeader({
  study_material,
  summary,
}: QuizHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <h1 className="text-3xl font-bold text-white mb-2">
        Your Quiz<span className="text-indigo-400">.</span>
      </h1>
      {summary ? (
        <p className="text-sm text-gray-400 italic">{summary}</p>
      ) : study_material ? (
        <p className="text-sm text-gray-400 italic">
          Based on:{" "}
          <span className="text-gray-300">
            {decodeURIComponent(study_material).slice(0, 100)}...
          </span>
        </p>
      ) : null}
    </div>
  );
}
