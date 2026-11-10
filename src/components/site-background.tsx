"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Megascene = dynamic(
  () => import("@/components/megascene").then((module) => module.Megascene),
  { ssr: false, loading: () => <div className="megascene-fallback" aria-hidden="true" /> },
);

const MobileCube = dynamic(
  () => import("@/components/mobile-cube").then((module) => module.MobileCube),
  { ssr: false, loading: () => <div className="mobile-cube-fallback" /> },
);

export function SiteBackground() {
  const pathname = usePathname() ?? "/";
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 721px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  if (/(^|\/)(games|impressum|datenschutz)\/?$/.test(pathname)) return null;

  return (
    <>
      {desktop ? <Megascene /> : (
        <div className="mobile-megastructure" aria-hidden="true">
          <MobileCube />
        </div>
      )}
      <div className="atmosphere" aria-hidden="true" />
      <div className="film-grain" aria-hidden="true" />
    </>
  );
}
