import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Lightformer, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * The hero's optical element: a real refractive glass prism.
 * A triangular prism (3-sided cylinder) with a transmission material —
 * the environment lightformers give it something to bend. It slowly
 * rotates, floats, and tilts toward the pointer; the tilt is also
 * broadcast as a `prism-tilt` event so LightSpine re-aims the rays.
 *
 * Loaded lazily (three.js is heavy) and only when motion is allowed;
 * the wordmark underneath is always the fallback.
 */

const BG = new THREE.Color('#08080e');

function Prism({ tilt }) {
  const group = useRef();
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += dt * 0.22;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tilt.current.y * 0.5, 0.055);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -tilt.current.x * 0.42, 0.055);
  });
  return (
    <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.55}>
      <group ref={group}>
        {/* 3-sided cylinder = triangular prism. Axis along Z so the
            triangular face greets the reader, point-up (thetaStart π/3). */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 1.45, 3, 1, false, Math.PI / 3]} />
          <MeshTransmissionMaterial
          transmission={1}
          thickness={1.5}
          roughness={0.06}
          ior={1.5}
          chromaticAberration={0.55}
          anisotropicBlur={0.35}
          distortion={0.14}
          temporalDistortion={0.08}
          samples={6}
          resolution={384}
          background={BG}
        />
        </mesh>
      </group>
    </Float>
  );
}

export default function Prism3D() {
  const tilt = useRef({ x: 0, y: 0 });
  const wrapRef = useRef(null);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    /* pause the render loop when the hero scrolls away */
    const io = new IntersectionObserver(
      ([e]) => setRunning(e.isIntersecting),
      { rootMargin: '80px' },
    );
    if (wrapRef.current) io.observe(wrapRef.current);

    let raf = 0;
    const move = (e) => {
      tilt.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      tilt.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          window.dispatchEvent(new CustomEvent('prism-tilt', { detail: { ...tilt.current } }));
        });
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="hero-prism-canvas" ref={wrapRef} aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5.2], fov: 34 }}
        gl={{ alpha: true, antialias: true }}
        frameloop={running ? 'always' : 'never'}
      >
        <Prism tilt={tilt} />
        {/* offline environment — lightformers only, no HDR fetch */}
        <Environment resolution={128}>
          <Lightformer intensity={8} position={[3, 4, 4]} scale={[3, 3, 1]} color="#ffffff" />
          <Lightformer intensity={3} position={[0, 1, -6]} scale={[8, 4, 1]} color="#ffffff" />
          <Lightformer intensity={3.5} position={[-4, -1, -3]} scale={[4, 2, 1]} color="#b36bff" />
          <Lightformer intensity={2.6} position={[0, -4, 2]} scale={[3, 1, 1]} color="#5c8aff" />
          <Lightformer intensity={2} position={[4, 0, -2]} scale={[2, 2, 1]} color="#ff5c4d" />
        </Environment>
      </Canvas>
    </div>
  );
}
