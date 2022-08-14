import * as React from "react";
import { Entity } from "@lastolivegames/becsy";
import { EntityPanel } from "./EntityPanel";
import { toJSON, fromJSON, stringify } from "flatted";
import {useContext} from "react";
import {GameWorldContext} from "./GameWorldWrapper";

// export class ComponentPanel extends React.Component<any, any> {
//   constructor(props: { component: any; parent: EntityPanel }) {
//     super(props);
//   }
export const ComponentPanel = (props: { component: any; entity: Entity }) => {

  const world = useContext(GameWorldContext)

  const removeComponent = (component: any) => {
    world?.enqueueAction(
      (sys, entity, data: { component: any }) => {
        entity?.remove(data.component);
      },
      props.entity,
      { component }
    );

  }

  // render() {
    let component;
    try {
      //@ts-ignore
      component = props.entity.read(props.component);
    } catch (e) {
      return <div>invalid {props.component.name}</div>;
    }

    const data = [];
    if (props.component.prototype.constructor.schema) {
      //@ts-ignore
      for (const [key, value] of Object.entries(
        props.component.prototype.constructor.schema
      )) {
        // @ts-ignore
        data.push({ key, value: component[key] });
      }
    }

    let dataStr = "";
    try {
      dataStr = JSON.stringify(data, undefined, 4);
    } catch (e) {}
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <h6 style={{ flex: 1 }}>{props.component.name}</h6>
          <button onClick={() => removeComponent(props.component)}>
            -
          </button>
        </div>
        <textarea
          readOnly={true}
          value={dataStr}
          className={"w3-code jsHigh"}
          style={{ maxWidth: "30vw", wordWrap: "break-word", overflow: "auto" }}
        >
          <>{dataStr}</>
        </textarea>
      </div>
    );
  // }
}
