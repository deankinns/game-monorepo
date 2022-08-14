import { ThreeElements, useFrame, useThree, extend } from "@react-three/fiber";
import {
  ExtendedGroup,
  ExtendedObject3D,
  Scene3D,
  THREE,
  ExtendedMesh,
} from "enable3d";
import * as React from "react";
import { useEffect, useRef, useState } from "react";

import { BoxObject } from "@enable3d/common/dist/types";
import { usePhysics } from "../index";

extend({ ExtendedMesh });

export const Box = (
  props: ThreeElements["mesh"] & {
    size?: [x: number, y: number, z: number];
    usePhysics?: any;
  }
) => {
  const ref = useRef<ExtendedMesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  usePhysics({ ref, usePhysics: props.usePhysics ?? false });

  // @ts-ignore
  return (
    <extendedMesh
      type={"box"}
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event: any) => {
        click(!clicked);
        hover(true);
        if (props.onClick) props.onClick(event);
      }}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={props.size ?? [1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </extendedMesh>
  );
};
