import * as React from "react";
import Terrain from "@/components/canvas/Terrain";
import GameEntities from "@/components/canvas/GameEntities";

export default function GameWorld() {

    return (<>
        <Terrain/>
        <GameEntities/>
    </>);
}