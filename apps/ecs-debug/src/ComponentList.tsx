import * as React from "react";
import {ComponentPanel} from "./ComponentPanel";
import {EntityPanel} from "./EntityPanel";

export function ComponentList(props: { parent: EntityPanel }) {
    const listItems = props.parent.has.map((component: any) =>
        <ComponentPanel key={`component${component.name}`} parent={props.parent} component={component}/>
    );
    return (
        <div>
            {listItems}
        </div>
    );
}