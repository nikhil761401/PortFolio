import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import FlowHorizontal from "@/components/FlowHorizontal";
import Reveal from "@/components/Reveal";
import CopyEmailButton from "@/components/CopyEmailButton";
import {
  profile,
  experience,
  projects,
  skillGroups,
  education,
  capabilities,
  researchFocus,
} from "@/lib/data";
import { siteConfig, withBasePath } from "@/lib/site";

const flagship = projects.find((p) => p.flagship);
const otherProjects = projects.filter((p) => !p.flagship);

const experienceRange = ["Python Development", "AI/ML Research", "AI Product Engineering"];

// Small line icons for the "What I build" cards — hand-drawn simple shapes
// (no icon library dependency), purely decorative so each card has a visual
// anchor instead of being just an eyebrow label + a sentence.
const buildIcons: Record<string, React.ReactNode> = {
  "Intelligent Products": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  ),
  "AI Systems": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="6" cy="12" r="2.25" />
      <circle cx="18" cy="6" r="2.25" />
      <circle cx="18" cy="18" r="2.25" />
      <path strokeLinecap="round" d="M8.1 11 15.9 7M8.1 13l7.8 4" />
    </svg>
  ),
  "Software Systems": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5 20.5 8 12 12.5 3.5 8Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 12 12 16.5 20.5 12" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 16 12 20.5 20.5 16" />
    </svg>
  ),
  Research: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path strokeLinecap="round" d="M15.3 15.3 21 21" />
    </svg>
  ),
};

// Shared type scale so every major section heading reads with the same
// weight and hierarchy — one consistent voice across the page instead of
// each section improvising its own size.
const sectionHeading = "text-3xl font-bold tracking-tight text-paper sm:text-4xl";
const sectionIntro = "text-base leading-relaxed text-paper/65 sm:text-lg";

