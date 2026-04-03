import type { TrainingModule, Difficulty } from "@/types/module";
import { reciprocal, randInt, windAngle, uid, randChoice } from "@/lib/aviation-math";

export const headingModule: TrainingModule = {
  id: "heading",
  name: "Heading Calculations",
  description: "Reciprocal headings, relative bearings, and compass math",
  icon: "Compass",
  generateQuestion(difficulty: Difficulty) {
    if (difficulty === "easy") {
      const hdg = randInt(1, 36) * 10;
      return {
        id: uid(),
        prompt: `What is the reciprocal of heading ${hdg}°?`,
        correctAnswer: reciprocal(hdg),
        unit: "°",
        tolerance: 0,
        answerType: "numeric" as const,
      };
    }
    if (difficulty === "medium") {
      const hdg = randInt(1, 360);
      return {
        id: uid(),
        prompt: `What is the reciprocal of heading ${hdg}°?`,
        correctAnswer: reciprocal(hdg),
        unit: "°",
        tolerance: 0,
        answerType: "numeric" as const,
      };
    }
    // hard: relative bearing to heading
    const hdg = randInt(1, 360);
    const bearing = randInt(10, 350);
    let result = hdg + bearing;
    if (result > 360) result -= 360;
    return {
      id: uid(),
      prompt: `Your heading is ${hdg}°. A target is at relative bearing ${bearing}°. What is the true bearing to the target?`,
      correctAnswer: result,
      unit: "°",
      tolerance: 0,
      answerType: "numeric" as const,
    };
  },
};
