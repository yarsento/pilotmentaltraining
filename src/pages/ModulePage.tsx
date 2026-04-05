import { useParams, Link, useNavigate } from "react-router-dom";
import { getModuleById } from "@/data/moduleRegistry";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { ScoreChart } from "@/components/ScoreChart";
import { useHistory } from "@/hooks/useHistory";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { Difficulty } from "@/types/module";

const difficulties: Difficulty[] = ["easy", "medium", "hard"];

export default function ModulePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const module = getModuleById(id ?? "");
  const { getModuleHistory } = useHistory();
  const [selected, setSelected] = useState<Difficulty>("easy");

  if (!module) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Module not found.</p>
      </div>
    );
  }

  const history = getModuleHistory(module.id, selected);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">{module.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        <p className="text-muted-foreground whitespace-pre-line">{module.longDescription ?? module.description}</p>

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-foreground">Select Difficulty</h2>
          <div className="flex gap-3">
            {difficulties.map((d) => (
              <DifficultyBadge
                key={d}
                difficulty={d}
                selected={selected === d}
                onClick={() => setSelected(d)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate(`/module/${module.id}/session?difficulty=${selected}`)}
          className="w-full rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
        >
          Start Training
        </button>

        <div className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">
            Recent Sessions ({selected})
          </h2>
          <ScoreChart results={history} />
        </div>
      </main>
    </div>
  );
}
