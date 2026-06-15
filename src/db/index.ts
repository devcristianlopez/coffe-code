import Dexie, { type EntityTable } from 'dexie';
import type { Recipe, BrewLog } from '../types';

const db = new Dexie('CoffeCodeDB') as Dexie & {
  recipes: EntityTable<Recipe, 'id'>;
  brewLogs: EntityTable<BrewLog, 'id'>;
};

db.version(1).stores({
  recipes: 'id, name, method, isBuiltIn, createdAt',
  brewLogs: 'id, recipeId, method, date',
});

export { db };
