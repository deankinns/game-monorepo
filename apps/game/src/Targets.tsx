import React, {useEffect, useState} from "react";
import {Entity} from "@lastolivegames/becsy";
import {Line} from "@react-three/drei";
import {useSystemEntities} from "react-becsy";
import {CombatSystem, GameEntityComponent, MemoryComponent} from "becsy-yuka-package";
import {PositionComponent, Target} from "becsy-package";

export const Targets = () => {

    const items = useSystemEntities({systemType: CombatSystem, query: 'entities'});
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCount(count + 1)
        }, 100)
    }, [count]);

    return <>
        {[...items].map((e: Entity) => {
            if (!e.__valid || !e.alive || !e.has(Target)) return null;
            const target = e.read(Target).value.hold();
            if (!target || !target.__valid || !target.alive || !target.has(PositionComponent)) return null;


            let color = 'red';
            if (e.has(MemoryComponent) && target.has(GameEntityComponent)) {
                const memory = e.read(MemoryComponent).system;
                const targetGameEntity = target.read(GameEntityComponent).entity;
                if (memory.hasRecord(targetGameEntity)) {
                    const record = memory.getRecord(targetGameEntity);
                    if (record.visible) {
                        color = 'green';
                    }
                }
            }

            return <Line
                key={e.__id}
                color={color}
                points={[
                    [
                        e.read(PositionComponent).position.x,
                        e.read(PositionComponent).position.y,
                        e.read(PositionComponent).position.z
                    ],
                    [
                        target.read(PositionComponent).position.x,
                        target.read(PositionComponent).position.y,
                        target.read(PositionComponent).position.z
                    ]
                ]}
            />
        })}</>;
}