// Hairline dividers for the 2x2 Technical Capabilities spec-sheet grid.
// Mobile stacks all four in one column (each after the first gets a top
// rule); desktop arranges 2x2, so column 2 needs a left rule instead of a
// top rule on its first row, and row 2 keeps its top rule in both layouts.
const skillDividers = [
  "",
  "border-t border-white/10 pt-10 lg:border-t-0 lg:border-l lg:border-white/10 lg:pl-16 lg:pt-0",
  "border-t border-white/10 pt-10",
  "border-t border-white/10 pt-10 lg:border-l lg:border-white/10 lg:pl-16",
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section id="top" className="scroll-mt-20 py-16 sm:py-24">
        <Container wide>
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/10 px-5 py-2.5">
                <span className="status-dot h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="font-mono text-base font-medium tracking-wide text-accent sm:text-lg">
                  Hi, I&apos;m {profile.name}
                </span>
                <span className="inline-flex items-end gap-1" aria-hidden="true">
                  <span className="dot-typing" style={{ animationDelay: "0ms" }} />
                  <span className="dot-typing" style={{ animationDelay: "200ms" }} />
                  <span className="dot-typing" style={{ animationDelay: "400ms" }} />
                </span>
              </div>
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight text-paper sm:text-5xl">
                {profile.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/70">
                {profile.bio}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#work"
                  className="rounded-md bg-accent px-6 py-3 text-base font-medium text-white transition-colors hover:bg-accent/90"
                >
                  See my work
                </a>
                <a
                  href="#contact"
                  className="rounded-md border border-white/15 px-6 py-3 text-base font-medium text-paper transition-colors hover:border-white/30"
                >
                  Get in touch
                </a>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative shrink-0">
                <div
                  aria-hidden="true"
                  className="avatar-glow absolute -inset-5 rounded-full bg-accent/20 blur-xl"
                />
                <div className="avatar-ring relative h-64 w-64 overflow-hidden rounded-full border-2 border-accent/40 sm:h-80 sm:w-80 lg:h-[28rem] lg:w-[28rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={withBasePath("/nikhil-profile.png")}
                    alt="Portrait of Nikhil"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* SELECTED WORK */}
      <section id="work" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-20">
        <Reveal>
          <Container wide>
            <h2 className={sectionHeading}>Selected work</h2>
            <p className={`mt-3 mb-10 max-w-2xl ${sectionIntro}`}>
              Three projects, three dimensions of engineering ability: product
              engineering, retrieval engineering, and agentic systems.
            </p>

            {flagship && (
              <div className="mb-6">
                <ProjectCard project={flagship} />
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {otherProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      {/* WHAT I BUILD */}
      <section className="border-t border-white/10 py-16 sm:py-20">
        <Reveal>
          <Container wide>
            <h2 className={sectionHeading}>What I build</h2>
            <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2">
              {capabilities.map((c) => (
                <div
                  key={c.title}
                  className="group relative z-0 bg-ink p-8 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:bg-white/[0.04] hover:shadow-[0_0_0_1px_rgba(91,140,255,0.4)] sm:p-10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent transition-colors duration-300 group-hover:border-accent/60">
                    <span className="h-5 w-5">{buildIcons[c.title]}</span>
                  </div>
                  <h3 className="mt-5 font-mono text-sm uppercase tracking-wider text-accent">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-paper/70">{c.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-20">
        <Reveal>
          <Container wide>
            <h2 className={sectionHeading}>Experience</h2>

            <div className="mt-10 mb-10 rounded-lg border border-white/10 bg-white/[0.02] px-6 py-6 sm:px-8">
              <p className="mb-5 font-mono text-[11px] uppercase tracking-wider text-paper/50">
                Range of engineering work
              </p>
              <FlowHorizontal steps={experienceRange} />
            </div>

            <ul className="space-y-5">
              {experience.map((e) => (
                <li
                  key={e.role + e.org}
                  className="group rounded-lg border-l-2 border-white/15 py-2 pl-6 pr-4 transition-colors duration-300 hover:border-accent hover:bg-white/[0.02]"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-paper">
                      {e.role} · {e.org}
                    </h3>
                    <span className="text-sm text-paper/60">{e.period}</span>
                  </div>
                  <p className="mt-1 text-sm text-paper/50">{e.location}</p>
                  <ul className="mt-4 space-y-2 text-base leading-relaxed text-paper/70">
                    {e.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Container>
        </Reveal>
      </section>

      {/* RESEARCH */}
      <section id="research" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-20">
        <Reveal>
          <Container wide>
            <h2 className={sectionHeading}>Research focus</h2>
            <p className="mt-4 max-w-2xl font-mono text-base text-accent">
              {researchFocus.pipeline.join(" → ")}
            </p>
            <p className={`mt-4 mb-10 max-w-2xl ${sectionIntro}`}>
              {researchFocus.description}
            </p>

            <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.02] px-6 py-7 sm:px-10">
              <FlowHorizontal steps={researchFocus.stages} />
            </div>
          </Container>
        </Reveal>
      </section>

      {/* TECHNICAL CAPABILITIES */}
      <section id="skills" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-20">
        <Reveal>
          <Container wide>
            <h2 className={sectionHeading}>Technical capabilities</h2>
            <p className={`mt-3 max-w-xl ${sectionIntro}`}>
              Systems, frameworks, and engineering foundations I use to build
              AI-powered products.
            </p>

            {/*
              A spec-sheet grid, not cards: each category gets equal width,
              equal padding, and equal heading hierarchy, separated by hairline
              rules rather than boxes. AI & LLM naturally has more technologies
              than Machine Learning — instead of forcing equal box heights (or
              artificially trimming content), the list simply runs longer as
              plain, dot-separated text, the same way a technical spec would
              present it.
            */}
            <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-2 lg:gap-x-24 lg:gap-y-16">
              {skillGroups.map((group, i) => (
                <div key={group.title} className={`group ${skillDividers[i]}`}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm text-accent/70 transition-colors duration-300 group-hover:text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-semibold text-paper transition-colors duration-300 group-hover:text-white sm:text-2xl">
                      {group.title}
                    </h3>
                  </div>
                  <div className="mt-4 h-px w-12 bg-white/15 transition-all duration-300 group-hover:w-20 group-hover:bg-accent/60" />
                  <p className="mt-4 max-w-md text-base text-paper/60">{group.description}</p>
                  <p className="mt-5 text-base leading-[1.9] text-paper/80 sm:text-lg">
                    {group.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </Reveal>
      </section>

      {/* EDUCATION */}
      <section id="education" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-20">
        <Reveal>
          <Container wide>
            <h2 className={sectionHeading}>Education</h2>
            <div className="group mt-10 flex flex-col gap-6 rounded-lg border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.04] sm:flex-row sm:items-center sm:p-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent transition-colors duration-300 group-hover:border-accent/60">
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 11v5c0 1.4 2.5 2.75 5.5 2.75s5.5-1.35 5.5-2.75v-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.5 9v6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-paper sm:text-2xl">{education.degree}</h3>
                <p className="mt-1.5 text-base text-paper/70">{education.org}</p>
                <p className="mt-1 text-sm text-paper/50">{education.year}</p>
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-20 border-t border-white/10 py-16 sm:py-24">
        <Reveal>
          <Container wide>
            <h2 className={sectionHeading}>Let&apos;s build something intelligent.</h2>
            <p className={`mt-4 max-w-xl ${sectionIntro}`}>
              Open to AI/ML engineering opportunities, research collaboration, and
              ambitious product ideas.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <a
                href={`mailto:${siteConfig.email}`}
                className="group flex flex-col gap-3 rounded-lg border border-white/10 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/[0.03]"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 7 8.5 6 8.5-6" />
                </svg>
                <span className="text-base font-medium text-paper group-hover:text-accent">Email</span>
                <span className="text-sm text-paper/60">{siteConfig.email}</span>
              </a>

              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 rounded-lg border border-white/10 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/[0.03]"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.24h4.5V23h-4.5V8.24ZM8.5 8.24h4.3v2.01h.06c.6-1.14 2.06-2.34 4.24-2.34 4.53 0 5.37 2.98 5.37 6.86V23h-4.5v-6.98c0-1.66-.03-3.8-2.32-3.8-2.32 0-2.68 1.81-2.68 3.68V23h-4.5V8.24Z" />
                </svg>
                <span className="text-base font-medium text-paper group-hover:text-accent">LinkedIn</span>
                <span className="text-sm text-paper/60">linkedin.com/in/nikhil761401</span>
              </a>

              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-3 rounded-lg border border-white/10 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-white/[0.03]"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.41-2.7 5.38-5.26 5.67.42.36.78 1.07.78 2.16v3.2c0 .3.21.66.79.55A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                <span className="text-base font-medium text-paper group-hover:text-accent">GitHub</span>
                <span className="text-sm text-paper/60">github.com/nikhil761401</span>
              </a>
            </div>

            <p className="mt-8 text-sm text-paper/50">
              Also reachable by phone:{" "}
              <a
                href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}
                className="text-paper/70 hover:text-accent"
              >
                {siteConfig.phone}
              </a>
            </p>
          </Container>
        </Reveal>
      </section>

      {/* END OF PAGE — a small, genuinely useful interactive moment for
          anyone who scrolls all the way down, rather than just a hard stop. */}
      <section className="border-t border-white/10 py-14">
        <Reveal>
          <Container wide>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-mono text-sm text-paper/50">
                You made it to the end — thanks for scrolling.
              </p>
              <CopyEmailButton email={siteConfig.email} />
            </div>
          </Container>
        </Reveal>
      </section>
    </>
  );
}
