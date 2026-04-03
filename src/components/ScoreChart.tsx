import type { SessionResult } from "@/types/module";

interface ScoreChartProps {
  results: SessionResult[];
}

export function ScoreChart({ results }: ScoreChartProps) {
  if (results.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">No sessions yet. Start training!</p>
    );
  }

  const maxTime = Math.max(...results.map((r) => r.totalTimeMs));

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1.5" style={{ height: 120 }}>
        {results.map((r, i) => {
          const heightPct = maxTime > 0 ? (r.totalTimeMs / maxTime) * 100 : 0;
          const scorePct = r.totalQuestions > 0 ? r.score / r.totalQuestions : 0;
          const barColor =
            scorePct >= 0.8 ? "bg-green-500" : scorePct >= 0.5 ? "bg-amber-500" : "bg-red-500";
          const timeSec = (r.totalTimeMs / 1000).toFixed(1);
          return (
            <div
              key={i}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <span className="text-[10px] text-muted-foreground font-medium">
                {timeSec}s
              </span>
              <div
                className={`w-full rounded-t ${barColor} min-h-[4px] transition-all`}
                style={{ height: `${Math.max(heightPct, 4)}%` }}
                title={`${timeSec}s — ${r.score}/${r.totalQuestions} correct`}
              />
              <span className="text-[9px] text-muted-foreground">
                {r.score}/{r.totalQuestions}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>← Older</span>
        <span>Newer →</span>
      </div>
    </div>
  );
}
