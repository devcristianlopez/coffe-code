import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { db } from '../db';
import type { Recipe, BrewMethod } from '../types';
import { SEED_RECIPES } from '../data/recipes';

interface RecipesState {
  recipes: Recipe[];
  loadRecipes: () => Promise<void>;
  getRecipe: (id: string) => Recipe | undefined;
  getRecipesByMethod: (method: BrewMethod) => Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => Promise<void>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
}

export const useRecipesStore = create<RecipesState>()(
  devtools(
    (set, get) => ({
      recipes: [],

      loadRecipes: async () => {
        const stored = await db.recipes.toArray();
        if (stored.length === 0) {
          await db.recipes.bulkAdd(SEED_RECIPES);
          set({ recipes: SEED_RECIPES });
        } else {
          set({ recipes: stored });
        }
      },

      getRecipe: (id: string): Recipe | undefined => {
        return get().recipes.find((r) => r.id === id);
      },

      getRecipesByMethod: (method: BrewMethod): Recipe[] => {
        return get().recipes.filter((r) => r.method === method);
      },

      addRecipe: async (recipeData: Omit<Recipe, 'id'>) => {
        const recipe: Recipe = {
          ...recipeData,
          id: crypto.randomUUID(),
        };
        await db.recipes.add(recipe);
        set((state) => ({ recipes: [...state.recipes, recipe] }));
      },

      updateRecipe: async (recipe: Recipe) => {
        await db.recipes.put(recipe);
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === recipe.id ? recipe : r,
          ),
        }));
      },

      deleteRecipe: async (id: string) => {
        await db.recipes.delete(id);
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== id),
        }));
      },
    }),
    { name: 'recipes-store' },
  ),
);

// Auto-load recipes on store initialization
useRecipesStore.getState().loadRecipes();
