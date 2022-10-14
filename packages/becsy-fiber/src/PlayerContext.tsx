import React from "react";
import {Entity} from "@lastolivegames/becsy";

export const PlayerContext = React.createContext<{ player: Entity | undefined, setPlayer: any }>(null!);