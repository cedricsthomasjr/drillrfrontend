'use client';

import { motion } from 'framer-motion';

type QuestionProps = {
  qIndex: number;
  question: string;
  options: string[];
  answer: string;
  selected: string | null;
  submitted: boolean;
  onSelect: (option: string) => void;
};

export default function QuestionCard({
  qIndex,
  question,
  options,
  answer,
  selected,
  submitted,
  onSelect,
}: QuestionProps) {
  const getStyle = (option: string) => {
    if (!submitted) {
      return selected === option
        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-300'
        : 'border-gray-300 hover:border-red-400';
    }

    if (option === answer) return 'border-green-500 bg-green-100';
    if (selected === option) return 'border-red-500 bg-red-100';
    return 'border-gray-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: qIndex * 0.1, duration: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-lg font-semibold mb-4">
        {qIndex + 1}. {question}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, i) => (
          <motion.button
            key={i}
            onClick={() => onSelect(option)}
            disabled={submitted}
            className={`text-left p-4 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
              getStyle(option)
            }`}
            whileTap={{ scale: 0.97 }}
            whileHover={!submitted ? { scale: 1.02 } : {}}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
