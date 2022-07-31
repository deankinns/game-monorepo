import * as React from "react";
import {EntityPanel} from "./EntityPanel";
import {GameWindow} from "./GameWindow";
import {GameEntity} from 'yuka';

export function EntityList(props: { parent: GameWindow }) {
    const listItems = props.parent.manager?.entities.map((entity: GameEntity) =>
        <EntityPanel key={`entity${entity.uuid}`} entity={entity} parent={props.parent}/>
    );
    return (
        <ul>
            {listItems}
        </ul>
    );
}