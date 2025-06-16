export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1A1A] bg-opacity-95 space-y-4">
      <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Generating your quiz…</p>
    </div>
  );
}
