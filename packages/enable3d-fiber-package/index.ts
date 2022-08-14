import { useEffect, useState } from "react";
import {
  ExtendedGroup,
  ExtendedMesh,
  ExtendedObject3D,
  Scene3D,
  Types,
} from "enable3d";
import { useFrame, useThree } from "@react-three/fiber";

export * from "./shapes/Box";
export * from "./shapes/Capsule";
export * from "./Chair";
export * from "../fiber-package/Dummy";
export * from "./Dodecahedron";
export * from "./House";
export * from "./shapes/Sphere";
export * from "./vanillaScene";
export * from "./ProjectPanel";
export * from "./Vehicle";

export * from "./shapes";

export const usePhysics = (props: {
  ref: { current: ExtendedObject3D | ExtendedGroup | ExtendedMesh };

  usePhysics: boolean | ({ callback?: any } & Types.AddExistingConfig);
  position?: [x: number, y: number, z: number];
}) => {
  const { scene3d } = useThree() as { scene3d?: Scene3D };
  useEffect(() => {
    if (props.usePhysics && !props.ref.current.hasBody) {
      scene3d?.physics.add.existing(
        props.ref.current as ExtendedObject3D,
        typeof props.usePhysics === "boolean" ? { mass: 1 } : props.usePhysics
      );
      if ((props.usePhysics as any).callback as any) {
        (props.usePhysics as any).callback(props.ref);
      }
    } else if (!props.usePhysics) {
      scene3d?.physics.destroy(props.ref.current as ExtendedObject3D);
    }

    if (!props.ref.current.visible) {
      // scene3d?.physics.destroy(props.ref.current as ExtendedObject3D)
    }
  });

  useFrame(() => {
    if (
      props.ref.current.hasBody &&
      [2, 4].includes(props.ref.current.body.getCollisionFlags())
    ) {
      // @ts-ignore
      props.ref.current.position.set(
        props.position.x,
        props.position.y,
        props.position.z
      );
      props.ref.current.body.needUpdate = true;
    }
  });
};
