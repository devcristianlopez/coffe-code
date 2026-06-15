import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { METHOD_LABELS } from '../types';
import type { BrewMethod } from '../types';
import {
  calculateWater,
  calculateBloomWater,
  getSuggestedTemperature,
  getEstimatedTime,
} from '../lib/calculations';

const METHODS: BrewMethod[] = [
  'v60',
  'chemex',
  'french-press',
  'moka',
  'aeropress',
  'espresso',
];

interface RatioOption {
  label: string;
  value: number;
}

const RATIO_OPTIONS: RatioOption[] = [
  { label: '1:15 (fuerte)', value: 15 },
  { label: '1:16 (medio)', value: 16 },
  { label: '1:16.7 (SCA standard)', value: 16.7 },
  { label: '1:17 (suave)', value: 17 },
  { label: '1:18 (muy suave)', value: 18 },
  { label: 'Custom', value: 0 },
];

export default function CalculatorPage() {
  const navigate = useNavigate();

  const [method, setMethod] = useState<BrewMethod>('v60');
  const [coffeeGrams, setCoffeeGrams] = useState<string>('15');
  const [selectedRatio, setSelectedRatio] = useState<number>(16.7);
  const [customRatio, setCustomRatio] = useState<string>('');

  const ratio = useMemo(() => {
    if (selectedRatio === 0) {
      const parsed = Number(customRatio);
      return parsed > 0 ? parsed : 0;
    }
    return selectedRatio;
  }, [selectedRatio, customRatio]);

  const coffeeNum = useMemo(() => {
    const parsed = Number(coffeeGrams);
    return parsed > 0 ? parsed : 0;
  }, [coffeeGrams]);

  const water = useMemo(() => {
    if (coffeeNum <= 0 || ratio <= 0) return 0;
    return calculateWater(coffeeNum, ratio);
  }, [coffeeNum, ratio]);

  const temperature = useMemo(() => getSuggestedTemperature(method), [method]);
  const bloomWater = useMemo(() => calculateBloomWater(coffeeNum, method), [coffeeNum, method]);
  const estimatedTime = useMemo(() => getEstimatedTime(method), [method]);

  const handleSaveAsRecipe = () => {
    const params = new URLSearchParams({
      method,
      coffeeGrams: String(coffeeNum),
      waterGrams: String(water),
      temperature: String(temperature),
    });
    navigate(`/recipes/new?${params.toString()}`);
  };

  return (
    <div className="p-4 pb-8">
      <h1 className="text-2xl font-bold text-coffee-text mb-6">Calculadora de ratio</h1>

      {/* Method selector */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-coffee-text mb-2">
          Método
        </label>
        <div className="flex flex-wrap gap-2">
          {METHODS.map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                method === m
                  ? 'bg-coffee-primary text-white shadow-sm'
                  : 'bg-white border border-coffee-primary-light/20 text-coffee-text hover:bg-coffee-bg'
              }`}
            >
              {METHOD_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Coffee grams */}
      <div className="mb-5">
        <label
          htmlFor="coffee-grams"
          className="block text-sm font-medium text-coffee-text mb-1"
        >
          Gramos de café
        </label>
        <input
          id="coffee-grams"
          type="number"
          value={coffeeGrams}
          onChange={(e) => setCoffeeGrams(e.target.value)}
          min={1}
          step={0.5}
          className="w-full px-4 py-3 rounded-xl border border-coffee-primary-light/20 bg-white text-coffee-text text-lg focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 transition-colors"
          placeholder="Ej: 15"
        />
      </div>

      {/* Ratio selector */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-coffee-text mb-2">
          Ratio
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {RATIO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedRatio(opt.value)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                selectedRatio === opt.value
                  ? 'bg-coffee-primary text-white shadow-sm'
                  : 'bg-white border border-coffee-primary-light/20 text-coffee-text hover:bg-coffee-bg'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {selectedRatio === 0 && (
          <div>
            <label
              htmlFor="custom-ratio"
              className="block text-xs text-coffee-muted mb-1"
            >
              Ratio personalizado
            </label>
            <input
              id="custom-ratio"
              type="number"
              value={customRatio}
              onChange={(e) => setCustomRatio(e.target.value)}
              min={1}
              step={0.1}
              placeholder="Ej: 15.5"
              className="w-full px-4 py-2.5 rounded-xl border border-coffee-primary-light/20 bg-white text-coffee-text focus:outline-none focus:ring-2 focus:ring-coffee-primary/30 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Results cards */}
      <div className="space-y-3 mb-6">
        {/* Water */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-coffee-primary-light/10 flex items-center gap-4">
          <span className="text-3xl">💧</span>
          <div>
            <p className="text-xs text-coffee-muted uppercase tracking-wide font-medium">
              Agua total
            </p>
            <p className="text-2xl font-bold text-coffee-text tabular-nums">
              {water > 0 ? `${water} g` : '—'}
            </p>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-coffee-primary-light/10 flex items-center gap-4">
          <span className="text-3xl">🌡️</span>
          <div>
            <p className="text-xs text-coffee-muted uppercase tracking-wide font-medium">
              Temperatura sugerida
            </p>
            <p className="text-2xl font-bold text-coffee-text tabular-nums">
              {temperature}°C
            </p>
          </div>
        </div>

        {/* Bloom water */}
        {bloomWater > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-coffee-primary-light/10 flex items-center gap-4">
            <span className="text-3xl">🫧</span>
            <div>
              <p className="text-xs text-coffee-muted uppercase tracking-wide font-medium">
                Agua de bloom
              </p>
              <p className="text-2xl font-bold text-coffee-text tabular-nums">
                {bloomWater} g
              </p>
            </div>
          </div>
        )}

        {/* Estimated time */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-coffee-primary-light/10 flex items-center gap-4">
          <span className="text-3xl">⏱️</span>
          <div>
            <p className="text-xs text-coffee-muted uppercase tracking-wide font-medium">
              Tiempo estimado
            </p>
            <p className="text-2xl font-bold text-coffee-text tabular-nums">
              {estimatedTime}
            </p>
          </div>
        </div>
      </div>

      {/* Save as recipe */}
      <button
        onClick={handleSaveAsRecipe}
        disabled={water <= 0}
        className="w-full bg-coffee-primary text-white py-4 rounded-xl font-semibold text-base shadow-sm hover:bg-coffee-primary-light transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        Guardar como receta
      </button>
    </div>
  );
}
