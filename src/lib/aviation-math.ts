/** Wind angle: absolute angle between wind direction and reference (course/runway) */
export function windAngle(windDir: number, reference: number): number {
  let diff = Math.abs(windDir - reference);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

/** Long wind component percentage: (110 - windAngle)% — clamped 0-100 */
export function longWindPercent(angle: number): number {
  return Math.max(0, Math.min(100, 110 - angle));
}

/** Cross wind component percentage: (20 + windAngle)% — clamped 0-100 */
export function crossWindPercent(angle: number): number {
  return Math.max(0, Math.min(100, 20 + angle));
}

/** Long wind component in knots */
export function calcLongComponent(windSpeed: number, angle: number): number {
  return Math.round((windSpeed * longWindPercent(angle)) / 100);
}

/** Cross wind component in knots */
export function calcCrossComponent(windSpeed: number, angle: number): number {
  return Math.round((windSpeed * crossWindPercent(angle)) / 100);
}

/** Wind Correction Angle: (windAngle * windVelocity) / TAS */
export function calcWCA(angle: number, windVelocity: number, tas: number): number {
  return Math.round((angle * windVelocity) / tas);
}

/** True Airspeed: IAS + IAS * 2% per 1000ft */
export function calcTAS(ias: number, altitudeFt: number): number {
  return Math.round(ias + ias * 0.02 * (altitudeFt / 1000));
}

/** Reciprocal heading */
export function reciprocal(heading: number): number {
  return heading <= 180 ? heading + 180 : heading - 180;
}

/** Random int between min and max inclusive */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random element from array */
export function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Round to nearest multiple */
export function roundTo(value: number, multiple: number): number {
  return Math.round(value / multiple) * multiple;
}

/** Generate a unique ID */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
