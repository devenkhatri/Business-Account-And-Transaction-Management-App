import { create } from 'zustand';

interface LocationStore {
  selectedLocationId: number | null;
  setSelectedLocationId: (id: number | null) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  selectedLocationId: null,
  setSelectedLocationId: (id) => set({ selectedLocationId: id }),
}));