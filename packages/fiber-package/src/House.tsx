import * as React from "react";
import * as THREE from 'three'
import {MeshProps} from "@react-three/fiber";
import {useControls} from "leva";
import {useRef, useState} from "react";
import {Box} from "@react-three/drei";
import {EventHandlers} from "@react-three/fiber/dist/declarations/src/core/events";


export const House = (props: any) => {
  const ref = useRef<THREE.Group>(null!);
  const [floors, setFloors] = useState<number[]>([1]);
  const {floorHeight, width, depth, physics} = useControls("House", {
    physics: true,
    floors: {
      value: 1,
      min: 0,
      max: 10,
      step: 1,
      onChange: (v: number) => {
        const newFloors = [...Array(v).keys()];

        setFloors(newFloors);
      },
    },
    floorHeight: {value: 8, min: 0, max: 10, step: 0.1},
    width: {value: 100, min: 0, max: 1000, step: 10},
    depth: {value: 100, min: 0, max: 1000, step: 10},
  });
  // usePhysics({ref: ref, usePhysics: physics ? {mass: 0} : false})

  return (
      <group ref={ref} {...props} name={"house"}>
        {floors.map((i) => (
            <group key={`floor${i}`} position={[0, i * floorHeight, 0]}>
              <Floor args={[width, 0.1, depth]}></Floor>

              <Wall
                  position={[0, floorHeight / 2, depth / 2]}
                  args={[width, floorHeight, 0.1]}
                  name={`floor${i}-wall-f`}
              />
              <Wall
                  position={[0, floorHeight / 2, -depth / 2]}
                  args={[width, floorHeight, 0.1]}
                  name={`floor${i}-wall-b`}
              />
              <Wall
                  position={[width / 2, floorHeight / 2, 0]}
                  args={[0.1, floorHeight, depth]}
                  name={`floor${i}-wall-l`}
              />
              <Wall
                  position={[-width / 2, floorHeight / 2, 0]}
                  args={[0.1, floorHeight, depth]}
                  name={`floor${i}-wall-r`}
              />
            </group>
        ))}
      </group>
  );
};

const Wall = (props: JSX.IntrinsicAttributes & Pick<Omit<MeshProps, "args"> & { args?: [width?: number | undefined, height?: number | undefined, depth?: number | undefined, widthSegments?: number | undefined, heightSegments?: number | undefined, depthSegments?: number | undefined] | undefined; children?: React.ReactNode; }, "attach" | "args" | "children" | "key" | "onUpdate" | "position" | "up" | "scale" | "rotation" | "matrix" | "quaternion" | "layers" | "dispose" | "type" | "id" | "uuid" | "name" | "parent" | "modelViewMatrix" | "normalMatrix" | "matrixWorld" | "matrixAutoUpdate" | "matrixWorldNeedsUpdate" | "visible" | "castShadow" | "receiveShadow" | "frustumCulled" | "renderOrder" | "animations" | "userData" | "customDepthMaterial" | "customDistanceMaterial" | "isObject3D" | "onBeforeRender" | "onAfterRender" | "applyMatrix4" | "applyQuaternion" | "setRotationFromAxisAngle" | "setRotationFromEuler" | "setRotationFromMatrix" | "setRotationFromQuaternion" | "rotateOnAxis" | "rotateOnWorldAxis" | "rotateX" | "rotateY" | "rotateZ" | "translateOnAxis" | "translateX" | "translateY" | "translateZ" | "localToWorld" | "worldToLocal" | "lookAt" | "add" | "remove" | "removeFromParent" | "clear" | "getObjectById" | "getObjectByName" | "getObjectByProperty" | "getWorldPosition" | "getWorldQuaternion" | "getWorldScale" | "getWorldDirection" | "raycast" | "traverse" | "traverseVisible" | "traverseAncestors" | "updateMatrix" | "updateMatrixWorld" | "updateWorldMatrix" | "toJSON" | "clone" | "copy" | "addEventListener" | "hasEventListener" | "removeEventListener" | "dispatchEvent" | "material" | "geometry" | "morphTargetInfluences" | "morphTargetDictionary" | "isMesh" | "updateMorphTargets" | keyof EventHandlers> & React.RefAttributes<unknown>) => {
  return (
    <Box {...props}>
      <meshStandardMaterial color="orange" />
    </Box>
  );
};

const Floor = (props: JSX.IntrinsicAttributes & Pick<Omit<MeshProps, "args"> & { args?: [width?: number | undefined, height?: number | undefined, depth?: number | undefined, widthSegments?: number | undefined, heightSegments?: number | undefined, depthSegments?: number | undefined] | undefined; children?: React.ReactNode; }, "attach" | "args" | "children" | "key" | "onUpdate" | "position" | "up" | "scale" | "rotation" | "matrix" | "quaternion" | "layers" | "dispose" | "geometry" | "material" | "morphTargetInfluences" | "morphTargetDictionary" | "isMesh" | "type" | "updateMorphTargets" | "raycast" | "id" | "uuid" | "name" | "parent" | "modelViewMatrix" | "normalMatrix" | "matrixWorld" | "matrixAutoUpdate" | "matrixWorldNeedsUpdate" | "visible" | "castShadow" | "receiveShadow" | "frustumCulled" | "renderOrder" | "animations" | "userData" | "customDepthMaterial" | "customDistanceMaterial" | "isObject3D" | "onBeforeRender" | "onAfterRender" | "applyMatrix4" | "applyQuaternion" | "setRotationFromAxisAngle" | "setRotationFromEuler" | "setRotationFromMatrix" | "setRotationFromQuaternion" | "rotateOnAxis" | "rotateOnWorldAxis" | "rotateX" | "rotateY" | "rotateZ" | "translateOnAxis" | "translateX" | "translateY" | "translateZ" | "localToWorld" | "worldToLocal" | "lookAt" | "add" | "remove" | "removeFromParent" | "clear" | "getObjectById" | "getObjectByName" | "getObjectByProperty" | "getWorldPosition" | "getWorldQuaternion" | "getWorldScale" | "getWorldDirection" | "traverse" | "traverseVisible" | "traverseAncestors" | "updateMatrix" | "updateMatrixWorld" | "updateWorldMatrix" | "toJSON" | "clone" | "copy" | "addEventListener" | "hasEventListener" | "removeEventListener" | "dispatchEvent" | keyof EventHandlers> & React.RefAttributes<unknown>) => {
  return (
    <Box {...props}>
      <meshStandardMaterial color="hotpink" />
    </Box>
  );
};
