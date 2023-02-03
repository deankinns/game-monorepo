import {create} from "zustand";

interface EntityStore {
    ids: string[],
    // count: number,
    // setCount: (count: number) => void
    add: (id: string) => void,
    remove: (id: string) => void,
}

export const useEntities = create<EntityStore>((set, get) => ({
    ids: [],
    add: (id: string) => set((state) => ({ids: [...state.ids, id]})),
    remove: (id: string) => set((state) => ({ids: state.ids.filter((i: string) => i !== id)})),
    // count: 0,
    // setCount: (count: number) => set({count})
}));