import type { TrainingModule, Difficulty } from "@/types/module";
import { calcTAS, randInt, uid, randChoice } from "@/lib/aviation-math";

export const tasModule: TrainingModule = {
  id: "tas",
  name: "True Airspeed",
  description: "Calculate TAS from IAS and altitude",
  icon: "Plane",
  generateQuestion(difficulty: Difficulty) {
    const ias =
      difficulty === "easy"
        ? randChoice([100, 120, 150, 180])
        : randInt(80, 250);
    const altitude =
      difficulty === "easy"
        ? randChoice([5000, 10000, 15000, 20000])
        : difficulty === "medium"
        ? randChoice([3000, 5500, 7500, 9000, 12000, 15000])
        : randInt(1000, 25000);

    const answer = calcTAS(ias, altitude);

    if (difficulty === "hard") {
      // Add temperature deviation for context (informational)
      const tempDev = randInt(-10, 20);
      return {
        id: uid(),
        prompt: `IAS: ${ias} kt, Altitude: ${altitude} ft, Temp deviation: ISA+${tempDev}°C. Calculate TAS (use 2% per 1000ft rule only).`,
        correctAnswer: answer,
        unit: "kt",
        tolerance: 1,
        answerType: "numeric" as const,
      };
    }

    return {
      id: uid(),
      prompt: `IAS: ${ias} kt, Altitude: ${altitude} ft. What is the True Airspeed? (2% per 1000ft rule)`,
      correctAnswer: answer,
      unit: "kt",
      tolerance: 1,
      answerType: "numeric" as const,
    };
  },
};
