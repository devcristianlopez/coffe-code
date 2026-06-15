import type { BrewMethod } from '../types';

export function calculateWater(coffeeGrams: number, ratio: number): number {
  return Math.round(coffeeGrams * ratio);
}

export function calculateBloomWater(coffeeGrams: number, method: BrewMethod): number {
  if (method === 'v60') return Math.min(coffeeGrams * 2, 60);
  if (method === 'chemex') return Math.min(coffeeGrams * 2, 100);
  return 0;
}

export function getSuggestedTemperature(method: BrewMethod): number {
  const temps: Record<BrewMethod, number> = {
    v60: 96,
    chemex: 96,
    'french-press': 96,
    moka: 100,
    aeropress: 85,
    espresso: 93,
  };
  return temps[method];
}

export function getEstimatedTime(method: BrewMethod): string {
  const times: Record<BrewMethod, string> = {
    v60: '~3:00',
    chemex: '~4:00',
    'french-press': '~8:00',
    moka: '~5:00',
    aeropress: '~1:30',
    espresso: '~0:30',
  };
  return times[method];
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
