import {Entity} from "@lastolivegames/becsy";
import {Line} from "@react-three/drei";
import * as THREE from "three";
import React from "react";
import {useSystemEntities} from "react-becsy";
import {NavigationSystem, PathComponent} from "becsy-yuka-package";

export const Paths = () => {
    // const navigationSystem = useSystem(NavigationSystem) as NavigationSystem;
    const items = useSystemEntities({systemType: NavigationSystem, query: 'running'});

    return <>{[...items].map((e: Entity) => {
            if (!e.__valid || !e.alive || !e.has(PathComponent)) return null;
            const path = e.read(PathComponent).path;
            if (!path || path.length < 2) return null;
            return <Line
                key={e.__id}
                points={path.map(v => new THREE.Vector3(v.x, v.y, v.z))}
            />
        }
    )}</>
}