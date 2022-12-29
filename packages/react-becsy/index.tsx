import {World} from "@lastolivegames/becsy";

export * from './src/components/Entity';
export * from './src/components/ECS';
export * from './src/hooks/useECS';
export * from './src/hooks/useEntity';
export * from './ECS/components/RefComponent';

import create from 'zustand';

export const useECSStore = create((set) => ({
    ecs: null,

    create: async (options:any) => {
        const ecs = await World.create(options);

        set({ecs});
    }
}));