import {World} from '@lastolivegames/becsy'
import './systems'


declare global {
    interface Window { BECSY: any; }
}
export class GameWorld {
    world: World | undefined;

    async makeWorld(defs: any) {
        this.world = await World.create({defs});

        window.BECSY = this.world;
        // this.world.
        // this.world.cre
    }

}