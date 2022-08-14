import * as React from "react";
import { useThree } from "@react-three/fiber";
import { ExtendedObject3D, Scene3D } from "enable3d";
import { Vehicle as VehicleObj } from "enable3d-package";
import { useRef } from "react";
import { useControls } from "leva";

export const Vehicle = (props) => {
  const { scene3d } = useThree() as { scene3d: Scene3D };
  const ref = useRef<ExtendedObject3D>(null!);
  const v = new VehicleObj(scene3d, props);

  // useControls(`Vehicle${ref.current.id}`, {
  //     acceleration: {
  //         min: -10,
  //         value: 0,
  //         max: 10, onChange: (value) => {
  //             v.acceleration = value
  //         }
  //     },
  //     steering: {
  //         min: -10,
  //         value: 0,
  //         max: 10, onChange: (value) => {
  //             v.steering = value
  //         }
  //     },
  // })

  // v.acceleration

  // return (<primitive ref={ref} object={v.plate} dispose={null}/>)
};
