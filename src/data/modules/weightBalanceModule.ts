import type { TrainingModule, Difficulty } from "@/types/module";
import { randInt, uid, randChoice } from "@/lib/aviation-math";

export const weightBalanceModule: TrainingModule = {
  id: "weight-balance",
  name: "Weight & Balance",
  description: "Total weight, CG position, and moment calculations",
  icon: "Scale",
  generateQuestion(difficulty: Difficulty) {
    if (difficulty === "easy") {
      const emptyW = randChoice([1200, 1400, 1500, 1650]);
      const pilot = randInt(140, 220);
      const pax = randInt(120, 200);
      const fuel = randChoice([30, 40, 50]) * 6; // lbs
      const total = emptyW + pilot + pax + fuel;
      return {
        id: uid(),
        prompt: `Empty weight: ${emptyW} lbs, Pilot: ${pilot} lbs, Passenger: ${pax} lbs, Fuel: ${fuel} lbs. Total weight?`,
        correctAnswer: total,
        unit: "lbs",
        tolerance: 0,
        answerType: "numeric" as const,
      };
    }
    if (difficulty === "medium") {
      const items = [
        { name: "Empty aircraft", weight: randChoice([1500, 1650, 1800]), arm: randChoice([82, 85, 88]) },
        { name: "Front seats", weight: randInt(250, 400), arm: randChoice([85, 87, 90]) },
        { name: "Rear seats", weight: randInt(0, 300), arm: randChoice([118, 120, 125]) },
        { name: "Fuel", weight: randChoice([180, 240, 300]), arm: randChoice([95, 96, 98]) },
      ];
      const totalW = items.reduce((s, i) => s + i.weight, 0);
      const totalMoment = items.reduce((s, i) => s + i.weight * i.arm, 0);
      const cg = Math.round((totalMoment / totalW) * 10) / 10;
      const details = items.map((i) => `${i.name}: ${i.weight} lbs @ ${i.arm}"`).join(", ");
      return {
        id: uid(),
        prompt: `Calculate the CG position (in inches aft of datum). ${details}`,
        correctAnswer: cg,
        unit: "in",
        tolerance: 0.5,
        answerType: "numeric" as const,
      };
    }
    // hard: fuel burn CG shift
    const emptyW = 1650;
    const emptyArm = 85;
    const frontW = randInt(300, 400);
    const frontArm = 87;
    const rearW = randInt(100, 250);
    const rearArm = 120;
    const fuelW = randChoice([240, 300, 360]);
    const fuelArm = 96;
    const burnW = randChoice([60, 90, 120]);

    const totalW = emptyW + frontW + rearW + fuelW - burnW;
    const totalMoment =
      emptyW * emptyArm +
      frontW * frontArm +
      rearW * rearArm +
      (fuelW - burnW) * fuelArm;
    const cg = Math.round((totalMoment / totalW) * 10) / 10;
    return {
      id: uid(),
      prompt: `Empty: ${emptyW}lbs@${emptyArm}", Front: ${frontW}lbs@${frontArm}", Rear: ${rearW}lbs@${rearArm}", Fuel: ${fuelW}lbs@${fuelArm}" minus ${burnW}lbs burned. CG after burn?`,
      correctAnswer: cg,
      unit: "in",
      tolerance: 0.5,
      answerType: "numeric" as const,
    };
  },
};
