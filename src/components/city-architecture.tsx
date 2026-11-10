"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import {
  Color,
  Object3D,
  StaticDrawUsage,
  type InstancedMesh,
} from "three";

/**
 * A canyon of concrete masses, elevated decks and suspended spans.
 * The entire structure uses four static instanced batches.
 */

type Part = {
  position: [number, number, number];
  scale: [number, number, number];
  tint: number;
  rotationX?: number;
  rotationZ?: number;
};
type IndustrialCity = {
  cores: Part[];
  plates: Part[];
  structural: Part[];
  conduits: Part[];
};

const GROUND_Y = -118;

function makeRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function generateCity(): IndustrialCity {
  const rand = makeRandom(89171);
  const city: IndustrialCity = {
    cores: [], plates: [], structural: [], conduits: [],
  };
  function part(
    group: Part[], x: number, y: number, z: number,
    w: number, h: number, d: number, tint = 0.9,
    rotationX = 0, rotationZ = 0,
  ) {
    group.push({ position: [x, y, z], scale: [w, h, d], tint, rotationX, rotationZ });
  }

  // Two uneven walls form a deep central void. Repeated structural bays
  // establish scale, while the large offset masses keep the skyline irregular.
  const bays = [98, 15, -68, -151, -234, -317, -400, -483];
  for (const [index, z] of bays.entries()) {
    for (const side of [-1, 1]) {
      const x = side * (92 + rand() * 14);
      const height = 220 + rand() * 105;
      const top = GROUND_Y + height;
      const width = 55 + rand() * 20;
      const depth = 62 + rand() * 12;
      const tint = 0.69 + rand() * 0.2;

      part(city.cores, x, GROUND_Y + height / 2, z, width, height, depth, tint);
      // A narrower upper mass breaks the roofline into stepped silhouettes.
      part(city.cores, x + side * 9, top + 17, z - 5,
        width * 0.67, 34, depth * 0.7, tint * 0.82);
      // Massive projecting floors and dark vertical ribs read at a distance.
      for (const level of [0.32, 0.68]) {
        part(city.plates, x - side * 4, GROUND_Y + height * level, z,
          width + 18, 7, depth + 8, tint * 0.86);
      }
      part(city.structural, x - side * width * 0.4, GROUND_Y + height * 0.5, z + depth * 0.51,
        4, height * 0.92, 4, 0.44);
      part(city.structural, x + side * width * 0.2, GROUND_Y + height * 0.52, z + depth * 0.51,
        3, height * 0.82, 3, 0.52);
      // Large inset panels suggest occupied scale without tiny window grids.
      if (index % 2 === 0) {
        part(city.structural, x, GROUND_Y + height * 0.55, z + depth * 0.51,
          width * 0.35, height * 0.48, 1.5, 0.42);
      }
    }
  }

  // A few huge transverse spans make the canyon feel constructed rather
  // than like a conventional city. Gaps below them remain open to the fog.
  const spans: [number, number, number, number][] = [
    [58, 148, 154, 19], [-90, 121, 168, 23],
    [-248, 163, 164, 20], [-405, 133, 170, 25],
  ];
  for (const [z, y, width, depth] of spans) {
    part(city.plates, 0, y, z, width, 9, depth, 0.72);
    part(city.structural, 0, y - 8, z - depth * 0.4, width, 8, 3, 0.46);
    part(city.structural, 0, y - 8, z + depth * 0.4, width, 8, 3, 0.5);
  }

  // A central monolith and long elevated decks give each camera angle a
  // distinct focal point without adding individual draw calls.
  part(city.cores, -12, 25, -204, 46, 286, 48, 0.64);
  part(city.plates, -12, 162, -204, 62, 9, 59, 0.7);
  part(city.cores, -12, 186, -204, 31, 42, 32, 0.74);
  part(city.plates, 3, 68, -154, 18, 8, 310, 0.68);
  part(city.structural, -8, 61, -154, 3, 13, 310, 0.43);
  part(city.structural, 14, 61, -154, 3, 13, 310, 0.43);

  // Closely spaced vertical shafts and layered bridges echo the exposed
  // structural section of the reference, all within the existing batches.
  for (const z of [35, -115, -265, -415]) {
    for (const x of [-55, -37, 37, 55]) {
      part(city.cores, x, 66, z, 10, 368, 12, 0.72);
      part(city.structural, x - 3, 66, z + 6.5, 1.2, 362, 1.2, 0.42);
      part(city.structural, x + 3, 66, z + 6.5, 1.2, 362, 1.2, 0.48);
      for (const y of [-38, 35, 108, 181, 235]) {
        part(city.plates, x, y, z, 13, 3, 15, 0.65);
      }
    }
    for (const y of [-20, 42, 100, 205]) {
      part(city.plates, 0, y, z - 18, 190, 5, 12, 0.66);
      part(city.structural, 0, y - 4, z - 12, 190, 4, 1.5, 0.38);
      part(city.structural, 0, y + 4, z - 12, 190, 1.2, 1.2, 0.55);
    }
  }
  // Receding horizontal galleries and vertical supports fill the depth
  // between foreground spans without individual meshes or extra draw calls.
  for (const z of [-45, -195, -345]) {
    for (const y of [10, 65, 125, 185]) {
      for (const side of [-1, 1]) {
        part(city.plates, side * 62, y, z, 66, 3, 34, 0.62);
        part(city.structural, side * 62, y - 4, z + 16, 66, 5, 2, 0.4);
      }
    }
  }

  // Sparse utility pipes add a second scale, still in one instanced batch.
  for (const [x, y, z, length] of [[-57, 98, -145, 350], [57, 76, -170, 320]]) {
    part(city.conduits, x, y, z, 3, length, 3, 0.62, Math.PI / 2);
  }
  for (const [z, y] of [[58, 161], [-90, 134], [-248, 176]]) {
    part(city.conduits, 0, y, z, 2.5, 160, 2.5, 0.72, 0, Math.PI / 2);
  }

  return city;
}

