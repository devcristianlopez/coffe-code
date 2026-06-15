import { useNavigate, useParams } from 'react-router-dom';
import { useRecipesStore } from '../hooks/useRecipes';
import { METHOD_LABELS } from '../types';
import type { BrewMethod } from '../types';
import RecipeTimerSummary from '../components/RecipeTimerSummary';

export default function RecipeDetailPage() {
  const { method: methodParam, id } = useParams<{
    method: string;
    id: string;
  }>();
  const navigate = useNavigate();
  const recipes = useRecipesStore((state) => state.recipes);
  const deleteRecipe = useRecipesStore((state) => state.deleteRecipe);

  const method = methodParam as BrewMethod;
  const recipe = id ? recipes.find((r) => r.id === id) : undefined;
  const methodLabel = METHOD_LABELS[method];

  if (!recipe || !methodLabel) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-coffee-text">
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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      '¿Estás segura de eliminar esta receta? Esta acción no se puede deshacer.',
    );
    if (!confirmed) return;

    try {
      await deleteRecipe(recipe.id);
      navigate(`/recipes/${method}`);
    } catch (err) {
      console.error('Error al eliminar la receta:', err);
    }
  };

  return (
    <div className="p-4 pb-8">
      {/* Back button */}
      <button
        onClick={() => navigate(`/recipes/${method}`)}
        className="text-coffee-muted text-sm mb-4 flex items-center gap-1 hover:text-coffee-text transition-colors cursor-pointer"
      >
        ← Volver a {methodLabel}
      </button>

      {/* Title section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-coffee-text">{recipe.name}</h1>
          {recipe.isBuiltIn && (
            <span className="text-xs bg-coffee-primary/10 text-coffee-primary px-2 py-0.5 rounded-full font-medium">
              Precargada
            </span>
          )}
        </div>
        {recipe.author && (
          <p className="text-sm text-coffee-muted">por {recipe.author}</p>
        )}
      </div>

      {/* Info cards grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-coffee-primary-light/10">
          <p className="text-xs text-coffee-muted">Café</p>
          <p className="font-semibold text-coffee-text mt-0.5">
            {recipe.coffeeGrams}g
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-coffee-primary-light/10">
          <p className="text-xs text-coffee-muted">Agua</p>
          <p className="font-semibold text-coffee-text mt-0.5">
            {recipe.waterGrams}g
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-coffee-primary-light/10">
          <p className="text-xs text-coffee-muted">Ratio</p>
          <p className="font-semibold text-coffee-text mt-0.5">
            1:{recipe.ratio}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-coffee-primary-light/10">
          <p className="text-xs text-coffee-muted">Temperatura</p>
          <p className="font-semibold text-coffee-text mt-0.5">
            {recipe.temperature}°C
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-coffee-primary-light/10">
          <p className="text-xs text-coffee-muted">Molienda</p>
          <p className="font-semibold text-coffee-text text-sm mt-0.5">
            {recipe.grindSize}
          </p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-coffee-primary-light/10">
          <p className="text-xs text-coffee-muted">Tiempo total</p>
          <div className="mt-0.5">
            <RecipeTimerSummary steps={recipe.steps} />
          </div>
        </div>
      </div>

      {/* Description */}
      {recipe.description && (
        <div className="mb-6">
          <p className="text-sm text-coffee-muted leading-relaxed">
            {recipe.description}
          </p>
        </div>
      )}

      {/* Steps section */}
      <div className="mb-6">
        <h2 className="font-semibold text-coffee-text mb-3">Pasos</h2>
        <div className="space-y-3">
          {[...recipe.steps]
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-coffee-primary-light/10"
              >
                <div className="flex items-start gap-3">
                  <span className="bg-coffee-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {step.order + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-coffee-text text-sm">
                        {step.title}
                      </h3>
                      <span className="text-xs text-coffee-muted whitespace-nowrap tabular-nums">
                        {Math.floor(step.duration / 60)}:
                        {String(step.duration % 60).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="text-sm text-coffee-muted mt-1">
                      {step.instruction}
                    </p>
                    {step.waterAmount !== undefined && (
                      <p className="text-xs text-coffee-primary mt-1">
                        💧 {step.waterAmount}g
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate(`/brew/${recipe.id}`)}
          className="flex-1 bg-coffee-primary text-white py-3 rounded-xl font-semibold text-base
                     shadow-sm hover:bg-coffee-primary-light transition-colors active:scale-[0.98]
                     cursor-pointer"
        >
          ☕ Preparar
        </button>
        {!recipe.isBuiltIn && (
          <>
            <button
              onClick={() =>
                navigate(`/recipes/${method}/${recipe.id}/edit`)
              }
              className="px-4 py-3 rounded-xl font-medium text-sm border border-coffee-primary-light/30
                         text-coffee-text hover:bg-coffee-bg transition-colors cursor-pointer"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-3 rounded-xl font-medium text-sm border border-red-200
                         text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            >
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
