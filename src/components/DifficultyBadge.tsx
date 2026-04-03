import type { Difficulty } from "@/types/module";

const labels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const colors: Record<Difficulty, string> = {
  easy: "bg-green-100 text-green-800 border-green-300",
  medium: "bg-amber-100 text-amber-800 border-amber-300",
  hard: "bg-red-100 text-red-800 border-red-300",
};

const activeColors: Record<Difficulty, string> = {
  easy: "bg-green-600 text-white border-green-600",
  medium: "bg-amber-600 text-white border-amber-600",
  hard: "bg-red-600 text-white border-red-600",
};

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  selected?: boolean;
  onClick?: () => void;
}

export function DifficultyBadge({ difficulty, selected, onClick }: DifficultyBadgeProps) {
  const cls = selected ? activeColors[difficulty] : colors[difficulty];
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${cls} ${
        onClick ? "cursor-pointer hover:opacity-80" : ""
      }`}
    >
      {labels[difficulty]}
    </button>
  );
}
