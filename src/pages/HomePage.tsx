import { useNavigate } from 'react-router-dom';
import { useRecipesStore } from '../hooks/useRecipes';
import { METHOD_LABELS, METHOD_ICONS } from '../types';
import type { BrewMethod } from '../types';

const METHODS: BrewMethod[] = [
  'v60',
  'chemex',
  'french-press',
  'moka',
  'aeropress',
  'espresso',
];

export default function HomePage() {
  const navigate = useNavigate();
  const recipes = useRecipesStore((state) => state.recipes);

  return (
    <div className="p-4 pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-coffee-text">Elegí tu método</h1>
        <p className="text-coffee-muted text-sm mt-1">
          Seleccioná un método para empezar
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {METHODS.map((method) => {
          const count = recipes.filter((r) => r.method === method).length;
          return (
            <button
              key={method}
              onClick={() => navigate(`/recipes/${method}`)}
              className="bg-white rounded-xl p-5 shadow-sm border border-coffee-primary-light/10 
                         flex flex-col items-center gap-3 transition-all duration-200 
                         hover:shadow-md hover:border-coffee-primary-light/30 
                         hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              <span className="text-4xl">{METHOD_ICONS[method]}</span>
              <span className="font-semibold text-coffee-text text-sm text-center leading-tight">
                {METHOD_LABELS[method]}
              </span>
              <span className="text-xs text-coffee-muted bg-coffee-bg px-2.5 py-0.5 rounded-full">
                {count} {count === 1 ? 'receta' : 'recetas'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
