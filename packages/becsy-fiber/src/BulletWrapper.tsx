import {Entity} from "@lastolivegames/becsy";
import React from "react";
import {useSystemEntities} from "react-becsy";
import {BulletSystem} from "becsy-fiber/systems/BulletSystem";
import {Bullet} from "becsy-fiber/src/Bullet";

export const BulletWrapper = () => {

    const items = useSystemEntities({systemType: BulletSystem, query: 'bullets'});

    return <>
        {[...items].map((bullet: Entity) => {
            if (!bullet.__valid || !bullet.alive) return null;

            return <Bullet
                key={bullet.__id}
                entity={bullet.hold()}
            />
        })}
    </>
}