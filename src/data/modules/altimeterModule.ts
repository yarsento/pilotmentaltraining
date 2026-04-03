import type { TrainingModule, Difficulty } from "@/types/module";
import { randInt, uid, randChoice } from "@/lib/aviation-math";

export const altimeterModule: TrainingModule = {
  id: "altimeter-pressure",
  name: "Altimeter & Pressure",
  description: "QNH, pressure altitude, and density altitude",
  icon: "Gauge",
  generateQuestion(difficulty: Difficulty) {
    if (difficulty === "easy") {
      // Pressure altitude: field elev + (1013 - QNH) * 30
      const fieldElev = randChoice([0, 500, 1000, 2000, 3000]);
      const qnh = randChoice([993, 1003, 1013, 1023, 1033]);
      const pa = Math.round(fieldElev + (1013 - qnh) * 30);
      return {
        id: uid(),
        prompt: `Field elevation: ${fieldElev} ft, QNH: ${qnh} hPa. What is the pressure altitude?`,
        details: `Standard pressure: 1013 hPa, 1 hPa ≈ 30 ft`,
        correctAnswer: pa,
        unit: "ft",
        tolerance: 10,
        answerType: "numeric" as const,
      };
    }
    if (difficulty === "medium") {
      // Density altitude: PA + (120 * (OAT - ISA_temp))
      const pa = randChoice([2000, 3000, 4000, 5000, 6000]);
      const isaTemp = 15 - (pa / 1000) * 2;
      const oat = isaTemp + randChoice([-5, 0, 5, 10, 15, 20]);
      const da = Math.round(pa + 120 * (oat - isaTemp));
      return {
        id: uid(),
        prompt: `Pressure altitude: ${pa} ft, OAT: ${oat}°C (ISA temp at this alt: ${isaTemp}°C). What is the density altitude?`,
        correctAnswer: da,
        unit: "ft",
        tolerance: 50,
        answerType: "numeric" as const,
      };
    }
    // hard: combined
    const fieldElev = randInt(500, 5000);
    const qnh = randInt(983, 1043);
    const pa = Math.round(fieldElev + (1013 - qnh) * 30);
    const isaTemp = 15 - (pa / 1000) * 2;
    const oat = Math.round(isaTemp + randInt(-10, 25));
    const da = Math.round(pa + 120 * (oat - isaTemp));
    return {
      id: uid(),
      prompt: `Field elev: ${fieldElev} ft, QNH: ${qnh} hPa, OAT: ${oat}°C. What is the density altitude?`,
      correctAnswer: da,
      unit: "ft",
      tolerance: 100,
      answerType: "numeric" as const,
    };
  },
};
