import type { TrainingModule, Difficulty } from "@/types/module";
import { windAngle, calcLongComponent, randInt, uid, randChoice, closestAngle } from "@/lib/aviation-math";

export const holdingModule: TrainingModule = {
  id: "holding",
  name: "Holding Time Correction",
  description: "Calculate outbound leg time correction in a hold",
  longDescription: "In a standard holding pattern, the outbound leg time is typically 1 minute at or below 14,000 ft, and 1.5 minutes above. However, when there is wind, the outbound leg time needs to be adjusted to maintain the desired holding pattern shape. The correction depends on the wind angle and speed relative to the inbound leg.\n\nThe general rule of thumb for time correction is:\n- If the wind is mostly headwind or tailwind (within 30° of inbound), apply the full correction based on the long wind component.\n- If the wind is at a moderate angle (30° to 60°), apply half the correction.\n- If the wind is mostly crosswind (greater than 60°), no correction is needed.\n\nThe long wind component can be calculated as: Long component = (110 - closestAngle) % of wind speed, where closestAngle is the smallest angle between the wind direction and the inbound course, normalized to 0-180°.",
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
    const closest = closestAngle(angle);
    const longComp = calcLongComponent(windSpd, angle);

    // Time correction based on wind angle
    let correction: number;
    if (closest <= 30) {
      correction = longComp; // full seconds
    } else if (closest <= 60) {
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
