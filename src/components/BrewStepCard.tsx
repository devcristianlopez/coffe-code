import type { BrewStep, StepAction } from '../types';

interface BrewStepCardProps {
  step: BrewStep;
  stepIndex: number;
  totalSteps: number;
  handsFree?: boolean;
}

const ACTION_ICONS: Record<StepAction, string> = {
  pour: '💧',
  wait: '⏳',
  stir: '🔄',
  press: '⬇',
  serve: '☕',
  bloom: '🌸',
};

export default function BrewStepCard({
  step,
  stepIndex,
  totalSteps,
  handsFree = false,
}: BrewStepCardProps) {
  if (handsFree) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4 select-none">
        <div className="text-6xl mb-4">{ACTION_ICONS[step.action]}</div>
        <p className="text-white/90 text-3xl sm:text-4xl font-bold leading-tight max-w-md">
          {step.title}
        </p>
        {step.waterAmount !== undefined && (
          <p className="text-coffee-primary-light text-2xl mt-3 font-semibold">
            {step.waterAmount}g
          </p>
        )}
        {step.temperature !== undefined && (
          <p className="text-white/60 text-xl mt-1">{step.temperature}°C</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-coffee-primary-light/10">
      {/* Step number badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-coffee-primary text-white text-xs font-bold px-2.5 py-1 rounded-full tabular-nums">
          Paso {stepIndex + 1} de {totalSteps}
        </span>
      </div>

      {/* Icon + title */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{ACTION_ICONS[step.action]}</span>
        <h2 className="text-xl font-bold text-coffee-text">{step.title}</h2>
      </div>

      {/* Instruction */}
      <p className="text-coffee-text/80 leading-relaxed text-base">
        {step.instruction}
      </p>

      {/* Extra info */}
      <div className="flex flex-wrap gap-3 mt-4">
        {step.waterAmount !== undefined && (
          <span className="inline-flex items-center gap-1 bg-coffee-bg text-coffee-primary text-sm font-medium px-3 py-1 rounded-full">
            💧 {step.waterAmount}g
          </span>
        )}
        {step.temperature !== undefined && (
          <span className="inline-flex items-center gap-1 bg-coffee-bg text-coffee-muted text-sm font-medium px-3 py-1 rounded-full">
            🌡️ {step.temperature}°C
          </span>
        )}
      </div>
    </div>
  );
}
