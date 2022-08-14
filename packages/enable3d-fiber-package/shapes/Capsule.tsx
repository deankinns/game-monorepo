import * as React from "react";
import { ThreeElements, extend, useThree } from "@react-three/fiber";
import { ExtendedObject3D, ExtendedMesh, Scene3D } from "enable3d";
import { useEffect, useRef } from "react";

extend({ ExtendedMesh });

export const Capsule = (
  props: ThreeElements["mesh"] & { height?: number; radius?: number }
) => {
  const ref = useRef<ExtendedMesh>(null!);
  const { scene3d } = useThree() as { scene3d: Scene3D };
  useEffect(() => {
    if (!ref.current.hasBody) {
      scene3d.physics.add.existing(ref.current, {
        shape: "capsule",
        ignoreScale: true,
        mass: 1,
        height: props.height ?? 1,
        radius: props.radius ?? 1,
        addChildren: true,
      });
    }
  });
  // scene3d.make.box()

  return (
    <extendedMesh ref={ref} {...props}>
      <capsuleGeometry args={[props.radius ?? 1, props.height ?? 1, 10, 20]} />
      <meshStandardMaterial color={"green"} />
      {props.children}
    </extendedMesh>
  );
};
