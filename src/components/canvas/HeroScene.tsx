import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scrollStore";

/**
 * HeroScene — lighter than v1: no Environment HDR, no shadows,
 * lower particle count, fewer transmission samples. Mobile-first.
 */

function ParticleField({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null!);

  const { positions, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sca[i] = Math.random();
    }
    return { positions: pos, scales: sca };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uColorA: { value: new THREE.Color("#6C63FF") },
      uColorB: { value: new THREE.Color("#00FFA3") },
    }),
    [],
  );

  useFrame((_, dt) => {
    uniforms.uTime.value += dt;
    uniforms.uVelocity.value = useScrollStore.getState().velocity;
    if (points.current) points.current.rotation.y += dt * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aScale"
          args={[scales, 1]}
          count={scales.length}
          array={scales}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={/* glsl */ `
          attribute float aScale;
          uniform float uTime;
          uniform float uVelocity;
          varying float vDepth;
          varying float vMix;
          void main() {
            vec3 p = position;
            float wob = sin(uTime * 0.5 + aScale * 6.28) * 0.4;
            p.y += wob + uVelocity * 0.0008;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (1.5 + aScale * 3.0) * (320.0 / -mv.z);
            vDepth = clamp(-mv.z / 30.0, 0.0, 1.0);
            vMix = aScale;
          }
        `}
        fragmentShader={/* glsl */ `
          precision mediump float;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying float vDepth;
          varying float vMix;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            float alpha = smoothstep(0.5, 0.0, d) * (1.0 - vDepth) * 0.9;
            vec3 col = mix(uColorA, uColorB, smoothstep(0.85, 1.0, vMix));
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </points>
  );
}

function GlassMesh({ lite }: { lite: boolean }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.2;
    const p = useScrollStore.getState().progress;
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, -p * 4, 0.05);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, 1 - p * 0.3, 0.06));
  });

  return (
    <Float speed={1.2} floatIntensity={0.6} rotationIntensity={0.3}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.6, lite ? 1 : 2]} />
        {lite ? (
          <meshPhysicalMaterial
            color="#E8E4FF"
            roughness={0.15}
            metalness={0.6}
            clearcoat={0.6}
            transmission={0.4}
            thickness={0.6}
            ior={1.3}
          />
        ) : (
          <MeshTransmissionMaterial
            samples={2}
            thickness={1.2}
            chromaticAberration={0.25}
            anisotropy={0.4}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0}
            ior={1.4}
            color="#E8E4FF"
          />
        )}
      </mesh>
    </Float>
  );
}

function OrbitingLight() {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.x = Math.cos(t * 0.7) * 4;
      ref.current.position.z = Math.sin(t * 0.7) * 4;
    }
  });
  return <pointLight ref={ref} color="#6C63FF" intensity={40} distance={12} />;
}

export default function HeroScene({ lite = false }: { lite?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#E8E4FF" />
      <pointLight position={[-4, -2, -2]} intensity={15} color="#6C63FF" />
      {!lite && <OrbitingLight />}
      <GlassMesh lite={lite} />
      <ParticleField count={lite ? 700 : 1500} />
    </>
  );
}
