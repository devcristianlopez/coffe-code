import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { db } from '../db';
import type { BrewLog, BrewMethod } from '../types';

interface BrewLogState {
  logs: BrewLog[];
  loadLogs: () => Promise<void>;
  addLog: (log: Omit<BrewLog, 'id'>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  getLogsByMethod: (method: BrewMethod) => BrewLog[];
}

export const useBrewLogStore = create<BrewLogState>()(
  devtools(
    (set, get) => ({
      logs: [],

      loadLogs: async () => {
        const stored = await db.brewLogs.toArray();
        set({ logs: stored });
      },

      addLog: async (logData: Omit<BrewLog, 'id'>) => {
        const log: BrewLog = {
          ...logData,
          id: crypto.randomUUID(),
        };
        await db.brewLogs.add(log);
        set((state) => ({ logs: [...state.logs, log] }));
      },

      deleteLog: async (id: string) => {
        await db.brewLogs.delete(id);
        set((state) => ({
          logs: state.logs.filter((l) => l.id !== id),
        }));
      },

      getLogsByMethod: (method: BrewMethod): BrewLog[] => {
        return get().logs.filter((l) => l.method === method);
      },
    }),
    { name: 'brew-log-store' },
  ),
);

// Auto-load brew logs on store initialization
useBrewLogStore.getState().loadLogs();
