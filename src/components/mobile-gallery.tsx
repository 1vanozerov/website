"use client";

import Image from "next/image";
import type { PointerEvent } from "react";

function tiltScreenshot(event: PointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  event.currentTarget.style.setProperty("--shot-tilt-x", `${(-y * 9).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--shot-tilt-y", `${(x * 12).toFixed(2)}deg`);
}

function resetScreenshot(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.removeProperty("--shot-tilt-x");
  event.currentTarget.style.removeProperty("--shot-tilt-y");
}

const screenshots = [
  "04DdcllWVeV0tVRpzHVKPqzwHaqVKXZn.jpg",
  "22nHyDeskAwe8awj7T2eUs9lFJlvVNYm.jpg",
  "ERkhlULHREK8ipeuHFGVXrfxywzZ1Vaf.jpg",
  "IA9WL4neIbJZYgu9RnW5pGrM8VdLW4Wl.jpg",
  "LciIKVZA3W3TiVcb6uRmnoRhtlfD6K9W.jpg",
  "UCjzMZGbceN38AqgIi1MeoRumnrAFTiF.jpg",
  "YGGRkcbjBQp1iBK1LUDJz4EK1G8h5T2w.jpg",
  "g8DSoGp6hr913P9R7hC9xivgjlQ1FMId.jpg",
  "hP3Se4nM2vBo0a37jUbaLwcmDzDYWyVY.jpg",
  "srJyMD74Ex3XosogMJgD3h5rS1LyYsw5.jpg",
  "v9i27gcNjRHaFeb3DnzDSKvTHuVkWYaO.jpg",
];

export function MobileGallery() {
  return (
    <div className="mobile-work">
      <div className="mobile-work__intro" data-reveal="copy">
        <p>I help small businesses and founders bring mobile app ideas to life - from an MVP to a product ready for the App Store.</p>
        <p>Whether you&apos;re starting with an idea or improving an existing product, I can help with development and publishing your app on the App Store.</p>
      </div>
      <div className="mobile-work__gallery" aria-label="Mobile app concept screenshots">
        {screenshots.map((file, index) => (
          <figure className="mobile-work__shot" key={file} data-reveal="gallery">
            <div className="mobile-work__shot-tilt" onPointerMove={tiltScreenshot} onPointerLeave={resetScreenshot}>
              <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? ""}/images/mob/${file}`}
              alt={`Mobile app concept screenshot ${index + 1}`}
              width={1320}
              height={2868}
              sizes="(max-width: 600px) 44vw, (max-width: 900px) 42vw, 34vw"
              unoptimized
              loading="lazy"
              />
            </div>
          </figure>
        ))}
      </div>
      <p className="mobile-work__note">* App screenshots are concepts developed and designed by me.</p>
    </div>
  );
}
