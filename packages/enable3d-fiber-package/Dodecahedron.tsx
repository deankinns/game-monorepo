import * as React from "react";
import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export function Dodecahedron(props: any) {
  const ref: any = useRef();
  const [hovered, hover] = useState(false);
  // const {scene} = useThree()
  useFrame((state, delta) => {
    ref.current.position.y = Math.sin(state.clock.getElapsedTime());
  });
  return (
    <mesh
      ref={ref}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      {...props}
    >
      <dodecahedronGeometry />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}
