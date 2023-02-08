import {Entity} from "@lastolivegames/becsy";
import React from "react";
import {useEcsStore, useSystemEntities} from "react-becsy";
import {EntityManagerSystem} from "becsy-yuka-package";
import {Robot} from 'becsy-fiber/src/Robot';

export const Robots = () => {
    const selectEntity = useEcsStore(state => state.selectEntity);

    const items = useSystemEntities({systemType: EntityManagerSystem, query: 'vehicleEntities'})

    return <>{[...items]?.map((e: Entity) => e.__valid && e.alive && <Robot
        key={e.__id}
        entity={e.hold()}
        onClick={(ev: any) => {
            selectEntity(e)
            ev.stopPropagation()
        }}
    />)
    }</>

}