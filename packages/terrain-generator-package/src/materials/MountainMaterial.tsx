import {extend, useLoader} from "@react-three/fiber";
import {shaderMaterial} from "@react-three/drei";
import {TextureLoader} from "three";
import React from "react";
import {useControls} from "leva";

extend({
    MountainBlendMaterial: shaderMaterial(
        {
            tFlat: null,
            tSlope: null,
            tSnow: null,
            snowHeight: {type: "float", value: 30.0} as any,
            fNormal: {type: "v3", value: [], boundTo: "faces"} as any,
        },
        `    
    uniform float snowHeight;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float fSnowHeight;

    void main() {
      vUv = vec2(uv.x, uv.y);
      vNormal = vec3(normal.x, normal.y, normal.z);
      vPosition = vec3(position.x, position.y, position.z);
      fSnowHeight = snowHeight;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
        `
    uniform sampler2D tFlat;
    uniform sampler2D tSlope;
    uniform sampler2D tSnow;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float fSnowHeight;

    void main() {
      vec4 flatTex = texture2D(tFlat, vUv);
      vec4 slopeTex = texture2D(tSlope, vUv);
      vec4 snowTex = texture2D(tSnow, vUv);
      
      if (vPosition.z > fSnowHeight) {
        flatTex = mix(flatTex, snowTex, smoothstep(0.0, 0.1, (vPosition.z - fSnowHeight)/1000.0));
      }

      gl_FragColor = mix(flatTex, slopeTex, smoothstep(0.0, 0.1, acos(dot(vec3(0.0, 0.0, 1.0), vNormal)) / 12.0));
    }
    `
    ),
});

const MountainMaterial = () => {
    const [flatTexture, slopeTexture, snowTexture] = useLoader(TextureLoader, [
        "textures/grass.jpg",
        "textures/rock.jpg",
        "textures/snow.jpg",
    ]);

    const {snowHeight} = useControls("Terrain", {snowHeight: 30.0});

    // @ts-ignore
    return <mountainBlendMaterial tFlat={flatTexture} tSlope={slopeTexture} tSnow={snowTexture} snowHeight={snowHeight}/>;
};

export default MountainMaterial;
