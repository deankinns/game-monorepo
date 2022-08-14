import * as React from "react";
import { ComponentPanel } from "./ComponentPanel";
import { EntityPanel } from "./EntityPanel";
import {Entity} from "@lastolivegames/becsy";

export function ComponentList(props: { components: any[], entity: Entity }) {
  const listItems = props.components.map((component: any) => (
    <ComponentPanel
      key={`component${component.name}`}
      // parent={props.parent}
      component={component}
      entity={props.entity}
    />
  ));
  return (
    <div
      className={"w3-container"}
      style={{ display: "flex", flexDirection: "column" }}
    >
      {listItems}
    </div>
  );
}
