"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";

const corners = [
  [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
] as const;

function Cube({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  const pieces = useRef<(Mesh | null)[]>([]);
  const opening = useRef(0);
  const scroll = useRef(0);
  const spin = useRef(0);
  const { invalidate } = useThree();

  useEffect(() => {
    invalidate();
    if (reduced) return;
    const onScroll = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = Math.max(documentHeight - window.innerHeight, 1);
      scroll.current = Math.min(Math.max(window.scrollY / scrollableHeight, 0), 1);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") invalidate();
    }, 1000 / 20);
    const onVisibility = () => { if (document.visibilityState === "visible") invalidate(); };
    document.addEventListener("visibilitychange", onVisibility);
    return () => { window.clearInterval(timer); window.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", onVisibility); };
  }, [invalidate, reduced]);

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    const step = Math.min(delta, .1);
    spin.current += step * .22;
    const ease = 1 - Math.exp(-step * 5);
    group.current.rotation.y += (0.58 + spin.current - group.current.rotation.y) * ease;
    opening.current += (Math.min(Math.max(scroll.current, 0), 1) - opening.current) * ease;
    const spread = .55 + opening.current * .6;
    pieces.current.forEach((piece, index) => {
      if (piece) piece.position.set(corners[index][0] * spread, corners[index][1] * spread, corners[index][2] * spread);
    });
    group.current.scale.setScalar(1.6 - opening.current * .76);
  });

  return (
    <group ref={group} rotation={[0.38, 0.58, 0.08]} scale={1.6}>
      {corners.map(([x, y, z], index) => <mesh key={index} ref={(piece) => { pieces.current[index] = piece; }} position={[x * .55, y * .55, z * .55]}>
      <boxGeometry args={[1.1, 1.1, 1.1]} />
      <shaderMaterial
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          precision mediump float;
          varying vec3 vNormal;
          void main() {
            float light = .34 + .55 * max(dot(normalize(vNormal), normalize(vec3(-.5, .9, 1.0))), 0.0);
            vec2 p = floor(gl_FragCoord.xy);
            float noise = fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            float shade = floor(clamp(light + (noise - .5) * .20, 0.0, 1.0) * 5.0) / 5.0;
            gl_FragColor = vec4(vec3(shade * .85, shade * .93, shade * .87), 1.0);
          }
        `}
      />
    </mesh>)}
      <mesh>
        <sphereGeometry args={[.38, 24, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

export function MobileCube() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="mobile-cube-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8.2], fov: 44 }} dpr={0.35} frameloop="demand"
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        fallback={<div className="mobile-cube-fallback" />}>
        <Cube reduced={reduced} />
      </Canvas>
    </div>
  );
}
