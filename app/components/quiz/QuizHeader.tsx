type QuizHeaderProps = {
  study_material?: string;
  summary?: string | null;
};

export default function QuizHeader({
  study_material,
  summary,
}: QuizHeaderProps) {
  let decoded = "";

  if (study_material) {
    try {
      decoded = decodeURIComponent(study_material).slice(0, 100);
    } catch {
      decoded = study_material.slice(0, 100);
    }
  }

  return (
    <div className="mb-6 text-center">
      <h1 className="text-3xl font-bold text-white mb-2">
        Your Quiz<span className="text-orange-400">.</span>
      </h1>
    </div>
  );
}
