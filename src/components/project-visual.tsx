import Image from "next/image";
import type { ClientProject } from "@/content/portfolio";

export function ProjectVisual({ project }: { project: ClientProject }) {
  return (
    <div className={`work-tile__media work-tile__media--${project.id}`}>
      {project.image ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? ""}${project.image}`}
          alt={`${project.title} preview`}
          fill
          unoptimized
          sizes="(max-width: 700px) 85vw, 52vw"
        />
      ) : (
        <div className="work-tile__geometry" aria-hidden="true" />
      )}
      <span className="work-tile__grain" aria-hidden="true" />
    </div>
  );
}
