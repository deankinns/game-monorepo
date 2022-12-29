import * as React from "react";
import {Entity, World,} from "@lastolivegames/becsy";
import { EntityPanel } from "./EntityPanel";
import { toJSON, fromJSON, stringify } from "flatted";
import {useEcsStore } from "react-becsy";
import {useContext} from "react";
// import {GameWorldContext} from "./GameWorldWrapper";
import {retrocycle, decycle} from "./cycle";

'./cycle'

// export class ComponentPanel extends React.Component<any, any> {
//   constructor(props: { component: any; parent: EntityPanel }) {
//     super(props);
//   }
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (value instanceof World || (value.isAlive && typeof value.isAlive === 'function')) {
        return;
    }

    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const ComponentPanel = (props: { component: any; entity: Entity }) => {

  // const world = useContext(GameWorldContext)
  const world = useEcsStore().ecs

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
      if (props.component.name === 'RefComponent') {
        dataStr = 'ref'
        throw null
      }

      // if (data.toString())
      // const o = decycle(data, getCircularReplacer)
      dataStr = JSON.stringify(data, undefined, 4);
        // dataStr = data.toString()
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
