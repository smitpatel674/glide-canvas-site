import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Metaball-ish background — animated noise plane with gradient (cheap). */
export default function ContactScene() {
  const ref = useRef<THREE.Mesh>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#6C63FF") },
      uColorB: { value: new THREE.Color("#00FFA3") },
      uColorBg: { value: new THREE.Color("#fafaff") },
    }),
    [],
  );

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    if (ref.current) ref.current.rotation.z += dt * 0.02;
  });

  return (
    <>
      <mesh ref={ref} scale={[8, 8, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            precision mediump float;
            uniform float uTime;
            uniform vec3 uColorA;
            uniform vec3 uColorB;
            uniform vec3 uColorBg;
            varying vec2 vUv;

            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            float noise(vec2 p) {
              vec2 i = floor(p), f = fract(p);
              float a = hash(i);
              float b = hash(i + vec2(1.0, 0.0));
              float c = hash(i + vec2(0.0, 1.0));
              float d = hash(i + vec2(1.0, 1.0));
              vec2 u = f * f * (3.0 - 2.0 * f);
              return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
              vec2 uv = vUv * 3.0;
              float n = noise(uv + uTime * 0.12);
              n += 0.5 * noise(uv * 2.0 - uTime * 0.08);
              float m = smoothstep(0.4, 1.2, n);
              vec3 col = mix(uColorBg, uColorA, m);
              col = mix(col, uColorB, smoothstep(0.85, 1.1, n) * 0.6);
              float d = distance(vUv, vec2(0.5));
              col *= smoothstep(0.9, 0.2, d);
              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>
    </>
  );
}
