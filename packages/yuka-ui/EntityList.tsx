import * as React from "react";
import {EntityPanel} from "./EntityPanel";
import {GameEntity} from "yuka";
import {GameEntity as WrappedGameEntity} from "yuka-package";
import {useContext, useEffect, useState} from "react";
import {EntityManagerContext} from "./EntityManagerWrapper";

export function EntityList() {
    const [frame, setFrame] = useState<number>(0)
    const manager = useContext(EntityManagerContext);
    //
    useEffect(() => {
        if (manager) {
            console.log("EntityList: manager changed");
        }
    } , [manager]);

    // setInterval(() => {
    //   setFrame(frame + 1)
    // },100)

    const listItems = manager?.entities.map((entity: GameEntity) => (
        <EntityPanel
            key={`entity${entity.uuid}`}
            entity={entity as WrappedGameEntity}
            // parent={props.parent}
        />
    ));
    return <div>{listItems}</div>;
}
