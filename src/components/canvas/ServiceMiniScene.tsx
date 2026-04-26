import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Tiny chrome torus knot used in service cards. */
export default function ServiceMiniScene({ color = "#6C63FF" }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.x += dt * 0.4;
      ref.current.rotation.y += dt * 0.6;
    }
  });
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} color={color} intensity={20} />
      <pointLight position={[-3, -3, 2]} color="#E8E4FF" intensity={10} />
      <mesh ref={ref}>
        <torusKnotGeometry args={[0.7, 0.22, 64, 12]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>
    </>
  );
}
