import * as React from "react";
import {EntityPanel} from "./EntityPanel";
import {GameWindow} from "./GameWindow";
import {Entity} from "@lastolivegames/becsy";

export function EntityList(props: { parent: GameWindow }) {
    const listItems = props.parent.children.map((entity: Entity) =>
        <EntityPanel key={`entity${entity.__id}`} entity={entity} parent={props.parent}/>
    );
    return (
        <ul>
            {listItems}
        </ul>
    );
}