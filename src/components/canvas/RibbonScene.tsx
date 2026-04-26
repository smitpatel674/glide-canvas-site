import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollStore } from "@/store/scrollStore";

/** Abstract DNA-like ribbon helix that morphs subtly with scroll. */
export default function RibbonScene({ lite = false }: { lite?: boolean }) {
  const group = useRef<THREE.Group>(null!);

  const tubes = useMemo(() => {
    const segments = lite ? 80 : 140;
    const make = (offset: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < segments; i++) {
        const t = i / segments;
        const a = t * Math.PI * 6 + offset;
        pts.push(
          new THREE.Vector3(Math.sin(a) * 1.3, (t - 0.5) * 6, Math.cos(a) * 1.3),
        );
      }
      return new THREE.CatmullRomCurve3(pts);
    };
    return [make(0), make(Math.PI)];
  }, [lite]);

  useFrame((state, dt) => {
    if (!group.current) return;
    const v = useScrollStore.getState().velocity;
    group.current.rotation.y += dt * 0.2 + v * 0.0005;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
  });

  const tubularSegments = lite ? 80 : 160;
  const radialSegments = lite ? 5 : 8;

  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} color="#6C63FF" intensity={30} />
      <pointLight position={[-4, -2, 2]} color="#00FFA3" intensity={20} />
      <group ref={group}>
        {tubes.map((curve, i) => (
          <mesh key={i}>
            <tubeGeometry args={[curve, tubularSegments, 0.05, radialSegments, false]} />
            <meshPhysicalMaterial
              color={i === 0 ? "#6C63FF" : "#E8E4FF"}
              roughness={0.15}
              metalness={0.85}
              emissive={i === 0 ? "#6C63FF" : "#00FFA3"}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
