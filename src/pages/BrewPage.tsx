import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipesStore } from '../hooks/useRecipes';
import { useTimer } from '../hooks/useTimer';
import { useUIStore } from '../stores/uiStore';
import BrewTimer from '../components/BrewTimer';
import BrewStepCard from '../components/BrewStepCard';
import TastingNotesForm from '../components/TastingNotesForm';

// ── Helpers ──────────────────────────────────────────────────────
function formatTotalTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function BrewPage() {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const recipe = useRecipesStore((s) => s.getRecipe(recipeId ?? ''));
  const { isHandsFree, setHandsFree } = useUIStore();

  const timer = useTimer({ steps: recipe?.steps ?? [] });

  // Hands‑free control auto‑hide
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rating form
  const [showRating, setShowRating] = useState(false);

  // Double‑tap detection
  const lastTapRef = useRef(0);

  const startControlsTimeout = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, []);

  const clearControlsTimeout = useCallback(() => {
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }
  }, []);

  // Show rating form when brew finishes
  useEffect(() => {
    if (timer.isFinished) {
      setShowRating(true);
    }
  }, [timer.isFinished]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearControlsTimeout();
    };
  }, [clearControlsTimeout]);

  // ── No recipe guard ───────────────────────────────────────────
  if (!recipe) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold text-coffee-text">
          Receta no encontrada
        </h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-coffee-primary underline text-sm cursor-pointer"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // ── Derived state ──────────────────────────────────────────────
  const notStarted = !timer.isRunning && !timer.isFinished && timer.elapsed === 0;
  const isPaused = !timer.isRunning && !timer.isFinished && timer.elapsed > 0;
  const totalSteps = recipe.steps.length;

  // ── Handlers ───────────────────────────────────────────────────
  const handleCancel = () => {
    if (window.confirm('¿Cancelar preparación?')) {
      timer.reset();
      navigate('/');
    }
  };

  const toggleHandsFree = () => {
    const next = !isHandsFree;
    setHandsFree(next);
    if (next) {
      setControlsVisible(true);
      startControlsTimeout();
      void document.documentElement.requestFullscreen().catch(() => {});
    } else {
      setControlsVisible(false);
      clearControlsTimeout();
      void document.exitFullscreen().catch(() => {});
    }
  };

  const handleScreenTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double‑tap → next step (beep handled by useTimer)
      lastTapRef.current = 0;
      timer.nextStep();
      return;
    }
    lastTapRef.current = now;
    setControlsVisible(true);
    startControlsTimeout();
  };

  // ── Rating form ──────────────────────────────────────────────
  if (showRating) {
    return (
      <TastingNotesForm
        recipeId={recipe.id}
        recipeName={recipe.name}
        method={recipe.method}
        onSave={() => navigate('/history')}
        onSkip={() => navigate('/')}
      />
    );
  }

  // ── Hands‑free mode ────────────────────────────────────────────
  if (isHandsFree) {
    return (
      <div
        className="fixed inset-0 z-50 bg-gray-900 flex flex-col items-center justify-between select-none"
        onClick={handleScreenTap}
      >
        {/* Top area — timer */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pt-8">
          {timer.currentStep && (
            <div className="mb-4">
              <BrewStepCard
                step={timer.currentStep}
                stepIndex={timer.currentStepIndex}
                totalSteps={totalSteps}
                handsFree
              />
            </div>
          )}

          <BrewTimer
            timeLeft={timer.timeLeft}
            total={timer.currentStep?.duration ?? 0}
            isRunning={timer.isRunning}
            isFinished={timer.isFinished}
            size="large"
          />

          {isPaused && (
            <span className="text-yellow-400 text-2xl font-bold mt-4 animate-pulse">
              ⏸ PAUSADO
            </span>
          )}

          {/* Progress bar */}
          <div className="w-3/4 max-w-xs mt-6 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-coffee-primary rounded-full transition-all duration-300"
              style={{ width: `${timer.totalProgress * 100}%` }}
            />
          </div>
        </div>

        {/* Bottom controls (auto‑hide) */}
        <div
          className={`w-full px-6 pb-8 transition-opacity duration-300 ${
            controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex gap-3">
            {/* Pause / Resume */}
            {timer.isRunning ? (
              <button
                onClick={(e) => { e.stopPropagation(); timer.pause(); }}
                className="flex-1 bg-white/10 text-white py-4 rounded-2xl text-lg font-semibold backdrop-blur-sm active:bg-white/20 transition-colors cursor-pointer"
              >
                ⏸ Pausa
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); timer.resume(); }}
                className="flex-1 bg-coffee-primary text-white py-4 rounded-2xl text-lg font-semibold active:bg-coffee-primary-light transition-colors cursor-pointer"
              >
                ▶ Reanudar
              </button>
            )}

            {/* Next step (large, almost full width on small screens) */}
            <button
              onClick={(e) => { e.stopPropagation(); timer.nextStep(); }}
              className="flex-[2] bg-coffee-primary text-white py-4 rounded-2xl text-lg font-bold active:bg-coffee-primary-light transition-colors cursor-pointer"
            >
              Siguiente ▶
            </button>
          </div>

          {/* Mode toggle + Cancel */}
          <div className="flex gap-3 mt-3">
            <button
              onClick={(e) => { e.stopPropagation(); toggleHandsFree(); }}
              className="flex-1 bg-white/10 text-white/80 py-3 rounded-xl text-sm font-medium backdrop-blur-sm active:bg-white/20 transition-colors cursor-pointer"
            >
              📱 Normal
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCancel(); }}
              className="flex-1 bg-red-500/20 text-red-300 py-3 rounded-xl text-sm font-medium active:bg-red-500/30 transition-colors cursor-pointer"
            >
              ✕ Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal mode ────────────────────────────────────────────────
  return (
    <div className="px-4 py-4 pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-coffee-text truncate mr-2">
          {recipe.name}
        </h1>
        <button
          onClick={handleCancel}
          className="text-coffee-muted hover:text-red-500 transition-colors text-xl cursor-pointer shrink-0"
          aria-label="Cancelar preparación"
        >
          ✕
        </button>
      </div>

      {notStarted && (
        /* ── Not started: summary + start button ───────────── */
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-coffee-primary-light/10 w-full max-w-sm mb-6">
            <h2 className="font-semibold text-coffee-text text-center mb-3">
              Pasos
            </h2>
            <ul className="space-y-2">
              {recipe.steps.map((step) => (
                <li
                  key={step.id}
                  className="flex items-center gap-2 text-sm text-coffee-muted"
                >
                  <span className="w-5 h-5 rounded-full bg-coffee-bg flex items-center justify-center text-xs font-bold text-coffee-primary shrink-0">
                    {step.order + 1}
                  </span>
                  <span className="truncate">{step.title}</span>
                  <span className="ml-auto tabular-nums text-xs">
                    {formatTotalTime(step.duration)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-coffee-primary-light/10 flex justify-between text-sm">
              <span className="text-coffee-muted">Tiempo total</span>
              <span className="font-semibold text-coffee-text tabular-nums">
                {formatTotalTime(
                  recipe.steps.reduce((a, s) => a + s.duration, 0),
                )}
              </span>
            </div>
          </div>

          <button
            onClick={timer.start}
            className="bg-coffee-primary text-white w-full max-w-sm py-4 rounded-2xl text-lg font-bold shadow-sm hover:bg-coffee-primary-light transition-colors active:scale-[0.98] cursor-pointer"
          >
            ☕ Iniciar preparación
          </button>
        </div>
      )}

      {(timer.isRunning || isPaused) && (
        /* ── Active brew ───────────────────────────────────── */
        <div className="flex flex-col items-center gap-4">
          {/* Progress bar */}
          <div className="w-full h-2 bg-coffee-primary-light/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-coffee-primary rounded-full transition-all duration-300"
              style={{ width: `${timer.totalProgress * 100}%` }}
            />
          </div>

          {/* Step indicator */}
          <p className="text-sm text-coffee-muted tabular-nums">
            Paso {timer.currentStepIndex + 1} de {totalSteps}
          </p>

          {/* Timer */}
          <BrewTimer
            timeLeft={timer.timeLeft}
            total={timer.currentStep?.duration ?? 0}
            isRunning={timer.isRunning}
            isFinished={timer.isFinished}
          />

          {/* Paused overlay */}
          {isPaused && (
            <span className="text-yellow-600 text-lg font-bold animate-pulse">
              ⏸ PAUSADO
            </span>
          )}

          {/* Current step card */}
          {timer.currentStep && (
            <BrewStepCard
              step={timer.currentStep}
              stepIndex={timer.currentStepIndex}
              totalSteps={totalSteps}
            />
          )}

          {/* Controls */}
          <div className="flex flex-wrap gap-3 w-full mt-2">
            {timer.isRunning ? (
              <button
                onClick={timer.pause}
                className="flex-1 bg-coffee-bg border border-coffee-primary-light/20 text-coffee-text py-3 rounded-xl font-medium transition-colors hover:bg-coffee-primary-light/10 active:scale-[0.98] cursor-pointer"
              >
                ⏸ Pausa
              </button>
            ) : (
              <button
                onClick={timer.resume}
                className="flex-1 bg-coffee-primary text-white py-3 rounded-xl font-semibold transition-colors hover:bg-coffee-primary-light active:scale-[0.98] cursor-pointer"
              >
                ▶ Reanudar
              </button>
            )}

            <button
              onClick={() => { timer.prevStep(); }}
              disabled={timer.currentStepIndex <= 0}
              className="px-4 py-3 rounded-xl font-medium text-sm border border-coffee-primary-light/20 text-coffee-text hover:bg-coffee-bg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Paso anterior"
            >
              ◀
            </button>

            <button
              onClick={() => { timer.nextStep(); }}
              className="px-4 py-3 rounded-xl font-medium text-sm bg-coffee-primary text-white hover:bg-coffee-primary-light transition-colors active:scale-[0.98] cursor-pointer"
              aria-label="Siguiente paso"
            >
              ▶
            </button>

            {/* Hands‑free toggle */}
            <button
              onClick={toggleHandsFree}
              className="flex-1 bg-gray-100 text-coffee-muted py-3 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
            >
              📱 Manos libres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
