import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useRecipesStore } from '../hooks/useRecipes';
import { METHOD_LABELS } from '../types';
import type { BrewMethod, BrewStep, Recipe } from '../types';

const METHODS: BrewMethod[] = [
  'v60',
  'chemex',
  'french-press',
  'moka',
  'aeropress',
  'espresso',
];

interface StepFormData {
  id: string;
  title: string;
  duration: number;
  instruction: string;
  waterAmount: string;
}

interface FormErrors {
  name?: string;
  coffeeGrams?: string;
  waterGrams?: string;
  temperature?: string;
  grindSize?: string;
  steps?: string;
}

export default function RecipeFormPage() {
  const { id } = useParams<{ method: string; id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const recipes = useRecipesStore((state) => state.recipes);
  const addRecipe = useRecipesStore((state) => state.addRecipe);
  const updateRecipe = useRecipesStore((state) => state.updateRecipe);

  const isEditMode = Boolean(id);
  const existingRecipe = id ? recipes.find((r) => r.id === id) : undefined;

  // ── Form state ──────────────────────────────────────────────────────────
  const [method, setMethod] = useState<BrewMethod>(() => {
    if (existingRecipe) return existingRecipe.method;
    const queryMethod = searchParams.get('method') as BrewMethod | null;
    return queryMethod ?? 'v60';
  });
  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [coffeeGrams, setCoffeeGrams] = useState('');
  const [waterGrams, setWaterGrams] = useState('');
  const [temperature, setTemperature] = useState('');
  const [grindSize, setGrindSize] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState<StepFormData[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  // ── Load existing recipe in edit mode ───────────────────────────────────
  useEffect(() => {
    if (!existingRecipe) return;

    setName(existingRecipe.name);
    setAuthor(existingRecipe.author ?? '');
    setCoffeeGrams(String(existingRecipe.coffeeGrams));
    setWaterGrams(String(existingRecipe.waterGrams));
    setTemperature(String(existingRecipe.temperature));
    setGrindSize(existingRecipe.grindSize);
    setDescription(existingRecipe.description ?? '');
    setMethod(existingRecipe.method);
    setSteps(
      existingRecipe.steps.map((s) => ({
        id: s.id,
        title: s.title,
        duration: s.duration,
        instruction: s.instruction,
        waterAmount: s.waterAmount !== undefined ? String(s.waterAmount) : '',
      })),
    );
  }, [existingRecipe]);

  // ── Redirect if edit mode and recipe not found (after data loads) ────────
  useEffect(() => {
    if (isEditMode && recipes.length > 0 && !existingRecipe) {
      navigate('/recipes', { replace: true });
    }
  }, [isEditMode, recipes, existingRecipe, navigate]);

  // ── Step management ─────────────────────────────────────────────────────
  const addStep = useCallback(() => {
    setSteps((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: '',
        duration: 30,
        instruction: '',
        waterAmount: '',
      },
    ]);
  }, []);

  const removeStep = useCallback((stepId: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== stepId));
  }, []);

  const updateStep = useCallback(
    (stepId: string, field: keyof StepFormData, value: string | number) => {
      setSteps((prev) =>
        prev.map((s) => (s.id === stepId ? { ...s, [field]: value } : s)),
      );
    },
    [],
  );

  const moveStep = useCallback((index: number, direction: 'up' | 'down') => {
    setSteps((prev) => {
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const a = next[index]!;
      const b = next[target]!;
      next[index] = b;
      next[target] = a;
      return next;
    });
  }, []);

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    const coffeeVal = Number(coffeeGrams);
    if (!coffeeGrams || Number.isNaN(coffeeVal) || coffeeVal <= 0) {
      newErrors.coffeeGrams = 'Debe ser un número positivo';
    }

    const waterVal = Number(waterGrams);
    if (!waterGrams || Number.isNaN(waterVal) || waterVal <= 0) {
      newErrors.waterGrams = 'Debe ser un número positivo';
    }

    const tempVal = Number(temperature);
    if (!temperature || Number.isNaN(tempVal) || tempVal <= 0) {
      newErrors.temperature = 'Debe ser un número positivo';
    }

    if (!grindSize.trim()) {
      newErrors.grindSize = 'La molienda es obligatoria';
    }

    if (steps.length === 0) {
      newErrors.steps = 'Agregá al menos un paso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, coffeeGrams, waterGrams, temperature, grindSize, steps.length]);

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const coffeeG = Number(coffeeGrams);
      const waterG = Number(waterGrams);
      const ratio = Math.round((waterG / coffeeG) * 10) / 10;
      const temp = Number(temperature);

      const brewSteps: BrewStep[] = steps.map((s, idx) => ({
        id: s.id,
        order: idx,
        title: s.title,
        duration: s.duration,
        instruction: s.instruction,
        waterAmount: s.waterAmount ? Number(s.waterAmount) : undefined,
        action: 'wait' as const,
      }));

      if (isEditMode && existingRecipe) {
        const updatedRecipe: Recipe = {
          ...existingRecipe,
          name: name.trim(),
          method,
          author: author.trim() || undefined,
          coffeeGrams: coffeeG,
          waterGrams: waterG,
          ratio,
          temperature: temp,
          grindSize: grindSize.trim(),
          description: description.trim() || undefined,
          steps: brewSteps,
        };
        await updateRecipe(updatedRecipe);
      } else {
        await addRecipe({
          name: name.trim(),
          method,
          author: author.trim() || undefined,
          coffeeGrams: coffeeG,
          waterGrams: waterG,
          ratio,
          temperature: temp,
          grindSize: grindSize.trim(),
          description: description.trim() || undefined,
          steps: brewSteps,
          isBuiltIn: false,
          createdAt: Date.now(),
        });
      }

      navigate(`/recipes/${method}`);
    } catch (err) {
      console.error('Error al guardar la receta:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && existingRecipe) {
      navigate(`/recipes/${existingRecipe.method}/${id}`);
    } else if (method) {
      navigate(`/recipes/${method}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="p-4 pb-8">
      <h1 className="text-2xl font-bold text-coffee-text mb-6">
        {isEditMode ? 'Editar receta' : 'Nueva receta'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ── Nombre ──────────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="recipe-name"
            className="block text-sm font-medium text-coffee-text mb-1"
          >
            Nombre *
          </label>
          <input
            id="recipe-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.name
                ? 'border-red-300 focus:ring-red-200'
                : 'border-coffee-primary-light/20 focus:ring-coffee-primary/30'
            } bg-white text-coffee-text focus:outline-none focus:ring-2 transition-colors`}
            placeholder="Ej: V60 de James Hoffmann"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* ── Método ──────────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="recipe-method"
            className="block text-sm font-medium text-coffee-text mb-1"
          >
            Método *
          </label>
          <select
            id="recipe-method"
            value={method}
            onChange={(e) => setMethod(e.target.value as BrewMethod)}
            disabled={isEditMode}
            className="w-full px-4 py-2.5 rounded-xl border border-coffee-primary-light/20 bg-white text-coffee-text focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {METHOD_LABELS[m]}
              </option>
            ))}
          </select>
        </div>

        {/* ── Autor ───────────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="recipe-author"
            className="block text-sm font-medium text-coffee-text mb-1"
          >
            Autor
          </label>
          <input
            id="recipe-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-coffee-primary-light/20 bg-white text-coffee-text focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 transition-colors"
            placeholder="Opcional"
          />
        </div>

        {/* ── Gramos café ─────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="recipe-coffee"
            className="block text-sm font-medium text-coffee-text mb-1"
          >
            Gramos de café *
          </label>
          <input
            id="recipe-coffee"
            type="number"
            value={coffeeGrams}
            onChange={(e) => setCoffeeGrams(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.coffeeGrams
                ? 'border-red-300 focus:ring-red-200'
                : 'border-coffee-primary-light/20 focus:ring-coffee-primary/30'
            } bg-white text-coffee-text focus:outline-none focus:ring-2 transition-colors`}
            placeholder="Ej: 15"
            min="0.1"
            step="0.1"
          />
          {errors.coffeeGrams && (
            <p className="text-red-500 text-xs mt-1">{errors.coffeeGrams}</p>
          )}
        </div>

        {/* ── Gramos agua ─────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="recipe-water"
            className="block text-sm font-medium text-coffee-text mb-1"
          >
            Gramos de agua *
          </label>
          <input
            id="recipe-water"
            type="number"
            value={waterGrams}
            onChange={(e) => setWaterGrams(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.waterGrams
                ? 'border-red-300 focus:ring-red-200'
                : 'border-coffee-primary-light/20 focus:ring-coffee-primary/30'
            } bg-white text-coffee-text focus:outline-none focus:ring-2 transition-colors`}
            placeholder="Ej: 250"
            min="0.1"
            step="0.1"
          />
          {errors.waterGrams && (
            <p className="text-red-500 text-xs mt-1">{errors.waterGrams}</p>
          )}
        </div>

        {/* ── Temperatura ─────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="recipe-temp"
            className="block text-sm font-medium text-coffee-text mb-1"
          >
            Temperatura (°C) *
          </label>
          <input
            id="recipe-temp"
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.temperature
                ? 'border-red-300 focus:ring-red-200'
                : 'border-coffee-primary-light/20 focus:ring-coffee-primary/30'
            } bg-white text-coffee-text focus:outline-none focus:ring-2 transition-colors`}
            placeholder="Ej: 98"
            min="1"
            max="100"
          />
          {errors.temperature && (
            <p className="text-red-500 text-xs mt-1">{errors.temperature}</p>
          )}
        </div>

        {/* ── Molienda ────────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="recipe-grind"
            className="block text-sm font-medium text-coffee-text mb-1"
          >
            Molienda *
          </label>
          <input
            id="recipe-grind"
            type="text"
            value={grindSize}
            onChange={(e) => setGrindSize(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.grindSize
                ? 'border-red-300 focus:ring-red-200'
                : 'border-coffee-primary-light/20 focus:ring-coffee-primary/30'
            } bg-white text-coffee-text focus:outline-none focus:ring-2 transition-colors`}
            placeholder="ej: medio-fino"
          />
          {errors.grindSize && (
            <p className="text-red-500 text-xs mt-1">{errors.grindSize}</p>
          )}
        </div>

        {/* ── Descripción ─────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="recipe-desc"
            className="block text-sm font-medium text-coffee-text mb-1"
          >
            Descripción
          </label>
          <textarea
            id="recipe-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-coffee-primary-light/20 bg-white text-coffee-text focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 transition-colors resize-none"
            placeholder="Opcional: describí tu receta..."
          />
        </div>

        {/* ── Pasos ───────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-coffee-text">Pasos *</span>
            <button
              type="button"
              onClick={addStep}
              className="text-sm text-coffee-primary font-medium hover:text-coffee-primary-light transition-colors cursor-pointer"
            >
              + Agregar paso
            </button>
          </div>

          {errors.steps && (
            <p className="text-red-500 text-xs mb-2">{errors.steps}</p>
          )}

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-coffee-primary-light/10"
              >
                {/* Step header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-coffee-muted">
                    Paso {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveStep(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-coffee-muted hover:text-coffee-text disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Mover arriba"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStep(index, 'down')}
                      disabled={index === steps.length - 1}
                      className="p-1 text-coffee-muted hover:text-coffee-text disabled:opacity-30 transition-colors cursor-pointer"
                      aria-label="Mover abajo"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      aria-label="Eliminar paso"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Step fields */}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) =>
                      updateStep(step.id, 'title', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg border border-coffee-primary-light/20 bg-white text-coffee-text text-sm focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 transition-colors"
                    placeholder="Título del paso"
                  />

                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-coffee-muted mb-1">
                        Duración (seg)
                      </label>
                      <input
                        type="number"
                        value={step.duration}
                        onChange={(e) =>
                          updateStep(
                            step.id,
                            'duration',
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-3 py-2 rounded-lg border border-coffee-primary-light/20 bg-white text-coffee-text text-sm focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 transition-colors"
                        min="1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-coffee-muted mb-1">
                        Agua (g, opc)
                      </label>
                      <input
                        type="number"
                        value={step.waterAmount}
                        onChange={(e) =>
                          updateStep(step.id, 'waterAmount', e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border border-coffee-primary-light/20 bg-white text-coffee-text text-sm focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 transition-colors"
                        min="0"
                        placeholder="Opcional"
                      />
                    </div>
                  </div>

                  <textarea
                    value={step.instruction}
                    onChange={(e) =>
                      updateStep(step.id, 'instruction', e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-coffee-primary-light/20 bg-white text-coffee-text text-sm focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 transition-colors resize-none"
                    placeholder="Instrucción del paso"
                  />
                </div>
              </div>
            ))}
          </div>

          {steps.length === 0 && (
            <div className="text-center py-8 bg-white rounded-xl border border-dashed border-coffee-primary-light/30">
              <p className="text-sm text-coffee-muted">No hay pasos todavía</p>
              <button
                type="button"
                onClick={addStep}
                className="mt-2 text-sm text-coffee-primary font-medium hover:text-coffee-primary-light transition-colors cursor-pointer"
              >
                + Agregar el primer paso
              </button>
            </div>
          )}
        </div>

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-coffee-primary text-white py-3 rounded-xl font-semibold text-base
                       shadow-sm hover:bg-coffee-primary-light transition-colors active:scale-[0.98]
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? 'Guardando...' : 'Guardar receta'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 rounded-xl font-medium text-sm border border-coffee-primary-light/30
                       text-coffee-text hover:bg-coffee-bg transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
