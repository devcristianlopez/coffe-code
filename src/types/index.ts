export type BrewMethod = 'v60' | 'chemex' | 'french-press' | 'moka' | 'aeropress' | 'espresso';

export type StepAction = 'pour' | 'wait' | 'stir' | 'press' | 'serve' | 'bloom';

export interface BrewStep {
  id: string;
  order: number;
  title: string;
  duration: number;
  instruction: string;
  waterAmount?: number;
  temperature?: number;
  action: StepAction;
}

export interface Recipe {
  id: string;
  name: string;
  method: BrewMethod;
  author?: string;
  coffeeGrams: number;
  waterGrams: number;
  ratio: number;
  temperature: number;
  grindSize: string;
  description?: string;
  steps: BrewStep[];
  isBuiltIn: boolean;
  createdAt: number;
}

export interface BrewLog {
  id: string;
  recipeId: string;
  recipeName: string;
  method: BrewMethod;
  date: number;
  rating: number;
  notes: string;
  adjustments?: string;
  completed: boolean;
}

export const METHOD_LABELS: Record<BrewMethod, string> = {
  v60: 'V60',
  chemex: 'Chemex',
  'french-press': 'Prensa Francesa',
  moka: 'Moka',
  aeropress: 'Aeropress',
  espresso: 'Espresso',
};

export const METHOD_ICONS: Record<BrewMethod, string> = {
  v60: '▼',
  chemex: '⏳',
  'french-press': '⬇',
  moka: '⬡',
  aeropress: '↕',
  espresso: '●',
};
