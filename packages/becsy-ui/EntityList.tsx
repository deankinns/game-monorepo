import * as React from "react";
import {EntityPanel} from "./EntityPanel";
import {GameWindow} from "../../apps/ecs-debug/src/GameWindow";
import {Entity} from "@lastolivegames/becsy";

export function EntityList(props: { parent: React.Component & {children: any[]} }) {
    const listItems = props.parent.children.map((entity: Entity) =>
        <EntityPanel key={`entity${entity.__id}`} entity={entity} parent={props.parent}/>
    );
    return (
        <div>
            {listItems}
        </div>
    );
}