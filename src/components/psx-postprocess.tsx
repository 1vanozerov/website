"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  Camera,
  DepthFormat,
  DepthTexture,
  Matrix4,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  UnsignedShortType,
  Vector2,
  Vector3,
  WebGLRenderTarget,
} from "three";

/**
 * PSX low-resolution rendering, light Bayer dithering and WORLD-SPACE black fog.
 *
 * The previous fog was made with finite quads plus a screen-bottom gradient.
 * Their hard edges moved across the image when the camera flew between sectors.
 * This version reconstructs world positions from the depth buffer and integrates
 * black fog along the camera ray: no fog planes, no screen-space cutoff.
 */
export function PsxPostProcess() {
  const { size, invalidate } = useThree();

  const pass = useMemo(() => {
    const depthTexture = new DepthTexture(1, 1, UnsignedShortType);
    depthTexture.format = DepthFormat;
    depthTexture.minFilter = NearestFilter;
    depthTexture.magFilter = NearestFilter;

    const target = new WebGLRenderTarget(1, 1, {
      minFilter: NearestFilter,
      magFilter: NearestFilter,
      depthBuffer: true,
      depthTexture,
      stencilBuffer: false,
      generateMipmaps: false,
      samples: 0,
    });

    const cameraPosition = { value: new Vector3() };
    const inverseViewProjection = { value: new Matrix4() };
    const interference = { value: 0 };
    const material = new ShaderMaterial({
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
      uniforms: {
        uScene: { value: target.texture },
        uDepth: { value: depthTexture },
        uLowResolution: { value: new Vector2(1, 1) },
        uCameraPosition: cameraPosition,
        uInverseViewProjection: inverseViewProjection,
        uInterference: interference,
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform sampler2D uScene;
        uniform sampler2D uDepth;
        uniform vec2 uLowResolution;
        uniform vec3 uCameraPosition;
        uniform mat4 uInverseViewProjection;
        uniform float uInterference;
        varying vec2 vUv;

        float hash21(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float bayer2(vec2 p) {
          if (p.y < 0.5) return p.x < 0.5 ? 0.0 : 2.0;
          return p.x < 0.5 ? 3.0 : 1.0;
        }

        float bayer4(vec2 pixel) {
          vec2 p = mod(pixel, 4.0);
          return (4.0 * bayer2(mod(p, 2.0)) +
                  bayer2(floor(p / 2.0))) / 16.0;
        }

        // Fog is fixed in world coordinates, tied to the foundations.
        // Tall towers remain visible above the black abyss.
        float groundDensity(float height) {
          float band = 1.0 - smoothstep(-115.0, 127.0, height);
          return band * band;
        }

        float blackFogAmount(vec2 uv) {
          float depth = texture2D(uDepth, uv).r;
          vec4 ndcPosition = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
          vec4 worldPosition = uInverseViewProjection * ndcPosition;
          vec3 hit = worldPosition.xyz / worldPosition.w;
          vec3 cameraRay = hit - uCameraPosition;
          float lengthOfRay = min(length(cameraRay), 1120.0);

          // Three samples retain the soft depth gradient at lower GPU cost.
          float integratedDensity = 0.0;
          for (int i = 0; i < 3; i++) {
            float t = (float(i) + 0.5) / 3.0;
            float sampleHeight = mix(uCameraPosition.y, hit.y, t);
            integratedDensity += groundDensity(sampleHeight);
          }

          integratedDensity /= 3.0;
          return clamp(1.0 - exp(-lengthOfRay * integratedDensity * 0.03), 0.0, 1.0);
        }

        void main() {
          vec2 pixel = floor(vUv * uLowResolution);
          vec2 uv = (pixel + 0.5) / uLowResolution;

          // Short screen-signal fault on section entrance. The horizontal
          // pixel shift follows coarse scanline groups for a PS1-like dropout.
          float scanGroup = floor(pixel.y * 0.13);
          float faultStripe = step(0.73, hash21(vec2(scanGroup, 29.0)));
          float faultDrift = (hash21(vec2(scanGroup, 47.0)) - 0.5) *
            faultStripe * uInterference * 12.0;
          vec2 sampleUv = vec2(
            clamp(uv.x + faultDrift / uLowResolution.x, 0.001, 0.999),
            uv.y
          );
          vec3 color = texture2D(uScene, sampleUv).rgb;

          // Black fog uses world-space ray depth - camera altitude and
          // viewport shape cannot create rectangular clipping edges.
          float fogAmount = blackFogAmount(sampleUv);

          // Fully black, not charcoal or dark gray, and never white noise
          // where the fog has reached full density.
          color *= (1.0 - fogAmount);

          float gray = dot(color, vec3(0.299, 0.587, 0.114));
          float pattern = (bayer4(pixel) - 0.5) *
            (0.17 + 0.12 * uInterference);
          float dirt = (hash21(pixel * 1.37 + 19.0) - 0.5) * 0.042;
          float value = clamp(gray + (pattern + dirt) * (1.0 - fogAmount), 0.0, 1.0);

          const float shades = 8.0;
          value = floor(value * (shades - 1.0) + 0.5) / (shades - 1.0);

          float scanline = mod(pixel.y, 3.0) < 1.0 ? 0.955 : 1.0;
          vec2 vignetteEdge = vUv * (1.0 - vUv);
          float vignette = pow(clamp(16.0 * vignetteEdge.x * vignetteEdge.y, 0.0, 1.0), 0.12);
          value *= scanline * mix(0.74, 1.0, vignette);

          // Intermittent bright/dark strips during the short glitch envelope.
          float signalBand = step(0.90, hash21(vec2(scanGroup, 84.0)));
          value = mix(value, value * 0.56, signalBand * uInterference);

          float fineGrain = (hash21(gl_FragCoord.xy * 0.83) - 0.5) * 0.022;
          value = clamp(value + fineGrain * (1.0 - fogAmount), 0.0, 1.0);
          gl_FragColor = vec4(vec3(value), 1.0);
        }
      `,
    });

    const geometry = new PlaneGeometry(2, 2);
    const quad = new Mesh(geometry, material);
    quad.frustumCulled = false;

    const screen = new Scene();
    screen.add(quad);

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    return {
      target,
      depthTexture,
      material,
      geometry,
      screen,
      camera,
      triggerInterference(intensity: number) {
        interference.value = Math.max(
          interference.value,
          Math.max(0, Math.min(1, intensity)),
        );
      },
      decayInterference(delta: number) {
        interference.value = Math.max(
          0,
          interference.value - Math.min(delta, 0.1) * 2.0,
        );
        return interference.value > 0;
      },
      syncCamera(viewCamera: Camera) {
        cameraPosition.value.copy(viewCamera.position);
        inverseViewProjection.value.multiplyMatrices(
          viewCamera.matrixWorld,
          viewCamera.projectionMatrixInverse,
        );
      },
    };
  }, []);

  useEffect(() => {
    // The PSX effect uses a small render target; mobile has a lower cap.
    const ratio = size.width < 800 ? 0.64 : 0.76;
    const scale = Math.min(ratio, 1150 / Math.max(1, size.width));
    const width = Math.max(1, Math.round(size.width * scale));
    const height = Math.max(1, Math.round(size.height * scale));

    pass.target.setSize(width, height);
    pass.material.uniforms.uLowResolution.value.set(width, height);
    invalidate();
  }, [size.width, size.height, pass, invalidate]);

  useEffect(() => {
    return () => {
      pass.target.dispose();
      pass.depthTexture.dispose();
      pass.geometry.dispose();
      pass.material.dispose();
    };
  }, [pass]);

  useEffect(() => {
    const onInterference = (event: Event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const intensity = (event as CustomEvent<{ intensity: number }>).detail?.intensity ?? 0.5;
      pass.triggerInterference(intensity);
      invalidate();
    };

    window.addEventListener("megascene:interference", onInterference);
    return () => window.removeEventListener("megascene:interference", onInterference);
  }, [pass, invalidate]);

  // Priority 1 takes over rendering, and only runs when the scene invalidates.
  useFrame(({ gl, scene, camera }, delta) => {
    if (pass.decayInterference(delta)) invalidate();
    const previousTarget = gl.getRenderTarget();

    gl.setRenderTarget(pass.target);
    gl.clear(true, true, true);
    gl.render(scene, camera);

    // matrixWorld is up-to-date only AFTER the scene render.
    pass.syncCamera(camera);

    gl.setRenderTarget(null);
    gl.clear(true, true, true);
    gl.render(pass.screen, pass.camera);

    gl.setRenderTarget(previousTarget);
  }, 1);

  return null;
}
