import {create} from "zustand";

interface ToolbarState {
    children: any;
    setToolbarButtons: (children: any) => void;
}

export const useToolbar = create<ToolbarState>((set) => ({
    children: [],
    setToolbarButtons: (children: any) => set({children}),
}));