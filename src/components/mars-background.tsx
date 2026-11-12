"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Planet = dynamic(
  () => import("@/components/mars-planet").then((module) => module.MarsPlanet),
  { ssr: false },
);

export function MarsBackground() {
  const [mobile, setMobile] = useState<boolean | null>(null);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return mobile === null ? null : <Planet mobile={mobile} />;
}
