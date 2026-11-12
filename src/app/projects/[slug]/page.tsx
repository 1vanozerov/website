import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { portfolio } from "@/content/portfolio";
import { ProjectVisual } from "@/components/project-visual";
import { MobileGallery } from "@/components/mobile-gallery";
import { WebGallery } from "@/components/web-gallery";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SceneLink } from "@/components/route-transition";
import { InterfaceMotion } from "@/components/interface-motion";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return portfolio.projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolio.projects.find((item) => item.id === slug);
  return {
    title: project ? project.title : "Project",
    description: project?.category ?? "Project by Ivan Ozerov",
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = portfolio.projects.find((item) => item.id === slug);
  if (!project) notFound();

  return (
    <div className="site-content portfolio-site" id="top">
      <InterfaceMotion />
      <SiteHeader active="about" />
      <main>
        <section className="project-detail shell" data-scene-view="4">
          <SceneLink className="project-detail__back" href="/#work">
            ← Back to work
          </SceneLink>
          <div className="project-detail__head">
            <h1 data-reveal="title" data-signal="hero">{project.title}</h1>
            <p data-reveal="copy">{project.category}</p>
          </div>
          {project.id === "mobile" ? (
            <MobileGallery />
          ) : project.id === "website" ? (
            <WebGallery />
          ) : (
            <div className="project-detail__visual" data-reveal="project">
              <ProjectVisual project={project} />
            </div>
          )}
          {project.url && (
            <a
              className="project-detail__external"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open project ↗
            </a>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
