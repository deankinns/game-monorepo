import {create} from "zustand";

export const useDebug = create<{
    debug: boolean,
    setDebug: (debug: boolean) => void
    toggleDebug: () => void
}>((set, get) => ({
    debug: false,
    setDebug: (debug: boolean) => set({debug}),
    toggleDebug: () => set({debug: !get().debug})
}));