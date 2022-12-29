import React, {
    createContext,
    ProviderProps,
} from "react";
import {World, System, Entity} from "@lastolivegames/becsy";

import {EventSystem} from "becsy-package";

// import { System } from "../lib/System";
// import { SystemsManager } from "../lib/SystemsManager";

// export const ECSContext = createContext<ECS>((null as unknown) as ECS);

export class ECS {

    world: World | undefined;
    actions: any[] = [];

    constructor() {
        this.update = this.update.bind(this);
        // this.Provider = this.Provider.bind(this);
        this.enqueueAction = this.enqueueAction.bind(this);

    }

    async init(
        systems: (System | any)[] = [],
        cb?: (world: World) => any) {
        // await World
        //     .create({
        //         defs: [
        //             ...systems,
        //             EventSystem, {gameWorld: this},
        //         ]
        //     })
        //     .then((world) => {
        //         this.world = world;
        //         cb ? cb(world) : null;
        //     });
        this.world = await World.create({
            defs: [ ...systems, EventSystem, {gameWorld: this} ]
        })
        return cb ? cb(this.world) : null;
    }

    update(time: number, delta: number) {
        this.world?.execute(time, delta);
    }

    enqueueAction(
        action: (system: System, entity?: Entity|null, data?: any) => any,
        entity?: Entity|null,
        data?: any
    ) {
        this.actions.push({action, entity, data});
    }

    // Provider(props: Omit<ProviderProps<ECS>, 'value'>) {
    //     return (
    //         <ECSContext.Provider value={this}>{props.children}</ECSContext.Provider>
    //     );
    // }
}