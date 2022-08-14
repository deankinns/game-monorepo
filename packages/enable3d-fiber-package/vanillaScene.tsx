import { Scene3D } from "enable3d";
import * as React from "react";

export function VanillaScene(props: { scene: Scene3D }) {
  return <primitive object={props.scene.scene} {...props} />;

  // const children = props.scene.scene.children.map(child => <primitive key={child.id} object={child}  />)

  // return <>{children}</>
}
