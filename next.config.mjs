/**
 * ---------------------------------------------------------------------------
 * GitHub Pages configuration
 * ---------------------------------------------------------------------------
 * This repo is deployed as a PROJECT site (not a <user>.github.io root site),
 * so GitHub Pages serves it from a sub-path: https://<user>.github.io/<repo>/
 *
 * If you rename the GitHub repository, update REPO_NAME below — that is the
 * ONLY place the deployment path is defined. Everything else (basePath,
 * assetPrefix, the GitHub Actions workflow) reads from this single constant.
 *
 * If you ever move this to a root user/organization site (repo named
 * "<username>.github.io"), set REPO_NAME to an empty string instead.
 */
const REPO_NAME = "PortFolio";

const isProd = process.env.NODE_ENV === "production";
const basePath = isProd && REPO_NAME ? `/${REPO_NAME}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
