import {Entity, System, World} from "@lastolivegames/becsy";
// import "./systems";
import {EventSystem} from "./systems";

declare global {
    interface Window {
        BECSY: any;
    }
}

export class GameWorld {
    world: World | null = null;
    actions: any[] = [];

    running = false;

    async makeWorld(defs: any[]): Promise<World> {
        this.world = await World.create({
            defs: [
                EventSystem, {gameWorld: this},
                ...defs
            ]
        });
        window.BECSY = this.world;
        return this.world;
        // this.world.
        // this.world.cre
    }

    enqueueAction(
        action: (system: System, entity?: Entity, data?: any) => any,
        entity?: Entity,
        data?: any
    ) {
        this.actions.push({action, entity, data});
    }

    execute(time:number, delta:number) {
        this.world?.execute(time, delta)
    }
}


