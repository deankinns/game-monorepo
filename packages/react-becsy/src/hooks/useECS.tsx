import {useCallback, useMemo, useEffect, useState} from "react";

import {ECS} from "../components/ECS";
import {Entity, System, World} from "@lastolivegames/becsy";

import {useFrame} from "@react-three/fiber";

import {create} from 'zustand';
import {devtools} from "zustand/middleware";

// interface i {
//     foo: string;
// }
//
// const foo  = create<i>()(devtools((set, get) => ({
//     foo: 'bar',
//     setFoo: (foo: string) => set({foo}),
// })))

interface EcsState {
    ecs: ECS,
    // systems: System[],
    entities: Entity[],
    count: number,
    selectedEntity: Entity | null,
    create:  (systems: any[], cb?: (world: World) => void) => any,
    update: (time: number, delta: number) => void,
    addEntity: (entity: Entity) => void,
    removeEntity: (entity: Entity) => void,
    // addSystem: (system: System) => void,

    selectEntity: (entity: Entity|null) => void,
}
let loaded = false;
export const useEcsStore = create<EcsState>()(devtools((set, get) => ({
    ecs: new ECS(),
    // systems: [],
    entities: [],
    count: 0,
    selectedEntity: null,
    create: async (systems: any[], cb?: (world: World) => void) => {
        const ecs = get().ecs
        if (!loaded) {
            loaded = true;
            await ecs.init(systems, cb);
            if (typeof window !== 'undefined') {
                (window as any).ecs = ecs;
                (window as any).BECSY = ecs.world;
            }
            //@ts-ignore
            // set({systems: ecs.world.__dispatcher.systemsByClass.values()})
        }
    },
    update: async (time?: number, delta?: number) => {
        await get().ecs.update(time, delta);
        // set({count: time});
    },
    addEntity: () => {
        set({count: get().count + 1});
        // set((state) => ({entities: [...state.entities, entity]}));
    },
    removeEntity: () => {
        set({count: get().count - 1});
        // set((state) => ({entities: state.entities.filter((e: Entity) => e.__id !== entity.__id)}));
    },
    // addSystem: (system: System) => {
    //     set((state) => ({ systems: [...state.systems, system]}));
    // },
    selectEntity: (entity: Entity|null) => {
        if (entity === get().selectedEntity) return
        set({
            selectedEntity: entity
        });
    }
})))

export const useSystem = (systemType: any) => {
    // const systems = useEcsStore(state => state.systems);

    const world = useEcsStore(state => state.ecs.world);
    // const world = ecs.world;
    // const count = useEcsStore(state => state.count);

    // const systems = useEcsStore(state => state.systems);

    //@ts-ignore
    // const s = ecs.world?.__dispatcher.systemsByClass.get(systemType);
    //@ts-ignore
    return useMemo(() => world?.__dispatcher.systemsByClass.get(systemType).system, [systemType, world])
    // return ecs.world?.__dispatcher.systemsByClass.get(systemType).system

    // return useMemo(() => {
    //     return systems.find((system: System) => system instanceof systemType);
    // }, [systemType, systems]);
}


// @ts-ignore
export const useSystemEntities = ({systemType, query}) => {

    // @ts-ignore
    const system = useSystem(systemType) as systemType;
    const [items, setItems] = useState(new Set<Entity>());

    const addItems = (e: Entity[]) => {
        // @ts-ignore
        setItems((prev) => {
            const newSet = new Set(e);
            return newSet;
            // const newSet = new Set(prev);
            // // newSet.add(e)
            // e.forEach((e: Entity) => newSet.add(e));
            // return newSet;
        });
    }

    const removeItems = (e: Entity[]) => {
        // @ts-ignore
        setItems((prev) => {
            const newSet = new Set(prev);
            // newSet.delete(e);
            e.forEach((e: Entity) => newSet.delete(e));
            return newSet;
        });
    }

    useFrame(() => {
        // system[query].added.forEach((e: Entity) => addItem(e))
        // system[query].removed.forEach((e: Entity) => removeItem(e))
        // if (system[query].added.length > 0) {
        //     addItems(system[query].added);
        // }
        // if (system[query].removed.length > 0) {
        //     removeItems(system[query].removed);
        // }
        if (items.size !== system[query].current.length) {
            setItems(new Set(system[query].current.map((e: Entity) => e.hold())));
        }

    })

    return useMemo(() => items, [items]);
}

export const useEntityById = (id: number) => {
    const [ecs ] = useEcsStore(state => [state.ecs]);

    return useMemo(() => {
        // @ts-ignore
        return ecs.world?.__dispatcher.singleton.__registry.heldEntities[id];
    }, [id, ecs])
}