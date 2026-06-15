import { useState, useRef, type ChangeEvent } from 'react';
import { useSettingsStore } from '../hooks/useSettings';
import type { BrewMethod } from '../types';
import { db } from '../db';
import { METHOD_LABELS } from '../types';

const BREW_METHODS: BrewMethod[] = [
  'v60',
  'chemex',
  'french-press',
  'moka',
  'aeropress',
  'espresso',
];

export default function SettingsPage() {
  const settings = useSettingsStore();
  const [defaultsOpen, setDefaultsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const recipes = await db.recipes.toArray();
      const brewLogs = await db.brewLogs.toArray();
      const exportData = {
        exportedAt: Date.now(),
        version: settings.version,
        recipes,
        brewLogs,
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coffee-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus(null);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.recipes || !Array.isArray(data.recipes)) {
        setImportStatus('error: El archivo no contiene datos válidos de recetas.');
        return;
      }

      await db.transaction('rw', db.recipes, db.brewLogs, async () => {
        if (data.recipes.length > 0) {
          await db.recipes.clear();
          await db.recipes.bulkAdd(data.recipes);
        }
        if (data.brewLogs && data.brewLogs.length > 0) {
          await db.brewLogs.clear();
          await db.brewLogs.bulkAdd(data.brewLogs);
        }
      });

      setImportStatus(`success: Importados ${data.recipes.length} recetas y ${data.brewLogs?.length ?? 0} registros. Recarga la página para ver los cambios.`);
    } catch (error) {
      console.error('Error importing data:', error);
      setImportStatus('error: No se pudo importar el archivo. Verifica que sea un JSON válido.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAll = async () => {
    try {
      await db.transaction('rw', db.recipes, db.brewLogs, async () => {
        await db.recipes.clear();
        await db.brewLogs.clear();
      });
      setConfirmDelete(false);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-coffee-text">Configuración</h1>

      {/* ── General ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl shadow-sm border border-coffee-primary-light/10 p-4 space-y-4">
        <h2 className="text-lg font-semibold text-coffee-text">General</h2>

        <div className="flex items-center justify-between">
          <label className="text-coffee-text" htmlFor="unit-select">
            Unidad de peso
          </label>
          <select
            id="unit-select"
            value={settings.unit}
            onChange={(e) =>
              settings.setUnit(e.target.value as 'grams' | 'ounces')
            }
            className="rounded-lg border border-coffee-primary-light/30 px-3 py-1.5 text-sm text-coffee-text bg-coffee-bg"
          >
            <option value="grams">Gramos</option>
            <option value="ounces">Onzas</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-coffee-text" htmlFor="temp-unit-select">
            Temperatura
          </label>
          <select
            id="temp-unit-select"
            value={settings.temperatureUnit}
            onChange={(e) =>
              settings.setTemperatureUnit(
                e.target.value as 'celsius' | 'fahrenheit',
              )
            }
            className="rounded-lg border border-coffee-primary-light/30 px-3 py-1.5 text-sm text-coffee-text bg-coffee-bg"
          >
            <option value="celsius">°C</option>
            <option value="fahrenheit">°F</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-coffee-text">Idioma</span>
          <span className="text-sm text-coffee-muted">Español</span>
        </div>
      </section>

      {/* ── Defaults por método ─────────────────────────────────── */}
      <section className="bg-white rounded-xl shadow-sm border border-coffee-primary-light/10 p-4 space-y-4">
        <button
          type="button"
          onClick={() => setDefaultsOpen(!defaultsOpen)}
          className="w-full flex items-center justify-between text-left"
        >
          <h2 className="text-lg font-semibold text-coffee-text">
            Defaults por método
          </h2>
          <span
            className={`text-coffee-muted transition-transform ${defaultsOpen ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </button>

        {defaultsOpen && (
          <div className="space-y-4 pt-2">
            {BREW_METHODS.map((method) => (
              <div
                key={method}
                className="border border-coffee-primary-light/10 rounded-lg p-3 space-y-3"
              >
                <h3 className="font-medium text-coffee-text">
                  {METHOD_LABELS[method]}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label
                      className="block text-xs text-coffee-muted mb-1"
                      htmlFor={`temp-${method}`}
                    >
                      Temperatura (°C)
                    </label>
                    <input
                      id={`temp-${method}`}
                      type="number"
                      value={settings.defaultTemps[method]}
                      onChange={(e) =>
                        settings.setDefaultTemp(
                          method,
                          Number(e.target.value),
                        )
                      }
                      className="w-full rounded-lg border border-coffee-primary-light/30 px-3 py-1.5 text-sm text-coffee-text bg-coffee-bg"
                      min={60}
                      max={100}
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      className="block text-xs text-coffee-muted mb-1"
                      htmlFor={`ratio-${method}`}
                    >
                      Ratio (agua:café)
                    </label>
                    <input
                      id={`ratio-${method}`}
                      type="number"
                      value={settings.defaultRatios[method]}
                      onChange={(e) =>
                        settings.setDefaultRatio(
                          method,
                          Number(e.target.value),
                        )
                      }
                      className="w-full rounded-lg border border-coffee-primary-light/30 px-3 py-1.5 text-sm text-coffee-text bg-coffee-bg"
                      min={1}
                      max={30}
                      step={0.1}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Sonidos ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl shadow-sm border border-coffee-primary-light/10 p-4 space-y-4">
        <h2 className="text-lg font-semibold text-coffee-text">Sonidos</h2>

        <div className="flex items-center justify-between">
          <span className="text-coffee-text">Sonido al cambiar de paso</span>
          <button
            type="button"
            role="switch"
            aria-checked={settings.soundEnabled}
            onClick={() => settings.setSoundEnabled(!settings.soundEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.soundEnabled
                ? 'bg-coffee-primary'
                : 'bg-coffee-muted/30'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-coffee-text" htmlFor="volume-slider">
              Volumen
            </label>
            <span className="text-sm text-coffee-muted">
              {settings.soundVolume}%
            </span>
          </div>
          <input
            id="volume-slider"
            type="range"
            min={0}
            max={100}
            value={settings.soundVolume}
            onChange={(e) =>
              settings.setSoundVolume(Number(e.target.value))
            }
            className="w-full accent-coffee-primary"
          />
        </div>
      </section>

      {/* ── Datos ───────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl shadow-sm border border-coffee-primary-light/10 p-4 space-y-4">
        <h2 className="text-lg font-semibold text-coffee-text">Datos</h2>

        <button
          type="button"
          onClick={handleExport}
          className="w-full rounded-lg bg-coffee-primary text-white px-4 py-2 font-medium hover:bg-coffee-primary-light transition-colors"
        >
          Exportar datos
        </button>

        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-lg border-2 border-coffee-primary/30 text-coffee-primary px-4 py-2 font-medium hover:bg-coffee-primary/5 transition-colors"
          >
            Importar datos
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          {importStatus && (
            <p
              className={`mt-2 text-sm ${
                importStatus.startsWith('success')
                  ? 'text-green-700'
                  : 'text-red-600'
              }`}
            >
              {importStatus.replace(/^(success|error): /, '')}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-coffee-primary-light/10">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full rounded-lg border-2 border-red-400 text-red-600 px-4 py-2 font-medium hover:bg-red-50 transition-colors"
            >
              Borrar todos los datos
            </button>
          ) : (
            <div className="space-y-2 rounded-lg border-2 border-red-400 p-3 bg-red-50">
              <p className="text-sm font-medium text-red-700">
                ¿Estás seguro? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 rounded-lg border border-coffee-primary-light/30 px-4 py-2 text-sm text-coffee-text hover:bg-coffee-bg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAll}
                  className="flex-1 rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Sí, borrar todo
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Acerca de ───────────────────────────────────────────── */}
      <section className="bg-white rounded-xl shadow-sm border border-coffee-primary-light/10 p-4 space-y-2">
        <h2 className="text-lg font-semibold text-coffee-text">Acerca de</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-coffee-muted">Versión</span>
          <span className="text-coffee-text font-medium">
            {settings.version}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-coffee-muted">Repositorio</span>
          <a
            href="https://github.com/anarcha0s/coffe-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-coffee-primary hover:underline font-medium"
          >
            GitHub
          </a>
        </div>
      </section>
    </div>
  );
}
