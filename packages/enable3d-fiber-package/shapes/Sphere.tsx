import * as React from "react";
import { useRef } from "react";
import { ExtendedMesh } from "enable3d";
import { extend, ThreeElements } from "@react-three/fiber";
import { usePhysics } from "../index";

extend({ ExtendedMesh });

export const Sphere = (props: ThreeElements["mesh"] & { radius?: number }) => {
  const ref = useRef<THREE.Mesh>(null!);

  //@ts-ignore
  return (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[props.radius ?? 1, 32, 16]} />
      <meshStandardMaterial color={"green"} />
      {props.children}
    </mesh>
  );
};
