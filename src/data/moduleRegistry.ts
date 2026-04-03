import type { TrainingModule } from "@/types/module";
import { headingModule } from "./modules/headingModule";
import { stdModule } from "./modules/stdModule";
import { altimeterModule } from "./modules/altimeterModule";
import { weightBalanceModule } from "./modules/weightBalanceModule";
import { windComponentModule } from "./modules/windComponentModule";
import { wcaModule } from "./modules/wcaModule";
import { holdingModule } from "./modules/holdingModule";
import { tasModule } from "./modules/tasModule";
import { descentModule } from "./modules/descentModule";

export const modules: TrainingModule[] = [
  headingModule,
  stdModule,
  altimeterModule,
  weightBalanceModule,
  windComponentModule,
  wcaModule,
  holdingModule,
  tasModule,
  descentModule,
];

export function getModuleById(id: string): TrainingModule | undefined {
  return modules.find((m) => m.id === id);
}
