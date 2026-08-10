export const siteConfig = {
  name: "Nikhil",
  title: "Nikhil — AI/ML Engineer & Researcher",
  description:
    "AI/ML Engineer and Researcher specializing in Generative AI, LLM applications, RAG, and agentic AI.",
  url: "https://nikhil761401.github.io/PortFolio",
  email: "nikhil761401@gmail.com",
  phone: "+91-8368339387",
  linkedin: "https://www.linkedin.com/in/nikhil761401/",
  github: "https://github.com/nikhil761401",
};

/**
 * Prefixes a path in /public with the configured GitHub Pages base path so
 * assets resolve correctly both locally (no prefix) and once deployed
 * (prefixed with /PortFolio). Keep this in sync with next.config.mjs.
 */
export function withBasePath(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
