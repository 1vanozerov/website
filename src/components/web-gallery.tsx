"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const assetBase = process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "";
const media = [
  { type: "video", file: "webm/e1.webm" },
  { type: "image", file: "BFOGcXoEiPd2aw5klTZKD3FZCgyrmZ9h.jpg" },
  { type: "video", file: "webm/e2.webm" },
  { type: "image", file: "rUSa0KXjspSpNnxhKETzDXjWCbcG7J8E.jpg" },
  { type: "video", file: "webm/e3.webm" },
  { type: "image", file: "almyB7ZCITt5NahoIMrtytg89eeloCSe.jpg" },
  { type: "video", file: "webm/e4.webm" },
  { type: "image", file: "JiGe4VIcrHNDKHkljK07jDN9XVD7eHu1.jpg" },
  { type: "image", file: "rlPaar08D5rbzW1dTtaKhNenFt8QZzNy.jpg" },
  { type: "image", file: "JrvNY6Q4T5yPunBv583WROdMignOe7tS.jpg" },
] as const;

export function WebGallery() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!playing || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % media.length), 8000);
    return () => window.clearInterval(timer);
  }, [playing, hovered, focused, reducedMotion]);

  const move = (direction: number) => setActive((index) => (index + direction + media.length) % media.length);
  const item = media[active];

  return (
    <div className="web-work">
      <div className="mobile-work__intro" data-reveal="copy">
        <p>I build websites that bring ideas, businesses, and products to life online.</p>
        <p>From a first impression to a fully featured online store, I create thoughtful web experiences that look good, work smoothly, and are easy to manage.</p>
      </div>

      <section className="web-case" aria-labelledby="web-case-title">
        <div className="web-case__heading" data-reveal="copy">
          <span className="web-case__number">01 / SELECTED WORK</span>
          <div>
            <h2 id="web-case-title">A modern online store &amp; portfolio, built with WordPress and Elementor.</h2>
            <p>A complete web experience combining product discovery, shopping, and a portfolio in one place.</p>
          </div>
        </div>
        <div
          className="web-case__gallery"
          role="region"
          aria-roledescription="carousel"
          aria-label="Online store and portfolio gallery"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
          }}
        >
          <div className="web-window">
            <div className="web-window__bar" aria-hidden="true">
              <span /><span /><span />
            </div>
            <div className="web-case__slide" key={item.file} role="group" aria-roledescription="slide" aria-label={`${active + 1} of ${media.length}`}>
              {item.type === "video" ? (
                <div className="web-case__video-crop">
                  <video autoPlay={!reducedMotion} muted loop playsInline preload="metadata" aria-label="Online store website in motion">
                    <source src={`${assetBase}/images/web/web1/${item.file}`} type="video/webm" />
                  </video>
                </div>
              ) : (
                <div className="web-case__video-crop">
                  <Image src={`${assetBase}/images/web/web1/${item.file}`} alt={`Online store and portfolio website, view ${active + 1}`} width={1920} height={1080} sizes="(max-width: 700px) 90vw, 85vw" unoptimized />
                </div>
              )}
            </div>
          </div>
          <div className="web-case__controls">
            <div className="web-case__count"><span>{String(active + 1).padStart(2, "0")}</span><span aria-hidden="true"> / </span>{String(media.length).padStart(2, "0")}</div>
            <div className="web-case__actions">
              {!reducedMotion && <button className="web-case__play" type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause automatic slideshow" : "Resume automatic slideshow"}>{playing ? "Pause" : "Play"}</button>}
              <button type="button" className="web-case__arrow" onClick={() => move(-1)} aria-label="Previous slide">←</button>
              <button type="button" className="web-case__arrow" onClick={() => move(1)} aria-label="Next slide">→</button>
            </div>
          </div>
          <div className="web-case__thumbnails" aria-label="Choose a gallery slide">
            {media.map((thumbnail, index) => (
              <button
                key={thumbnail.file}
                type="button"
                className="web-case__thumbnail"
                aria-label={thumbnail.type === "video" ? `Show video ${thumbnail.file.match(/e(\d)/)?.[1]}` : `Show screenshot ${index + 1}`}
                aria-current={active === index ? "true" : undefined}
                onClick={() => setActive(index)}
              >
                <Image
                  src={`${assetBase}/images/web/web1/${thumbnail.type === "video" ? thumbnail.file.replace(".webm", "-preview.jpg") : thumbnail.file}`}
                  alt=""
                  width={480}
                  height={270}
                  sizes="(max-width: 700px) 28vw, 12vw"
                  unoptimized
                />
                {thumbnail.type === "video" && <span className="web-case__thumbnail-play" aria-hidden="true">▶</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="web-case web-case--following" aria-labelledby="web-case-landing-title">
        <div className="web-case__heading" data-reveal="copy">
          <span className="web-case__number">02 / SELECTED WORK</span>
          <h2 id="web-case-landing-title">Simple Landing Page</h2>
          <p>A custom interactive website that brings the experience to life through playful, game-inspired interactions.</p>
        </div>
        <div className="web-case__gallery">
          <div className="web-window">
            <div className="web-window__bar" aria-hidden="true"><span /><span /><span /></div>
            <div className="web-case__video-crop">
              <video autoPlay={!reducedMotion} muted loop playsInline preload="metadata" aria-label="Interactive landing page in motion">
                <source src={`${assetBase}/images/web/web2/webm/home.webm`} type="video/webm" />
              </video>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
