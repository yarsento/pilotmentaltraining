import { useState, useCallback } from "react";
import type { SessionResult } from "@/types/module";

const STORAGE_KEY = "pilot-trainer-history";

function loadHistory(): SessionResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(results: SessionResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function useHistory() {
  const [history, setHistory] = useState<SessionResult[]>(loadHistory);

  const addResult = useCallback((result: SessionResult) => {
    setHistory((prev) => {
      const next = [...prev, result];
      saveHistory(next);
      return next;
    });
  }, []);

  const getModuleHistory = useCallback(
    (moduleId: string, difficulty?: string) => {
      return history
        .filter((r) => r.moduleId === moduleId && (!difficulty || r.difficulty === difficulty))
        .slice(-10);
    },
    [history]
  );

  return { history, addResult, getModuleHistory };
}
