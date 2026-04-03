import { useState, useCallback, useRef } from "react";
import type { Question, Difficulty, TrainingModule, SessionResult } from "@/types/module";

const TOTAL_QUESTIONS = 10;

interface SessionState {
  status: "idle" | "active" | "finished";
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  correct: boolean[];
  questionTimes: number[];
  startTime: number;
}

export function useSession(module: TrainingModule | undefined) {
  const [state, setState] = useState<SessionState>({
    status: "idle",
    questions: [],
    currentIndex: 0,
    answers: [],
    correct: [],
    questionTimes: [],
    startTime: 0,
  });
  const questionStartRef = useRef(0);

  const start = useCallback(
    (difficulty: Difficulty) => {
      if (!module) return;
      const questions = Array.from({ length: TOTAL_QUESTIONS }, () =>
        module.generateQuestion(difficulty)
      );
      setState({
        status: "active",
        questions,
        currentIndex: 0,
        answers: [],
        correct: [],
        questionTimes: [],
        startTime: Date.now(),
      });
      questionStartRef.current = Date.now();
    },
    [module]
  );

  const submitAnswer = useCallback(
    (answer: number): { isCorrect: boolean; correctAnswer: number } | null => {
      if (state.status !== "active") return null;
      const q = state.questions[state.currentIndex];
      const isCorrect = Math.abs(answer - q.correctAnswer) <= q.tolerance;
      const elapsed = Date.now() - questionStartRef.current;

      setState((prev) => {
        const newAnswers = [...prev.answers, answer];
        const newCorrect = [...prev.correct, isCorrect];
        const newTimes = [...prev.questionTimes, elapsed];
        const nextIndex = prev.currentIndex + 1;
        const finished = nextIndex >= TOTAL_QUESTIONS;

        return {
          ...prev,
          answers: newAnswers,
          correct: newCorrect,
          questionTimes: newTimes,
          currentIndex: finished ? prev.currentIndex : nextIndex,
          status: finished ? "finished" : "active",
        };
      });

      questionStartRef.current = Date.now();
      return { isCorrect, correctAnswer: q.correctAnswer };
    },
    [state.status, state.questions, state.currentIndex]
  );

  const getResult = useCallback(
    (difficulty: Difficulty): SessionResult | null => {
      if (state.status !== "finished" || !module) return null;
      return {
        moduleId: module.id,
        difficulty,
        date: new Date().toISOString(),
        score: state.correct.filter(Boolean).length,
        totalQuestions: TOTAL_QUESTIONS,
        totalTimeMs: state.questionTimes.reduce((a, b) => a + b, 0),
        questionTimes: state.questionTimes,
      };
    },
    [state, module]
  );

  const reset = useCallback(() => {
    setState({
      status: "idle",
      questions: [],
      currentIndex: 0,
      answers: [],
      correct: [],
      questionTimes: [],
      startTime: 0,
    });
  }, []);

  return {
    status: state.status,
    currentQuestion: state.questions[state.currentIndex] ?? null,
    currentIndex: state.currentIndex,
    totalQuestions: TOTAL_QUESTIONS,
    answers: state.answers,
    correct: state.correct,
    questionTimes: state.questionTimes,
    score: state.correct.filter(Boolean).length,
    start,
    submitAnswer,
    getResult,
    reset,
  };
}
