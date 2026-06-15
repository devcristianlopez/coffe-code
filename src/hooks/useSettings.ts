import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { BrewMethod } from '../types';

export type UnitSystem = 'grams' | 'ounces';
export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface Settings {
  unit: UnitSystem;
  temperatureUnit: TemperatureUnit;
  soundEnabled: boolean;
  soundVolume: number;
  defaultTemps: Record<BrewMethod, number>;
  defaultRatios: Record<BrewMethod, number>;
  version: string;
}

interface SettingsActions {
  setUnit: (unit: UnitSystem) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setDefaultTemp: (method: BrewMethod, temp: number) => void;
  setDefaultRatio: (method: BrewMethod, ratio: number) => void;
  resetSettings: () => void;
}

export type SettingsState = Settings & SettingsActions;

const DEFAULT_SETTINGS: Settings = {
  unit: 'grams',
  temperatureUnit: 'celsius',
  soundEnabled: true,
  soundVolume: 80,
  defaultTemps: {
    v60: 96,
    chemex: 96,
    'french-press': 96,
    moka: 100,
    aeropress: 85,
    espresso: 93,
  },
  defaultRatios: {
    v60: 16.7,
    chemex: 16.7,
    'french-press': 16.7,
    moka: 10,
    aeropress: 14.3,
    espresso: 2,
  },
  version: '1.0.0',
};

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        ...DEFAULT_SETTINGS,

        setUnit: (unit: UnitSystem) => set({ unit }),

        setTemperatureUnit: (temperatureUnit: TemperatureUnit) =>
          set({ temperatureUnit }),

        setSoundEnabled: (soundEnabled: boolean) => set({ soundEnabled }),

        setSoundVolume: (soundVolume: number) =>
          set({ soundVolume: Math.max(0, Math.min(100, soundVolume)) }),

        setDefaultTemp: (method: BrewMethod, temp: number) =>
          set((state) => ({
            defaultTemps: { ...state.defaultTemps, [method]: temp },
          })),

        setDefaultRatio: (method: BrewMethod, ratio: number) =>
          set((state) => ({
            defaultRatios: { ...state.defaultRatios, [method]: ratio },
          })),

        resetSettings: () => set(DEFAULT_SETTINGS),
      }),
      {
        name: 'coffee-settings',
      },
    ),
    { name: 'settings-store' },
  ),
);
