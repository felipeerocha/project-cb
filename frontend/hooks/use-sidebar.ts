import { create } from "zustand";

interface SidebarStore {
  isExpanded: boolean;
  toggle: () => void;
}

export const useSidebar = create<SidebarStore>((set) => ({
  isExpanded: true,
  toggle: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));
