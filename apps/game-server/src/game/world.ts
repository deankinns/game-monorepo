import {GameWorld} from 'becsy-package'
import 'becsy-package/systems'
import 'becsy-yuka-package/systems'

import {Render} from 'becsy-package'
import {EntityManagerSystem} from 'becsy-yuka-package'
import * as React from "react";

export const world = new GameWorld();
export const renderRef = React.createRef();
export const entityManagerRef = React.createRef();
export const worldRef = React.createRef<GameWorld>();
if (!world.world) {
    world.makeWorld([
        Render, {reference: renderRef},
        EntityManagerSystem, {reference: entityManagerRef},
    ]).then(w => {
        console.log(w);
        // export const gameWorld = world;

    });
}
// worldRefworld;
// export default gameWorld;