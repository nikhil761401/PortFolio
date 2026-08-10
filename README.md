# Nikhil — AI/ML Engineer & Researcher

## About

I'm Nikhil, an AI/ML engineer and researcher focused on applied generative AI —
retrieval-augmented systems, multi-agent architectures, and shipping AI products
that hold up outside a demo.

## Portfolio

This repository contains my personal AI/ML engineering portfolio: a single-page
Next.js site covering my profile, experience, research, projects, and technical
capabilities, deployed as a static site on GitHub Pages.

## Featured Projects

- **CrackAI** — AI Live Interview Platform. Production-scale AI interview platform using LLMs, AI personalization, and hybrid AI workflows; FastAPI services integrating AI interviews, resume analysis, and intelligent feedback on GCP. *(Flagship project.)*
- **Enterprise Knowledge Copilot** — Enterprise RAG platform with semantic search, document retrieval, and citation-backed AI responses; retrieval pipelines using embeddings, vector databases, reranking, and LangChain.
- **Multi-Agent AI Research Assistant** — Multi-agent AI system enabling collaborative reasoning, planning, and autonomous task execution; agent orchestration with LangGraph, MCP, tool calling, and memory.

Full details (tech stack, bullets) live in `src/lib/data.ts`.

## Experience

- **AI/ML Researcher** — Vellore Institute of Technology (Apr 2025 – Jul 2026)
- **Python Developer** — Meta Scifor Technologies (Jan 2024 – Apr 2025)

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, static export)
- TypeScript
- Tailwind CSS
- Deployed via GitHub Actions → GitHub Pages

## Running Locally

```bash
git clone https://github.com/nikhil761401/PortFolio.git
cd PortFolio
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Production Build

```bash
npm run build
```

This generates a static site in `out/` (via `next build` with `output: "export"`).

## Deployment

This site deploys automatically to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push
to `main`:

1. GitHub Actions checks out the repo, installs dependencies, and runs `npm run build`.
2. The static output in `out/` is uploaded as a Pages artifact.
3. GitHub Pages deploys it.

**One-time setup required in the GitHub UI:** in the repo, go to
**Settings → Pages → Build and deployment → Source**, and select
**GitHub Actions**.

The site is served from a project path (`/PortFolio`), configured in
[`next.config.mjs`](next.config.mjs) via the `REPO_NAME` constant — update
that one value if the repository is ever renamed.

Live URL once deployed: **https://nikhil761401.github.io/PortFolio/**
