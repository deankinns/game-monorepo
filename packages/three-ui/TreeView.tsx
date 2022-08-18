import * as THREE from "three";
import { useState } from "react";
import * as React from "react";

export const TreeView = (props: { scene?: THREE.Object3D }) => {
  // const [scene, setScene] = useState(props.scene)

  return (
    <div
      className={"w3-card w3-light-grey"}
      style={{
        position: "fixed",
        overflow: "auto",
        top: 50,
        left: 0,
        maxHeight: "100vh",
      }}
      // onClick={() => setScene(props.scene)}
    >
      <ul className={"w3-ul"}>
        <TreeBranch object={props?.scene} />
      </ul>
    </div>
  );
};

export const TreeBranch = (props: { object?: THREE.Object3D }) => {
  const [open, toggleOpen] = useState(false);

  return (
    <li style={{ border: "1px lightgrey solid" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p>
          {props.object?.name} {props.object?.type}
        </p>
        {/*<p>{JSON.stringify(props.object?.userData.toString())}</p>*/}
        {props.object?.children.length < 1 ? null : (
          <button className={"w3-button"} onClick={() => toggleOpen(!open)}>
            {open ? "-" : "+"}
          </button>
        )}
      </div>
      {!open || props.object?.children.length < 1 ? null : (
        <>
          <p>children</p>
          <ul>
            {props.object?.children.map((child) => (
              <TreeBranch key={child.id} object={child} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
};
