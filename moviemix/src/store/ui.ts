import { create } from 'zustand';

type UIState = {
  activeTab: string;
  filterSheetOpen: boolean;
  setActiveTab: (tab: string) => void;
  openFilterSheet: () => void;
  closeFilterSheet: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'Home',
  filterSheetOpen: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  openFilterSheet: () => set({ filterSheetOpen: true }),
  closeFilterSheet: () => set({ filterSheetOpen: false }),
}));
