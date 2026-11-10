"use client";

import { useEffect } from "react";

/**
 * One-shot, compositor-friendly entrance animations for the editorial pages.
 * The HTML stays readable without JS, and reduced-motion users see static copy.
 */
export function InterfaceMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".portfolio-site");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const elements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target as HTMLElement;
          element.classList.add("is-revealed");
          observer.unobserve(element);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );

    root.classList.add("motion-ready");
    for (const element of elements) observer.observe(element);

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
