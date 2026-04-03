import { Link } from "react-router-dom";
import type { TrainingModule } from "@/types/module";
import {
  Compass, Clock, Gauge, Scale, Wind, Navigation, RotateCcw, Plane, TrendingDown,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Compass, Clock, Gauge, Scale, Wind, Navigation, RotateCcw, Plane, TrendingDown,
};

interface ModuleCardProps {
  module: TrainingModule;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const Icon = iconMap[module.icon] ?? Compass;

  return (
    <Link
      to={`/module/${module.id}`}
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {module.name}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{module.description}</p>
    </Link>
  );
}
