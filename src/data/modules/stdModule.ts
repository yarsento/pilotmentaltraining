import type { TrainingModule, Difficulty } from "@/types/module";
import { randInt, uid, randChoice } from "@/lib/aviation-math";

export const stdModule: TrainingModule = {
  id: "speed-time-distance",
  name: "Speed / Time / Distance",
  description: "Groundspeed, ETA, and fuel burn calculations",
  icon: "Clock",
  generateQuestion(difficulty: Difficulty) {
    if (difficulty === "easy") {
      const speed = randChoice([90, 100, 120, 150, 180]);
      const dist = randChoice([30, 45, 60, 90, 120]);
      const timeMin = Math.round((dist / speed) * 60);
      return {
        id: uid(),
        prompt: `Distance: ${dist} NM, Groundspeed: ${speed} kt. How many minutes to destination?`,
        correctAnswer: timeMin,
        unit: "min",
        tolerance: 1,
        answerType: "numeric" as const,
      };
    }
    if (difficulty === "medium") {
      const speed = randInt(80, 200);
      const time = randInt(10, 90);
      const dist = Math.round((speed * time) / 60);
      return {
        id: uid(),
        prompt: `Groundspeed: ${speed} kt, Time: ${time} min. What distance will you cover?`,
        correctAnswer: dist,
        unit: "NM",
        tolerance: 1,
        answerType: "numeric" as const,
      };
    }
    // hard: fuel burn
    const speed = randInt(100, 180);
    const dist = randInt(50, 250);
    const fuelRate = randChoice([8, 10, 12, 15, 20]); // gal/hr
    const timeHrs = dist / speed;
    const fuel = Math.round(timeHrs * fuelRate);
    return {
      id: uid(),
      prompt: `Distance: ${dist} NM, GS: ${speed} kt, Fuel flow: ${fuelRate} gal/hr. How many gallons needed?`,
      correctAnswer: fuel,
      unit: "gal",
      tolerance: 1,
      answerType: "numeric" as const,
    };
  },
};