function InstancedParts({
  parts, color, cylinder = false,
}: {
  parts: Part[];
  color: string;
  cylinder?: boolean;
}) {
  const mesh = useRef<InstancedMesh>(null);

  useLayoutEffect(() => {
    const instance = mesh.current;
    if (!instance) return;
    const dummy = new Object3D();
    const tint = new Color();

    for (let i = 0; i < parts.length; i++) {
      const item = parts[i];
      dummy.position.set(...item.position);
      dummy.rotation.set(item.rotationX ?? 0, 0, item.rotationZ ?? 0);
      dummy.scale.set(...item.scale);
      dummy.updateMatrix();
      instance.setMatrixAt(i, dummy.matrix);
      tint.setRGB(item.tint, item.tint, item.tint);
      instance.setColorAt(i, tint);
    }
    instance.instanceMatrix.setUsage(StaticDrawUsage);
    instance.instanceMatrix.needsUpdate = true;
    if (instance.instanceColor) instance.instanceColor.needsUpdate = true;
    instance.computeBoundingSphere();
  }, [parts]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, parts.length]} frustumCulled={false}>
      {cylinder ? <cylinderGeometry args={[1, 1, 1, 8, 1]} /> : <boxGeometry args={[1, 1, 1]} />}
      <meshLambertMaterial color={color} />
    </instancedMesh>
  );
}

export function CityArchitecture() {
  const parts = useMemo(() => generateCity(), []);

  return (
    <>
      <color attach="background" args={["#e2e2e2"]} />
      {/* Pale atmospheric distance above, pure black world-space fog below
          is separately integrated in psx-postprocess.tsx. */}
      <fog attach="fog" args={["#dadada", 320, 790]} />
      <ambientLight color="#d2d2d2" intensity={1.3} />
      <directionalLight color="#ffffff" intensity={2.1} position={[-95, 220, 35]} />
      <directionalLight color="#a9a9a9" intensity={0.4} position={[95, 100, -210]} />

      <InstancedParts parts={parts.cores} color="#aaaaaa" />
      <InstancedParts parts={parts.plates} color="#9c9c9c" />
      <InstancedParts parts={parts.structural} color="#666666" />
      <InstancedParts parts={parts.conduits} color="#999999" cylinder />
    </>
  );
}
