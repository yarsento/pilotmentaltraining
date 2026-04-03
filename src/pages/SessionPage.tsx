import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { getModuleById } from "@/data/moduleRegistry";
import { useSession } from "@/hooks/useSession";
import { useHistory } from "@/hooks/useHistory";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { ArrowLeft, Check, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { Difficulty } from "@/types/module";

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const difficulty = (searchParams.get("difficulty") ?? "easy") as Difficulty;
  const module = getModuleById(id ?? "");
  const session = useSession(module);
  const { addResult } = useHistory();
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedRef = useRef(false);

  useEffect(() => {
    if (module) session.start(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module, difficulty]);

  useEffect(() => {
    if (session.status === "finished" && !savedRef.current) {
      savedRef.current = true;
      const result = session.getResult(difficulty);
      if (result) addResult(result);
    }
  }, [session.status, session, difficulty, addResult]);

  useEffect(() => {
    if (!feedback) inputRef.current?.focus();
  }, [feedback, session.currentIndex]);

  if (!module) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Module not found.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback) return;
    const val = parseFloat(input);
    if (isNaN(val)) return;
    const result = session.submitAnswer(val);
    if (result) {
      setFeedback(result);
      setTimeout(() => {
        setFeedback(null);
        setInput("");
      }, 1200);
    }
  };

  if (session.status === "finished") {
    const totalSec = (session.questionTimes.reduce((a, b) => a + b, 0) / 1000).toFixed(1);
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
            <Link
              to={`/module/${module.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-lg font-bold text-foreground">Results</h1>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {session.score} / {session.totalQuestions}
              </h2>
              <p className="text-sm text-muted-foreground">Total time: {totalSec}s</p>
            </div>
            <DifficultyBadge difficulty={difficulty} />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Time per question</h3>
            <div className="flex items-end gap-1" style={{ height: 80 }}>
              {session.questionTimes.map((t, i) => {
                const maxT = Math.max(...session.questionTimes);
                const h = maxT > 0 ? (t / maxT) * 100 : 0;
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                    <span className="text-[9px] text-muted-foreground">{(t / 1000).toFixed(1)}s</span>
                    <div
                      className={`w-full rounded-t min-h-[2px] ${
                        session.correct[i] ? "bg-green-500" : "bg-red-400"
                      }`}
                      style={{ height: `${Math.max(h, 3)}%` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                savedRef.current = false;
                session.start(difficulty);
              }}
              className="flex-1 rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:opacity-90"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(`/module/${module.id}`)}
              className="flex-1 rounded-lg border border-border py-3 font-semibold text-foreground hover:bg-accent"
            >
              Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const q = session.currentQuestion;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              to={`/module/${module.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <span className="text-sm font-medium text-foreground">{module.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <DifficultyBadge difficulty={difficulty} />
            <span className="text-sm text-muted-foreground">
              {session.currentIndex + 1}/{session.totalQuestions}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${((session.currentIndex) / session.totalQuestions) * 100}%`,
            }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {q && (
          <>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground leading-relaxed">{q.prompt}</p>
              {q.details && difficulty === "easy" && (
                <p className="text-sm text-muted-foreground">{q.details}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="number"
                  step="any"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={`Answer${q.unit ? ` (${q.unit})` : ""}`}
                  disabled={!!feedback}
                  inputMode="decimal"
                />
              </div>
              <button
                type="submit"
                disabled={!!feedback || !input}
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                Submit
              </button>
            </form>

            {feedback && (
              <div
                className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
                  feedback.isCorrect
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {feedback.isCorrect ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                {feedback.isCorrect
                  ? "Correct!"
                  : `Incorrect — answer: ${feedback.correctAnswer}${q.unit ? ` ${q.unit}` : ""}`}
              </div>
            )}

            <div className="flex gap-1">
              {Array.from({ length: session.totalQuestions }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < session.correct.length
                      ? session.correct[i]
                        ? "bg-green-500"
                        : "bg-red-400"
                      : i === session.currentIndex
                      ? "bg-primary/30"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
