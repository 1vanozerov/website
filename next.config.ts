import type { NextConfig } from "next";

// GitHub Actions provides GITHUB_REPOSITORY="owner/repo".
// Project sites need /repo; user/org sites (owner.github.io) do not.
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isProjectPages =
  process.env.GITHUB_ACTIONS === "true" &&
  repoName !== "" &&
  !repoName.endsWith(".github.io");

const basePath = isProjectPages ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  // Allow the development server to load its resources on devices on this LAN.
  allowedDevOrigins: ["172.20.10.2"],
  output: "export",
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_ASSET_BASE_PATH: basePath },
  images: { unoptimized: true },
};

export default nextConfig;
