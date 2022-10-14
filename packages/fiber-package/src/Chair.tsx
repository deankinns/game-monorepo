import * as React from "react";
import { useRef } from "react";
import { Group } from "three";
import { Box } from "@react-three/drei";

export const Chair = (props: any) => {
  const ref = useRef<Group>(null!);
  return (
    <group ref={ref} {...props}>
      <Seat position={[0, 0.5, 0]} args={[1.1, 0.1, 1.1]} />
      <Seat position={[-0.5, 1, 0]} args={[0.1, 1, 1]} />
      <Leg position={[0.45, 0, 0.45]} args={[0.1, 1, 0.1]} />
      <Leg position={[-0.45, 0, 0.45]} args={[0.1, 1, 0.1]} />
      <Leg position={[-0.45, 0, -0.45]} args={[0.1, 1, 0.1]} />
      <Leg position={[0.45, 0, -0.45]} args={[0.1, 1, 0.1]} />
    </group>
  );
};

const Leg = (props: any) => {
  return (
    <Box {...props}>
      <meshStandardMaterial color="brown" />
    </Box>
  );
};

const Seat = (props: any) => {
  return (
    <Box {...props}>
      <meshStandardMaterial color="red" />
    </Box>
  );
};
