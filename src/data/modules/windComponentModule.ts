import type { TrainingModule, Difficulty } from "@/types/module";
import { windAngle, calcLongComponent, calcCrossComponent, randInt, uid, randChoice } from "@/lib/aviation-math";

export const windComponentModule: TrainingModule = {
  id: "wind-components",
  name: "Long & Cross Wind",
  description: "Calculate headwind/tailwind and crosswind components",
  icon: "Wind",
  generateQuestion(difficulty: Difficulty) {
    const rwyChoices = difficulty === "easy"
      ? [90, 180, 270, 360]
      : difficulty === "medium"
      ? [50, 100, 150, 200, 250, 300, 350]
      : Array.from({ length: 36 }, (_, i) => (i + 1) * 10);

    const rwyHdg = randChoice(rwyChoices);
    const windDirEasy = [rwyHdg, (rwyHdg + 30) % 360 || 360, (rwyHdg + 60) % 360 || 360, (rwyHdg + 330) % 360 || 360];
    const windDir =
      difficulty === "easy"
        ? randChoice(windDirEasy)
        : difficulty === "medium"
        ? randInt(1, 36) * 10
        : randInt(1, 360);
    const windSpd =
      difficulty === "easy"
        ? randChoice([10, 15, 20, 25])
        : randInt(5, 40);

    const angle = windAngle(windDir, rwyHdg);
    const askLong = Math.random() > 0.5;

    if (askLong) {
      const answer = calcLongComponent(windSpd, angle);
      return {
        id: uid(),
        prompt: `Runway heading ${rwyHdg}°, Wind ${String(windDir).padStart(3, "0")}°/${windSpd} kt. What is the headwind/tailwind component?`,
        details: `Wind angle: ${angle}°`,
        correctAnswer: answer,
        unit: "kt",
        tolerance: 1,
        answerType: "numeric" as const,
      };
    }
    const answer = calcCrossComponent(windSpd, angle);
    return {
      id: uid(),
      prompt: `Runway heading ${rwyHdg}°, Wind ${String(windDir).padStart(3, "0")}°/${windSpd} kt. What is the crosswind component?`,
      details: `Wind angle: ${angle}°`,
      correctAnswer: answer,
      unit: "kt",
      tolerance: 1,
      answerType: "numeric" as const,
    };
  },
};
