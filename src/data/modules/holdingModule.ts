import type { TrainingModule, Difficulty } from "@/types/module";
import { windAngle, calcLongComponent, randInt, uid, randChoice } from "@/lib/aviation-math";

export const holdingModule: TrainingModule = {
  id: "holding",
  name: "Holding Time Correction",
  description: "Calculate outbound leg time correction in a hold",
  icon: "RotateCcw",
  generateQuestion(difficulty: Difficulty) {
    const inboundCourse =
      difficulty === "easy" ? randInt(1, 36) * 10 : randInt(1, 360);
    const outboundCourse = inboundCourse <= 180 ? inboundCourse + 180 : inboundCourse - 180;
    const windDir =
      difficulty === "easy"
        ? randInt(1, 36) * 10
        : difficulty === "medium"
        ? randInt(1, 36) * 10
        : randInt(1, 360);
    const windSpd =
      difficulty === "easy" ? randChoice([10, 15, 20]) : randInt(5, 40);

    // Wind angle relative to inbound leg
    const angle = windAngle(windDir, inboundCourse);
    const longComp = calcLongComponent(windSpd, angle);

    // Time correction based on wind angle
    let correction: number;
    if (angle <= 30) {
      correction = longComp; // full seconds
    } else if (angle <= 60) {
      correction = Math.round(longComp / 2); // half seconds
    } else {
      correction = 0;
    }

    // Determine if outbound leg is into or away from wind
    const outboundAngle = windAngle(windDir, outboundCourse);
    const outboundLongPercent = 110 - outboundAngle;
    // If outbound into wind (headwind on outbound), add time; else subtract
    const intoWind = outboundLongPercent > 0 && outboundAngle <= 90;

    // The standard 1-minute outbound leg
    const baseTime = 60; // seconds
    const adjustedTime = intoWind ? baseTime + correction : baseTime - correction;

    return {
      id: uid(),
      prompt: `Holding: Inbound ${inboundCourse}°, Wind ${String(windDir).padStart(3, "0")}°/${windSpd} kt. What is the corrected outbound leg time?`,
      details: `Wind angle to inbound: ${angle}°, Long component: ${longComp} kt, Correction: ${intoWind ? "+" : "-"}${correction}s`,
      correctAnswer: adjustedTime,
      unit: "sec",
      tolerance: 1,
      answerType: "numeric" as const,
    };
  },
};
