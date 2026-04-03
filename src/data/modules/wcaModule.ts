import type { TrainingModule, Difficulty } from "@/types/module";
import { windAngle, calcWCA, randInt, uid, randChoice } from "@/lib/aviation-math";

export const wcaModule: TrainingModule = {
  id: "wca",
  name: "Wind Correction Angle",
  description: "Calculate WCA from wind, course, and TAS",
  icon: "Navigation",
  generateQuestion(difficulty: Difficulty) {
    const course =
      difficulty === "easy" ? randInt(1, 36) * 10 : randInt(1, 360);
    const windDir =
      difficulty === "easy" ? randInt(1, 36) * 10 : randInt(1, 360);
    const windSpd =
      difficulty === "easy" ? randChoice([10, 15, 20]) : randInt(5, 40);
    const tas =
      difficulty === "easy"
        ? randChoice([100, 120, 150])
        : difficulty === "medium"
        ? randInt(80, 200)
        : randInt(60, 250);

    const angle = windAngle(windDir, course);
    const wca = calcWCA(angle, windSpd, tas);

    if (difficulty === "hard") {
      // Ask for the corrected heading
      // Determine if wind is from left or right
      let diff = windDir - course;
      if (diff < 0) diff += 360;
      const fromRight = diff < 180;
      const correctedHdg = fromRight ? course - wca : course + wca;
      const normalized = ((correctedHdg % 360) + 360) % 360 || 360;
      return {
        id: uid(),
        prompt: `Course ${course}°, Wind ${String(windDir).padStart(3, "0")}°/${windSpd} kt, TAS ${tas} kt. What heading should you fly (corrected for wind)?`,
        details: `Wind angle: ${angle}°, WCA: ${wca}°`,
        correctAnswer: Math.round(normalized),
        unit: "°",
        tolerance: 1,
        answerType: "numeric" as const,
      };
    }

    return {
      id: uid(),
      prompt: `Course ${course}°, Wind ${String(windDir).padStart(3, "0")}°/${windSpd} kt, TAS ${tas} kt. What is the Wind Correction Angle?`,
      details: `Wind angle: ${angle}°`,
      correctAnswer: wca,
      unit: "°",
      tolerance: 1,
      answerType: "numeric" as const,
    };
  },
};
