import { useCallback, useEffect, useRef, useState } from 'react';
import type { BrewStep } from '../types';

function playBeep(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Audio not available — silently ignore
  }
}

export interface UseTimerReturn {
  currentStepIndex: number;
  currentStep: BrewStep | null;
  timeLeft: number;
  elapsed: number;
  isRunning: boolean;
  isFinished: boolean;
  progress: number;
  totalProgress: number;
  start: () => void;
  pause: () => void;
  resume: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  reset: () => void;
}

interface UseTimerProps {
  steps: BrewStep[];
}

export function useTimer({ steps }: UseTimerProps): UseTimerReturn {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transitioningRef = useRef(false);

  const currentStep = steps[currentStepIndex] ?? null;
  const stepDuration = currentStep?.duration ?? 0;
  const totalDuration = steps.reduce((acc, s) => acc + s.duration, 0);

  const progress =
    stepDuration > 0 ? (stepDuration - timeLeft) / stepDuration : 1;
  const totalProgress = totalDuration > 0 ? elapsed / totalDuration : 0;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Tick interval ────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning || isFinished) {
      clearTimer();
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, +(prev - 0.1).toFixed(1)));
      setElapsed((prev) => +(prev + 0.1).toFixed(1));
    }, 100);

    intervalRef.current = id;
    return () => clearInterval(id);
  }, [isRunning, isFinished, clearTimer]);

  // ── Step transition when timeLeft reaches 0 ───────────────────
  useEffect(() => {
    if (!isRunning || isFinished || transitioningRef.current) return;
    if (timeLeft > 0) return;

    transitioningRef.current = true;

    // Find next step with duration > 0, skipping zero-duration steps
    let nextIdx = currentStepIndex + 1;
    while (nextIdx < steps.length) {
      const candidate = steps[nextIdx];
      if (!candidate) break;
      if (candidate.duration > 0) {
        playBeep();
        setCurrentStepIndex(nextIdx);
        setTimeLeft(candidate.duration);
        requestAnimationFrame(() => {
          transitioningRef.current = false;
        });
        return;
      }
      // Zero-duration step — skip it and keep looking
      nextIdx++;
    }

    // No more steps with duration → brew finished
    if (nextIdx >= steps.length) {
      playBeep();
      // Point to the last step visually
      setCurrentStepIndex(steps.length - 1);
      clearTimer();
      setIsRunning(false);
      setIsFinished(true);
      setTimeLeft(0);
    }

    requestAnimationFrame(() => {
      transitioningRef.current = false;
    });
  }, [timeLeft, isRunning, isFinished, currentStepIndex, steps, clearTimer]);

  // ── Manual step navigation ────────────────────────────────────
  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= steps.length) return;
      const step = steps[index];
      if (!step) return;

      setCurrentStepIndex(index);
      setTimeLeft(step.duration);
    },
    [steps],
  );

  const nextStep = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      clearTimer();
      setIsRunning(false);
      setIsFinished(true);
      setTimeLeft(0);
      return;
    }
    playBeep();
    goToStep(currentStepIndex + 1);
  }, [currentStepIndex, steps.length, clearTimer, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStepIndex <= 0) return;
    goToStep(currentStepIndex - 1);
  }, [currentStepIndex, goToStep]);

  // ── Lifecycle ────────────────────────────────────────────────
  const start = useCallback(() => {
    if (steps.length === 0) return;
    setCurrentStepIndex(0);
    setElapsed(0);
    setIsFinished(false);

    const firstStep = steps[0];
    if (firstStep) {
      setTimeLeft(firstStep.duration);
    }
    setIsRunning(true);
  }, [steps]);

  const pause = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (isFinished) return;
    setIsRunning(true);
  }, [isFinished]);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStepIndex(0);
    setTimeLeft(0);
    setElapsed(0);
    setIsRunning(false);
    setIsFinished(false);
  }, [clearTimer]);

  return {
    currentStepIndex,
    currentStep,
    timeLeft,
    elapsed,
    isRunning,
    isFinished,
    progress: Math.min(1, Math.max(0, progress)),
    totalProgress: Math.min(1, Math.max(0, totalProgress)),
    start,
    pause,
    resume,
    nextStep,
    prevStep,
    goToStep,
    reset,
  };
}
