"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DataTexture,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  UnsignedByteType,
  Vector2,
  WebGLRenderTarget,
  type Group,
} from "three";

function noise(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = noise(ix, iy);
  const b = noise(ix + 1, iy);
  const c = noise(ix, iy + 1);
  const d = noise(ix + 1, iy + 1);
  return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
}

function createMarsSurface(mobile: boolean) {
  const width = mobile ? 160 : 320;
  const height = width / 2;
  const data = new Uint8Array(width * height * 4);

  // Craters are built into the tiny procedural map, not as expensive meshes.
  const craters = Array.from({ length: mobile ? 18 : 26 }, (_, i) => ({
    x: noise(i * 13 + 2, 3),
    y: 0.1 + noise(i * 7 + 11, 5) * 0.8,
    radius: 0.014 + noise(i * 19, 9) * 0.04,
  }));

  for (let y = 0; y < height; y++) {
    const v = y / height;
    for (let x = 0; x < width; x++) {
      const u = x / width;
      const broad = smoothNoise(u * 7.4, v * 4.2);
      const canyon = smoothNoise(u * 24, v * 12);
      const rocks = smoothNoise(u * 82, v * 44);
      let terrain = 0.28 + broad * 0.4 + canyon * 0.22 + rocks * 0.1;

      for (const crater of craters) {
        const distanceX = Math.min(Math.abs(u - crater.x), 1 - Math.abs(u - crater.x)) * 1.65;
        const distanceY = (v - crater.y) * 1.2;
        const dist = Math.hypot(distanceX, distanceY) / crater.radius;
        if (dist < 1.7) {
          const basin = Math.exp(-dist * dist * 3.0);
          const rim = Math.exp(-Math.pow((dist - 0.98) * 5.0, 2));
          terrain += rim * 0.105 - basin * 0.17;
        }
      }

      const polar = Math.max(0, Math.abs(v - 0.5) - 0.43) * 1.7;
      const light = Math.max(0.16, Math.min(0.94, terrain));
      const index = (y * width + x) * 4;
      data[index] = Math.min(255, (194 + polar * 20) * light);
      data[index + 1] = Math.min(255, (114 + polar * 24) * light);
      data[index + 2] = Math.min(255, (72 + polar * 18) * light);
      data[index + 3] = 255;
    }
  }

  const texture = new DataTexture(data, width, height, undefined, UnsignedByteType);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function Planet({ reducedMotion, mobile }: { reducedMotion: boolean; mobile: boolean }) {
  const group = useRef<Group>(null);
  const { size } = useThree();
  const map = useMemo(() => createMarsSurface(mobile), [mobile]);

  // Keep the entire sphere within the real viewport, including narrow
  // mobile screens, without relying on oversized clipped containers.
  const halfWidth = Math.tan((46 * Math.PI) / 360) * 5.1 *
    (size.width / Math.max(1, size.height));
  const planetScale = Math.min(1, halfWidth * 0.82 / 1.68);
  const orbitCenterX = Math.min(
    1.12,
    Math.max(0, halfWidth - 1.68 * planetScale - 0.10),
  );
  const orbitRadiusX = Math.max(
    0,
    Math.min(0.09, halfWidth - 1.68 * planetScale - orbitCenterX - 0.035),
  );

  useEffect(() => () => map.dispose(), [map]);

  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    const t = state.clock.elapsedTime;
    const orbit = t * 0.1;
    group.current.rotation.y += Math.min(delta, 0.1) * 0.024;
    group.current.rotation.z = -0.17 + Math.sin(orbit) * 0.017;
    group.current.position.x = orbitCenterX + Math.cos(orbit) * orbitRadiusX;
    group.current.position.y = -0.04 + Math.sin(orbit) * 0.11;
    group.current.position.z = Math.sin(orbit) * 0.07;
  });

  return (
    <group
      ref={group}
      position={[orbitCenterX + orbitRadiusX, -0.04, 0]}
      rotation={[0.12, -0.6, -0.17]}
      scale={planetScale}
    >
      <mesh>
        <sphereGeometry args={[1.68, mobile ? 32 : 56, mobile ? 24 : 40]} />
        <meshStandardMaterial map={map} roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function DitherPass() {
  const { invalidate, size } = useThree();
  const pass = useMemo(() => {
    const target = new WebGLRenderTarget(1, 1, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: true,
      stencilBuffer: false,
      samples: 0,
    });
    const resolution = { value: new Vector2(1, 1) };
    const material = new ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      transparent: true,
      toneMapped: false,
      uniforms: {
        uImage: { value: target.texture },
        uResolution: resolution,
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform sampler2D uImage;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float bayer2(vec2 p) {
          if (p.y < 0.5) return p.x < 0.5 ? 0.0 : 2.0;
          return p.x < 0.5 ? 3.0 : 1.0;
        }

        float bayer4(vec2 p) {
          vec2 cell = mod(p, 4.0);
          return (4.0 * bayer2(mod(cell, 2.0)) +
                  bayer2(floor(cell / 2.0))) / 16.0;
        }

        void main() {
          vec2 pixel = floor(vUv * uResolution);
          vec2 uv = (pixel + 0.5) / uResolution;
          vec4 original = texture2D(uImage, uv);
          float dither = (bayer4(pixel) - 0.5) * 0.075;
          vec3 muted = original.rgb * vec3(0.99, 0.87, 0.75);
          vec3 quantized = floor(clamp(muted + dither, 0.0, 1.0) * 9.0 + 0.5) / 9.0;
          gl_FragColor = vec4(quantized, original.a);
        }
      `,
    });
    const geometry = new PlaneGeometry(2, 2);
    const screen = new Scene();
    const quad = new Mesh(geometry, material);
    quad.frustumCulled = false;
    screen.add(quad);
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    return { target, resolution, material, geometry, camera, screen };
  }, []);

  useEffect(() => {
    const density = Math.min(size.width < 800 ? 0.43 : 0.38, 300 / Math.max(1, size.width));
    const width = Math.max(1, Math.round(size.width * density));
    const height = Math.max(1, Math.round(size.height * density));
    pass.target.setSize(width, height);
    pass.resolution.value.set(width, height);
    invalidate();
  }, [size.width, size.height, pass, invalidate]);

  useEffect(() => () => {
    pass.target.dispose();
    pass.material.dispose();
    pass.geometry.dispose();
  }, [pass]);

  useFrame(({ gl, scene, camera }) => {
    const oldTarget = gl.getRenderTarget();
    gl.setRenderTarget(pass.target);
    gl.clear(true, true, true);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.clear(true, true, true);
    gl.render(pass.screen, pass.camera);
    gl.setRenderTarget(oldTarget);
  }, 1);

  return null;
}

function PlanetCanvas({ mobile }: { mobile: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.1], fov: 46, near: 0.1, far: 20 }}
      frameloop="demand"
      dpr={mobile ? 0.5 : 1}
      shadows={false}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      fallback={<div className="mobile-mars" />}
    >
      <ambientLight color="#684740" intensity={0.22} />
      <directionalLight color="#f7b18c" position={[-4, 2, 5]} intensity={2.2} />
      <directionalLight color="#523630" position={[3, -2, -1]} intensity={0.2} />
      <Planet reducedMotion={reducedMotion} mobile={mobile} />
      <DitherPass />
      <DemandFrames reducedMotion={reducedMotion} mobile={mobile} />
    </Canvas>
  );
}

function DemandFrames({ reducedMotion, mobile }: { reducedMotion: boolean; mobile: boolean }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (reducedMotion) {
      invalidate();
      return;
    }
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") invalidate();
    }, 1000 / (mobile ? 20 : 30));
    return () => window.clearInterval(timer);
  }, [reducedMotion, mobile, invalidate]);

  return null;
}

export function MarsPlanet({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="mars-planet" aria-hidden="true">
      <PlanetCanvas mobile={mobile} />
    </div>
  );
}
