import type { TrainingModule, Difficulty } from "@/types/module";
import { randInt, uid, randChoice } from "@/lib/aviation-math";

export const descentModule: TrainingModule = {
  id: "descent",
  name: "Descent Planning",
  description: "Plan when to start descending — distance and time",
  icon: "TrendingDown",
  generateQuestion(difficulty: Difficulty) {
    const currentAlt =
      difficulty === "easy"
        ? randChoice([5000, 8000, 10000, 12000])
        : randInt(3000, 25000);
    const targetAlt =
      difficulty === "easy"
        ? randChoice([1000, 2000])
        : randInt(0, Math.min(currentAlt - 1000, 5000));
    const descentRate =
      difficulty === "easy"
        ? 500
        : difficulty === "medium"
        ? randChoice([500, 700, 800, 1000])
        : randInt(300, 1500);
    const gs =
      difficulty === "easy"
        ? randChoice([100, 120, 150])
        : randInt(80, 250);

    const altToLose = currentAlt - targetAlt;
    const timeMin = Math.round(altToLose / descentRate);
    const distNm = Math.round((timeMin * gs) / 60);

    const askDist = Math.random() > 0.5;

    if (askDist) {
      return {
        id: uid(),
        prompt: `Current: ${currentAlt} ft, Target: ${targetAlt} ft, Descent rate: ${descentRate} fpm, GS: ${gs} kt. How far out should you start descending?`,
        correctAnswer: distNm,
        unit: "NM",
        tolerance: 1,
        answerType: "numeric" as const,
      };
    }

    return {
      id: uid(),
      prompt: `Current: ${currentAlt} ft, Target: ${targetAlt} ft, Descent rate: ${descentRate} fpm. How many minutes will the descent take?`,
      correctAnswer: timeMin,
      unit: "min",
      tolerance: 1,
      answerType: "numeric" as const,
    };
  },
};
