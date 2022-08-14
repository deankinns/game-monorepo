import * as React from "react";
import { useRef, useState } from "react";
import { Chair } from "enable3d-fiber-package";
import { Dodecahedron } from "enable3d-fiber-package";
import { ExtendedMesh, Scene3D } from "enable3d";
import { useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { Vector3 } from "three";
import { OrbitControls, Sky, Stars, Sphere, Box } from "@react-three/drei";
import { RigidBody, BallCollider } from "@react-three/rapier";

export const DemoScene = () => {
  // const boxes = [1,2,3,4,5]
  // const {scene3d} = useThree() as { scene3d?: Scene3D };
  // const boxRef = useRef<ExtendedMesh>(null!)
  const [boxes, addBox] = useState([1]);
  const { position, scale } = useControls("Box", {
    position: [0, 10, 0],
    scale: [1, 1, 1],
    // usePhysics: false/
  });

  // if (!scene3d) {
  //     return null;
  // }
  //
  // const scene = scene3d as Scene3D;
  //
  // setInterval(() => {
  //     // boxes.push(boxes.length + 1)
  //     // boxes.push(boxes.length + 1)
  //     // boxes.push(boxes.length + 1)
  //     // boxes.push(boxes.length + 1)
  //     // boxes.push(boxes.length + 1)
  //     // boxes.push(boxes.length + 1)
  //     addBox([...boxes, boxes.length + 1])
  // }, 100)

  const { azimuth, inclination, distance } = useControls("Sky", {
    azimuth: {
      value: 0.25,
      max: 1,
      min: 0,
      step: 0.01,
    },
    inclination: {
      value: 0,
      max: 1,
      min: 0,
      step: 0.01,
    },
    distance: {
      value: 30000,
      max: 100000000,
      step: 1000,
    },
    sunPosition: [0, 1, 0],
  });

  return (
    <>
      <Stars />
      <Sky azimuth={azimuth} inclination={inclination} distance={distance} />
      <OrbitControls />
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 0, 5]} color="teal" />
      <group>
        {boxes.map((box) => (
          <Box
            key={`box${box}`}
            position={[
              (box - 150) * 5,
              // 10, //(Math.sin(box * (Date.now() / 10000)) * 100) - 50,
              Math.sin(box * (Date.now() / 50000)) * 20,
              Math.cos(box * (Date.now() / 50000)) * 20 - 100,
              // -100
            ]}
            // factory={props.scene.userData.factory as Scene3D}
            args={[20, 10, 10]}
          />
        ))}
      </group>
      <Box
        onClick={() => addBox([...boxes, boxes.length + 1])}
        key={`box`}
        position={position}
        // factory={props.scene.userData.factory as Scene3D}

        args={scale}
      />
      <Dodecahedron
        position={[10, 10, 0]}
        onClick={() => addBox([...boxes, boxes.length + 1])}
      />
      {/*<RigidBody>*/}
      {/*    <Sphere>*/}

      {/*        <Sphere position={[0, 10, 0]}/>*/}
      {/*        /!*<BallCollider />*!/*/}

      {/*        <Box position={[0, 1, 0]} rotation={[0, Math.PI / 4, 0]}/>*/}
      {/*        /!*<Box position={[0,-1,0]} />*!/*/}
      {/*        <Box position={[0, 5, 0]}/>*/}
      {/*    </Sphere>*/}
      {/*</RigidBody>*/}
      <RigidBody position={[-2, 10, 0]}>
        <Chair />
      </RigidBody>
    </>
  );
};
