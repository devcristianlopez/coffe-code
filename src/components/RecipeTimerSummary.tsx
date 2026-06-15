import type { BrewStep } from '../types';

interface RecipeTimerSummaryProps {
  steps: BrewStep[];
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function RecipeTimerSummary({ steps }: RecipeTimerSummaryProps) {
  const totalTime = steps.reduce((acc, step) => acc + step.duration, 0);
  const hasBloom = steps.some((step) => step.action === 'bloom');

  return (
    <div className="flex items-center gap-3 text-sm text-coffee-muted">
      <span className="flex items-center gap-1">
        <span className="text-base">⏱️</span>
        <span className="font-semibold text-coffee-text tabular-nums">
          {formatTime(totalTime)}
        </span>
      </span>
      <span className="flex items-center gap-1">
        <span className="text-base">📋</span>
        <span>
          {steps.length} {steps.length === 1 ? 'paso' : 'pasos'}
        </span>
      </span>
      {hasBloom && (
        <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-xs font-medium">
          🌸 Bloom
        </span>
      )}
    </div>
  );
}
