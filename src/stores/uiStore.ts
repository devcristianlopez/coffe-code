import { create } from 'zustand';

interface UIState {
  isHandsFree: boolean;
  setHandsFree: (value: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isHandsFree: false,
  setHandsFree: (value: boolean) => set({ isHandsFree: value }),
}));
