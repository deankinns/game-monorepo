import {Entity} from "@lastolivegames/becsy";
import {Crate} from "becsy-fiber/src/Crate";
import React from "react";
import {useSystemEntities} from "react-becsy";
import {PerceptionSystem} from "becsy-yuka-package";

export const Obstacles = () => {
    const items = useSystemEntities({systemType: PerceptionSystem, query: 'obstacles'});

    return <>{[...items]?.map((e: Entity) => {
        // const {height, width, depth} = e.read(Obstacle);
        // const {x, y, z} = e.read(PositionComponent).position;

        return <Crate
            key={e.__id}
            entity={e}
        />
    })}</>
}