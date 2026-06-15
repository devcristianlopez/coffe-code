import { useState } from 'react';
import { useBrewLogStore } from '../hooks/useBrewHistory';
import type { BrewMethod } from '../types';

interface TastingNotesFormProps {
  recipeId: string;
  recipeName: string;
  method: BrewMethod;
  onSave: () => void;
  onSkip: () => void;
}

export default function TastingNotesForm({
  recipeId,
  recipeName,
  method,
  onSave,
  onSkip,
}: TastingNotesFormProps) {
  const addLog = useBrewLogStore((s) => s.addLog);

  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [adjustments, setAdjustments] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (rating === 0) {
      setError('Seleccioná un rating');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await addLog({
        recipeId,
        recipeName,
        method,
        date: Date.now(),
        rating,
        notes,
        adjustments: adjustments || undefined,
        completed: true,
      });
      onSave();
    } catch (err) {
      console.error('Error al guardar notas:', err);
      setError('Ocurrió un error al guardar. Intentalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-8">
      <span className="text-6xl mb-4">☕</span>
      <h2 className="text-2xl font-bold text-coffee-text text-center mb-2">
        ¡Café listo!
      </h2>
      <p className="text-coffee-muted text-center mb-6">
        Agregá tus notas de cata
      </p>

      {/* Rating stars */}
      <div className="flex gap-2 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => {
              setRating(star);
              setError('');
            }}
            className={`text-3xl transition-transform hover:scale-110 active:scale-90 cursor-pointer ${
              star <= rating ? 'scale-110' : 'opacity-40'
            }`}
            aria-label={`${star} estrella${star !== 1 ? 's' : ''}`}
          >
            {star <= rating ? '⭐' : '✩'}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      {/* Tasting notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Ej: afrutado, chocolate, cuerpo medio, acidez brillante..."
        className="w-full max-w-md bg-white rounded-xl border border-coffee-primary-light/20 p-3 text-sm text-coffee-text placeholder:text-coffee-muted/50 resize-none h-24 mb-4"
      />

      {/* Adjustments */}
      <input
        value={adjustments}
        onChange={(e) => setAdjustments(e.target.value)}
        placeholder="Ej: usé 2 clicks más fino, 2°C más..."
        className="w-full max-w-md bg-white rounded-xl border border-coffee-primary-light/20 p-3 text-sm text-coffee-text placeholder:text-coffee-muted/50 mb-6"
      />

      {/* Buttons */}
      <div className="flex gap-3 w-full max-w-md">
        <button
          onClick={onSkip}
          disabled={saving}
          className="flex-1 py-3 rounded-xl font-medium text-sm border border-coffee-primary-light/30 text-coffee-text hover:bg-coffee-bg transition-colors disabled:opacity-40 cursor-pointer"
        >
          Omitir
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 bg-coffee-primary text-white py-3 rounded-xl font-semibold text-base shadow-sm hover:bg-coffee-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}
