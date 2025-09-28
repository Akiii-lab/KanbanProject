import { create } from "zustand";

interface GlobalStore {
    globalLoading: boolean;
    globalText: string | null;
    setGlobalLoading: (value: boolean) => void;
    setGlobalText: (value: string | null) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
    globalLoading: false,
    setGlobalLoading: (value: boolean) => set({ globalLoading: value }),
    globalText: null,
    setGlobalText: (value: string | null) => set({ globalText: value }),
    
}));
