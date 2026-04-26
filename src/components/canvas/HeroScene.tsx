import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { useScrollStore } from "@/store/scrollStore";

/**
 * HeroScene — Floating glass icosahedron + violet point light orbit
 * + 5000-point particle field with depth fade shader.
 *
 * Performance:
 * - useMemo for geometries / attribute arrays
 * - dispose handled by R3F when meshes unmount
 * - particle field uses a single BufferGeometry + ShaderMaterial
 */

const PARTICLE_COUNT = 2500; // dialled from 5000 for mobile headroom

function ParticleField() {
  const points = useRef<THREE.Points>(null!);

  const { positions, scales } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sca = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sca[i] = Math.random();
    }
    return { positions: pos, scales: sca };
  }, []);

  // Custom GLSL — depth-fade soft circle particles tinted violet/mint
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
    if (points.current) {
      points.current.rotation.y += dt * 0.04;
    }
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

function GlassMesh() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * 0.15;
    ref.current.rotation.y = t * 0.2;
    // dolly with scroll progress
    const p = useScrollStore.getState().progress;
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, -p * 4, 0.05);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, 1 - p * 0.3, 0.06));
    void dt;
  });

  return (
    <Float speed={1.2} floatIntensity={0.8} rotationIntensity={0.4}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.6, 4]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={1.4}
          chromaticAberration={0.4}
          anisotropy={0.6}
          distortion={0.3}
          distortionScale={0.4}
          temporalDistortion={0.2}
          ior={1.4}
          color="#E8E4FF"
        />
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

export default function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        position={[5, 8, 5]}
        intensity={80}
        angle={0.5}
        penumbra={0.8}
        color="#E8E4FF"
        castShadow
      />
      <OrbitingLight />
      <Environment preset="night" />
      <GlassMesh />
      <ParticleField />
    </>
  );
}
