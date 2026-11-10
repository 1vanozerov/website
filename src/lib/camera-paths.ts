/**
 * Authored flights through the monochrome megastructure on About / Contact.
 * The Games page does not create the 3D scene.
 */
export type Vec3 = readonly [number, number, number];
export type CameraPose = { position: Vec3; lookAt: Vec3 };
export type WorldSector = "about" | "contact";

export const CAMERA_PATHS: Record<WorldSector, Record<number, CameraPose>> = {
  about: {
    1: { position: [24, 220, 190], lookAt: [0, 105, -150] },
    2: { position: [24, 195, 100], lookAt: [0, 80, -160] },
    3: { position: [8, 175, 5], lookAt: [0, 65, -190] },
    4: { position: [-7, 173, -92], lookAt: [-8, 44, -233] },
  },
  contact: {
    7: { position: [97, 331, -37], lookAt: [5, 81, -201] },
    8: { position: [5, 185, -203], lookAt: [3, 24, -335] },
  },
};

export function currentSector(pathname: string): WorldSector {
  return /\/contact\/?$/.test(pathname) ? "contact" : "about";
}

export function poseFor(sector: WorldSector, view: number): CameraPose {
  const path = CAMERA_PATHS[sector];
  return path[view] ?? path[Number(Object.keys(path)[0])];
}

function blend(a: Vec3, b: Vec3, t: number): Vec3 {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function interpolatePose(a: CameraPose, b: CameraPose, t: number): CameraPose {
  const clamped = Math.max(0, Math.min(1, t));
  return {
    position: blend(a.position, b.position, clamped),
    lookAt: blend(a.lookAt, b.lookAt, clamped),
  };
}
