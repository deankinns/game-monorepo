import {useMemo,} from "react";

import {ECS} from "../components/ECS";
import {Entity, System, World} from "@lastolivegames/becsy";

import create from 'zustand';

// export const useECS = (systems: any[], cb?: (world: World) => void) => {
//     const [ecs] = useState(() => {
//         return new ECS();
//     });
//
//     useEffect(() => {
//         if (!ecs.world) {
//             ecs.init(systems, cb);
//         }
//         if (typeof window !== 'undefined') {
//             (window as any).ecs = ecs;
//         }
//     })
//
//     return ecs;
// }

interface EcsState {
    ecs: ECS,
    systems: System[],
    entities: Entity[],
    create:  (systems: any[], cb?: (world: World) => void) => any,
    update: (time: number, delta: number) => void,
    setEntities: (entities: Entity[]) => void,
    addSystem: (system: System) => void,
}

export const useEcsStore = create<EcsState>((set, get) => ({
    ecs: new ECS(),
    systems: [],
    entities: [],
    create: async (systems: any[], cb?: (world: World) => void) => {
        const ecs = get().ecs
        if (!ecs.world) {
            await ecs.init(systems, cb);
            if (typeof window !== 'undefined') {
                (window as any).ecs = ecs;
            }
        }
    },
    update: async (time: number, delta: number) => {
        get().ecs.update(time, delta);
    },
    setEntities: (entities: Entity[]) => {
        set({entities});
    },
    addSystem: (system: System) => {
        set({
            systems: [
                ...get().systems,
                system
            ]
        });
    }
}))

export const useSystem = (systemType: any) => {
    const ecsStore = useEcsStore();

    return useMemo(() => {
        return ecsStore.systems.find((system: System) => system instanceof systemType);
    }, [ecsStore.systems, systemType]);
}

//
// const useStore = create((set) => ({
//     ecs: new ECS()
// }));
//
// export const useECS = () => useStore((state: any) =>  state.ecs);