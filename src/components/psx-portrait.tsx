"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import portrait from "../../public/images/me.png";

export function PsxPortrait() {
  const image = useRef<HTMLImageElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  const processImage = useCallback(() => {
    const source = image.current;
    const target = canvas.current;
    if (!source || !target || !source.naturalWidth) return;

    const context = target.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const size = 360;
    target.width = size;
    target.height = size;

    const crop = Math.min(source.naturalWidth, source.naturalHeight);
    context.imageSmoothingEnabled = true;
    context.drawImage(
      source,
      (source.naturalWidth - crop) / 2,
      (source.naturalHeight - crop) / 2,
      crop,
      crop,
      0,
      0,
      size,
      size,
    );

    const pixels = context.getImageData(0, 0, size, size);
    const data = pixels.data;
    const bayer = [
      0, 8, 2, 10,
      12, 4, 14, 6,
      3, 11, 1, 9,
      15, 7, 13, 5,
    ];
    const levels = 9;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const gray = (
          data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
        ) / 255;
        // Preserve this photo's high-key face instead of clipping it
        // into a bright square against the dark 3D background.
        const luminance = Math.min(1, Math.max(0, gray * 0.81 + 0.12));
        const threshold = (bayer[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * 0.085;
        const shade = Math.round(
          Math.min(1, Math.max(0, Math.round(
            Math.min(1, Math.max(0, luminance + threshold)) * (levels - 1),
          ) / (levels - 1))) * 255,
        );

        data[i] = shade;
        data[i + 1] = shade;
        data[i + 2] = shade;
        data[i + 3] = 255;
      }
    }
    context.putImageData(pixels, 0, 0);
    setReady(true);
  }, []);

  useEffect(() => {
    if (image.current?.complete && image.current.naturalWidth) processImage();
  }, [processImage]);

  return (
    <figure className={`psx-portrait${ready ? " psx-portrait--ready" : ""}`}>
      <div className="psx-portrait__visual">
        <Image
          ref={image}
          src={portrait}
          alt="Ivan Ozerov"
          fill
          priority
          sizes="(max-width: 720px) 70vw, (max-width: 1100px) 48vw, 580px"
          onLoad={processImage}
        />
        <canvas
          ref={canvas}
          className="psx-portrait__canvas"
          aria-hidden="true"
          width={360}
          height={360}
        />
        <span className="psx-portrait__scan" aria-hidden="true" />
      </div>
    </figure>
  );
}
