"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { usePathname } from "next/navigation";
import { CityArchitecture } from "@/components/city-architecture";
import { PsxPostProcess } from "@/components/psx-postprocess";
import {
  currentSector,
  interpolatePose,
  poseFor,
  type CameraPose,
  type WorldSector,
} from "@/lib/camera-paths";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

/**
 * A cinematic background for About and Contact only.
 * Scroll follows authored camera poses and page navigation adds a short flyover.
 */
function readScrollPose(sector: WorldSector): CameraPose {
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>("[data-scene-view]")
  );
  if (!nodes.length) {
    return poseFor(sector, sector === "about" ? 1 : 7);
  }

  const anchorOffset = window.innerHeight * 0.28;
  const markers = nodes.map((node) => ({
    y: node.getBoundingClientRect().top + window.scrollY - anchorOffset,
    view: Number(node.dataset.sceneView) || 0,
  }));
  const scroll = window.scrollY;

  if (scroll <= markers[0].y) return poseFor(sector, markers[0].view);

  for (let i = 0; i < markers.length - 1; i++) {
    const start = markers[i];
    const end = markers[i + 1];
    if (scroll <= end.y) {
      // Smooth interpolation, not a jump every time a section changes.
      const ratio = (scroll - start.y) / Math.max(1, end.y - start.y);
      const eased = ratio * ratio * (3 - 2 * ratio);
      return interpolatePose(
        poseFor(sector, start.view),
        poseFor(sector, end.view),
        eased,
      );
    }
  }
  return poseFor(sector, markers[markers.length - 1].view);
}

type RouteFlight = {
  startPosition: Vector3;
  startLook: Vector3;
  elapsed: number;
};

function ScenicCamera({ reducedMotion }: { reducedMotion: boolean }) {
  const pathname = usePathname() ?? "/";
  const sector = currentSector(pathname);
  const { camera, invalidate } = useThree();

  const desired = useRef<CameraPose>(poseFor(sector, sector === "about" ? 1 : 7));
  const currentLook = useRef(new Vector3(...poseFor(sector, sector === "about" ? 1 : 7).lookAt));
  const pointer = useRef({ x: 0, y: 0 });
  const flight = useRef<RouteFlight | null>(null);
  const started = useRef(false);
  const lastPath = useRef(pathname);

  // Reused vectors: no allocations during a frame.
  const destinationPosition = useRef(new Vector3());
  const destinationLook = useRef(new Vector3());
  const tempPosition = useRef(new Vector3());
  const tempLook = useRef(new Vector3());

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = event.clientX / window.innerWidth * 2 - 1;
      pointer.current.y = event.clientY / window.innerHeight * 2 - 1;
      invalidate();
    };
    if (!reducedMotion) window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reducedMotion, invalidate]);

  useEffect(() => {
    // On navigation we keep the real camera/canvas; there is no teleport
    // caused by unmounting and remounting the Three.js scene.
    const changedPage = lastPath.current !== pathname;
    lastPath.current = pathname;

    const updateTarget = () => {
      const next = readScrollPose(sector);
      desired.current = next;
      invalidate();
    };

    if (!started.current) {
      updateTarget();
      camera.position.set(...desired.current.position);
      currentLook.current.set(...desired.current.lookAt);
      camera.lookAt(currentLook.current);
      started.current = true;
    } else if (changedPage && !reducedMotion) {
      flight.current = {
        startPosition: camera.position.clone(),
        startLook: currentLook.current.clone(),
        elapsed: 0,
      };
    } else if (reducedMotion) {
      flight.current = null;
    }

    // The router may restore scroll after the new page paints.
    let raf = 0;
    const scheduleTargetUpdate = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        updateTarget();
      });
    };

    updateTarget();
    window.addEventListener("scroll", scheduleTargetUpdate, { passive: true });
    window.addEventListener("resize", scheduleTargetUpdate);
    // Recompute after route mounting and scroll restoration.
    const delayed = window.setTimeout(scheduleTargetUpdate, 100);

    return () => {
      window.removeEventListener("scroll", scheduleTargetUpdate);
      window.removeEventListener("resize", scheduleTargetUpdate);
      window.clearTimeout(delayed);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pathname, sector, camera, invalidate, reducedMotion]);

  useFrame((state, delta) => {
    const current = desired.current;
    const pointerX = reducedMotion ? 0 : pointer.current.x * 1.25;
    const pointerY = reducedMotion ? 0 : pointer.current.y * 0.9;

    destinationPosition.current.set(
      current.position[0] + pointerX,
      current.position[1] - pointerY,
      current.position[2],
    );
    destinationLook.current.set(...current.lookAt);

    if (reducedMotion) {
      state.camera.position.copy(destinationPosition.current);
      currentLook.current.copy(destinationLook.current);
    } else if (flight.current) {
      // A high curving arc on page switches reveals another city district.
      const travel = flight.current;
      travel.elapsed += Math.min(delta, 0.1);
      const t = Math.min(1, travel.elapsed / 2.9);
      const eased = t * t * (3 - 2 * t);

      tempPosition.current.lerpVectors(
        travel.startPosition,
        destinationPosition.current,
        eased,
      );
      tempPosition.current.y += Math.sin(Math.PI * t) * 85;

      tempLook.current.lerpVectors(
        travel.startLook,
        destinationLook.current,
        eased,
      );
      state.camera.position.copy(tempPosition.current);
      currentLook.current.copy(tempLook.current);
      if (t >= 1) flight.current = null;
    } else {
      const smooth = 1 - Math.exp(-2.1 * Math.min(delta, 0.1));
      state.camera.position.lerp(destinationPosition.current, smooth);
      currentLook.current.lerp(destinationLook.current, smooth);
    }

    state.camera.lookAt(currentLook.current);

    // Continue only while the camera is moving; an idle page renders no frames.
    if (!reducedMotion && (flight.current ||
      state.camera.position.distanceToSquared(destinationPosition.current) > 0.0001 ||
      currentLook.current.distanceToSquared(destinationLook.current) > 0.0001)) {
      invalidate();
    }
  });

  return null;
}

export function Megascene() {
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <div className="megascene" aria-hidden="true">
      <Canvas
        camera={{
          position: [64, 345, 121],
          fov: 60,
          near: 0.5,
          far: 1120,
        }}
        dpr={1}
        frameloop="demand"
        shadows={false}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
        fallback={<div className="megascene-fallback" />}
      >
        <ScenicCamera reducedMotion={reducedMotion} />
        <CityArchitecture />
        <PsxPostProcess />
      </Canvas>
    </div>
  );
}
