"use client";

import type { PointerEvent } from "react";
import { ParticleText } from "@/components/particle-intro";
import { SceneLink } from "@/components/route-transition";
import { ProjectVisual } from "@/components/project-visual";
import type { ClientProject } from "@/content/portfolio";

function tilt(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  event.currentTarget.style.setProperty("--tilt-x", `${(-y * 9).toFixed(2)}deg`);
  event.currentTarget.style.setProperty("--tilt-y", `${(x * 12).toFixed(2)}deg`);
}

function resetTilt(event: PointerEvent<HTMLAnchorElement>) {
  event.currentTarget.style.removeProperty("--tilt-x");
  event.currentTarget.style.removeProperty("--tilt-y");
}

export function ProjectCarousel({ projects }: { projects: ClientProject[] }) {
  return (
    <div className="project-gallery shell">
      <div className="project-gallery__heading">
        <h2 id="work-title" data-reveal="heading" data-signal="section">
          <ParticleText text="Selected" /><br /><ParticleText text="work" /><span>.</span>
        </h2>
      </div>
      <div className="project-gallery__grid">
        {projects.map((project) => (
          <article className={`project-gallery__item project-gallery__item--${project.id}`} key={project.id} data-reveal="project">
            <SceneLink
              className="project-gallery__link"
              href={`/projects/${project.id}`}
              onPointerMove={tilt}
              onPointerLeave={resetTilt}
            >
              <div className="project-gallery__stage">
                <div className="project-gallery__object">
                  <div className="project-gallery__face project-gallery__face--side" />
                  <div className="project-gallery__face project-gallery__face--top" />
                  <div className="project-gallery__face project-gallery__face--front">
                    <ProjectVisual project={project} />
                  </div>
                </div>
                <span className="project-gallery__arrow" aria-hidden="true">↗</span>
              </div>
              <div className="project-gallery__meta">
                <h3><ParticleText text={project.title} /></h3>
                <p><ParticleText text={project.category} /></p>
              </div>
            </SceneLink>
          </article>
        ))}
      </div>
    </div>
  );
}
