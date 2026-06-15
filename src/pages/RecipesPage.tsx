import { useNavigate, useParams } from 'react-router-dom';
import { useRecipesStore } from '../hooks/useRecipes';
import { METHOD_LABELS } from '../types';
import type { BrewMethod } from '../types';
import RecipeTimerSummary from '../components/RecipeTimerSummary';

export default function RecipesPage() {
  const { method: methodParam } = useParams<{ method: string }>();
  const navigate = useNavigate();
  const recipes = useRecipesStore((state) => state.recipes);

  if (!methodParam) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-coffee-text">Método no válido</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-coffee-primary underline text-sm"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const method = methodParam as BrewMethod;
  const methodLabel = METHOD_LABELS[method];
  const methodRecipes = recipes.filter((r) => r.method === method);

  if (!methodLabel) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-coffee-text">Método no válido</h1>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-coffee-primary underline text-sm"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-coffee-text">{methodLabel}</h1>
          <p className="text-coffee-muted text-sm">
            {methodRecipes.length}{' '}
            {methodRecipes.length === 1 ? 'receta' : 'recetas'}
          </p>
        </div>
        <button
          onClick={() => navigate(`/recipes/new?method=${method}`)}
          className="bg-coffee-primary text-white px-4 py-2 rounded-xl text-sm font-semibold
                     shadow-sm hover:bg-coffee-primary-light transition-colors active:scale-95
                     cursor-pointer"
        >
          Nueva receta +
        </button>
      </div>

      {/* Recipe list */}
      {methodRecipes.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-coffee-muted">No hay recetas para este método.</p>
          <p className="text-coffee-muted">¡Creá la primera!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methodRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-coffee-primary-light/10"
            >
              {/* Title & badge row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-coffee-text truncate">
                      {recipe.name}
                    </h3>
                    {recipe.isBuiltIn && (
                      <span className="text-[10px] bg-coffee-primary/10 text-coffee-primary px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Precargada
                      </span>
                    )}
                  </div>
                  {recipe.author && (
                    <p className="text-xs text-coffee-muted mt-0.5">
                      por {recipe.author}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick info grid */}
              <div className="grid grid-cols-2 gap-2 text-xs text-coffee-muted mb-3">
                <span>
                  ☕ {recipe.coffeeGrams}g → {recipe.waterGrams}g
                </span>
                <span>📏 1:{recipe.ratio}</span>
                <span>🌡️ {recipe.temperature}°C</span>
                <span>⚙️ {recipe.grindSize}</span>
              </div>

              {/* Timer summary & actions */}
              <div className="flex items-center justify-between">
                <RecipeTimerSummary steps={recipe.steps} />
                <div className="flex items-center gap-1">
                  {!recipe.isBuiltIn && (
                    <button
                      onClick={() =>
                        navigate(`/recipes/${method}/${recipe.id}/edit`)
                      }
                      className="text-coffee-muted text-sm px-2 py-1 rounded-lg
                                 hover:bg-coffee-bg transition-colors cursor-pointer"
                      aria-label="Editar receta"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/brew/${recipe.id}`)}
                    className="bg-coffee-primary text-white text-sm px-3 py-1.5 rounded-lg font-medium
                               hover:bg-coffee-primary-light transition-colors active:scale-95
                               cursor-pointer"
                  >
                    Preparar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
