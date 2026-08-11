import type { CSSProperties } from "react";
import Container from "@/components/Container";
import SectionHeader from "@/components/SectionHeader";
import ProjectCard from "@/components/ProjectCard";
import FlowHorizontal from "@/components/FlowHorizontal";
import Reveal from "@/components/Reveal";
import BouncePad from "@/components/BouncePad";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import {
  IconMail,
  IconPhone,
  IconLinkedIn,
  IconGitHub,
  IconGradCap,
  IconPin,
  IconCalendar,
  IconFlag,
  IconCheck,
  IconBriefcase,
  IconCode,
} from "@/components/icons";
import HeroBadges from "@/components/HeroBadges";
import {
  profile,
  experience,
  projects,
  skillGroups,
  education,
  capabilities,
  researchFocus,
  keyHighlights,
  testimonials,
} from "@/lib/data";
import { siteConfig, withBasePath } from "@/lib/site";

const flagship = projects.find((p) => p.flagship);
const otherProjects = projects.filter((p) => !p.flagship);

const experienceRange = ["Python Development", "AI/ML Research", "AI Product Engineering"];

// profile.headline is "Role | tag | tag" — split once here so the hero can
// give the role its own visual weight, without editing the underlying fact.
const [heroRole] = profile.headline.split(" | ");

// Status pill shows current role · organization, the same real fact already
// listed as the first entry in experience — not a new claim.
const heroStatus = `${experience[0].role} · ${experience[0].org}`;

// Alternating section background band — light, dark blue, light, dark blue
// as you scroll, instead of one flat shade for every section. This just
// overrides the local --ink-rgb custom property to the deeper "alt" shade
// defined in globals.css; every Tailwind bg-ink usage nested inside that
// section (including things like the "What I build" grid cells) picks it up
// automatically through normal CSS variable cascade, no per-component edits
// needed.
const darkBand = { "--ink-rgb": "var(--ink-alt-rgb)" } as CSSProperties;

// Focus-area tags for the hero, in place of small numeric stat boxes — the
// same specialization terms already used verbatim in profile.heroSummary,
// just surfaced as scannable tags instead of buried in a sentence.
const heroFocusAreas = ["Generative AI", "LLM Applications", "RAG", "Agentic AI"];

// Shared color-tag palette — reused for skill pills and research interest
// tags so different kinds of items get distinct, consistent colors instead
// of one flat tone everywhere.
const tagColor: Record<string, { bg: string; text: string }> = {
  accent: { bg: "bg-accent/10", text: "text-accent" },
  mint: { bg: "bg-mint/10", text: "text-mint" },
  accent2: { bg: "bg-accent2/10", text: "text-accent2" },
  gold: { bg: "bg-gold/10", text: "text-gold" },
};
const tagColorCycle = ["accent", "mint", "accent2", "gold"] as const;

// Each skill category gets its own consistent color across all its items —
// a different color per "kind of skill", not a random per-item cycle.
const skillGroupColor = ["accent", "mint", "accent2", "gold"] as const;

// Per-category card accents for Technical Capabilities — same card shell as
// ProjectCard (Selected Work), just with the top bar and hover border tinted
// to match each category's own color instead of always the blue-violet
// gradient used for projects.
const skillCardColor: Record<string, { bar: string; hoverBorder: string }> = {
  accent: { bar: "bg-accent", hoverBorder: "hover:border-accent/40" },
  mint: { bar: "bg-mint", hoverBorder: "hover:border-mint/40" },
  accent2: { bar: "bg-accent2", hoverBorder: "hover:border-accent2/40" },
  gold: { bar: "bg-gold", hoverBorder: "hover:border-gold/40" },
};

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

// Hero photo badges — exactly two fixed cards (top-right, bottom-left),
// matching the site's original static badge layout. Each card's own
// position never changes; only its content quietly cycles. Top-right mixes
// roles and skills (professional identity), bottom-left cycles projects —
// both pulled directly from the real experience/skillGroups/projects data.
// Each slot's first item is deliberately the strongest one — current role,
// flagship project — since that's what a first-time visitor sees before
// anything has had a chance to swap.
const heroBadgeSlots = [
  {
    position: "-right-2 top-6 sm:right-0 sm:top-10",
    items: [
      { kind: "Role", label: experience[0].role, icon: <IconBriefcase className="h-3.5 w-3.5" />, colorClass: "bg-mint/15 text-mint" },
      { kind: "Skill", label: "LangChain", icon: <IconCode className="h-3.5 w-3.5" />, colorClass: "bg-accent/15 text-accent" },
      { kind: "Role", label: experience[1].role, icon: <IconBriefcase className="h-3.5 w-3.5" />, colorClass: "bg-mint/15 text-mint" },
      { kind: "Skill", label: "RAG", icon: <IconCode className="h-3.5 w-3.5" />, colorClass: "bg-accent/15 text-accent" },
      { kind: "Skill", label: "Python", icon: <IconCode className="h-3.5 w-3.5" />, colorClass: "bg-accent/15 text-accent" },
    ],
  },
  {
    position: "-left-2 bottom-8 sm:left-0 sm:bottom-12",
    items: projects.map((p) => ({
      kind: "Project",
      label: p.name,
      icon: <IconFlag className="h-3.5 w-3.5" />,
      colorClass: "bg-accent2/15 text-accent2",
    })),
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section id="top" className="relative scroll-mt-20 overflow-hidden pb-16 pt-8 sm:pb-20 sm:pt-12">
        <div className="hero-wash" aria-hidden="true" />
        <Container wide>
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-hairline/10 bg-surface/[0.05] px-5 py-2.5">
                <span className="status-dot h-2.5 w-2.5 shrink-0 rounded-full bg-mint" aria-hidden="true" />
                <span className="text-base font-medium tracking-wide text-paper sm:text-lg">
                  {heroStatus}
                </span>
              </div>

              <p className="gradient-text text-6xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl">
                {profile.name}
              </p>
              <h1 className="mt-4 max-w-xl text-3xl font-bold leading-tight tracking-tight text-paper sm:text-4xl">
                {heroRole}
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/70">{profile.heroSummary}</p>

              <div className="mt-8 flex w-fit flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4">
                    <a
                      href={withBasePath("/nikhil-resume.pdf")}
                      download
                      className="inline-flex items-center gap-2 rounded-2xl gradient-bg px-8 py-4 text-lg font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0 4-4m-4 4-4-4M4 19.5h16" />
                      </svg>
                      Download Resume
                    </a>
                    <a
                      href={siteConfig.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-surface/[0.08] px-8 py-4 text-lg font-semibold text-paper transition-colors hover:bg-surface/[0.14]"
                    >
                      <IconLinkedIn className="h-5 w-5 text-accent" />
                      LinkedIn
                    </a>
                  </div>
                  <a
                    href="#contact"
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-hairline/15 px-8 py-4 text-lg font-semibold text-paper transition-colors hover:border-hairline/30"
                  >
                    <IconMail className="h-5 w-5" />
                    Connect with Me
                  </a>
                </div>

                <div className="w-full rounded-2xl border border-hairline/10 bg-surface/[0.05] shadow-sm px-5 py-4">
                  <p className="mb-3 font-mono text-xs uppercase tracking-wider text-paper/50">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {heroFocusAreas.map((area, i) => {
                      const c = tagColor[tagColorCycle[i % tagColorCycle.length]];
                      return (
                        <span key={area} className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${c.bg} ${c.text}`}>
                          {area}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative shrink-0">
                <div
                  aria-hidden="true"
                  className="absolute -inset-10 rounded-full border border-dashed border-accent/20"
                />
                <div
                  aria-hidden="true"
                  className="avatar-glow absolute -inset-5 rounded-full bg-accent/20 blur-xl"
                />
                <div className="avatar-ring relative h-80 w-80 overflow-hidden rounded-full border-2 border-accent/40 sm:h-[26rem] sm:w-[26rem] lg:h-[32rem] lg:w-[32rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={withBasePath("/nikhil-profile.png")}
                    alt="Portrait of Nikhil"
                    className="h-full w-full object-cover"
                  />
                </div>

                <HeroBadges slots={heroBadgeSlots} />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative scroll-mt-20 overflow-hidden border-t border-hairline/10 bg-ink py-16 sm:py-20">
        <div className="section-wash-1" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader
              title="About Me"
              description="AI/ML engineer and researcher dedicated to turning research into real, usable products."
            />

            <div className="mt-14 grid gap-6 text-base leading-relaxed text-paper/78 sm:text-lg lg:grid-cols-2 lg:gap-x-12">
              <p>{profile.bio}</p>
              <p>
                Currently working as an {experience[0].role} at {experience[0].org},
                after previously working as a {experience[1].role} at{" "}
                {experience[1].org}. Holds an {education.degree} from{" "}
                {education.org} ({education.year}) — {education.description.toLowerCase()}
              </p>
            </div>

            <div className="group relative mt-10 overflow-hidden rounded-2xl border border-hairline/10 bg-surface/[0.03] p-6 shadow-sm transition-all duration-300 hover:border-mint/30 hover:shadow-md sm:p-8">
              <span aria-hidden="true" className="gradient-bg absolute inset-x-0 top-0 h-1" />
              <p className="mb-6 flex items-center gap-3 text-base font-semibold text-paper">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint transition-transform duration-300 group-hover:scale-105">
                  <IconCheck className="h-4 w-4" />
                </span>
                Key Highlights
              </p>
              <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                {keyHighlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-base text-paper/78">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint">
                      <IconCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </Reveal>
      </section>

      {/* SELECTED WORK */}
      <section
        id="work"
        className="relative scroll-mt-20 overflow-hidden border-t border-hairline/10 bg-ink py-16 sm:py-20"
        style={darkBand}
      >
        <div className="section-wash-2" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader
              title="Selected work"
              description="Three projects, three dimensions of engineering ability: product engineering, retrieval engineering, and agentic systems."
              className="mb-12"
            />

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

      {/* WHAT I BUILD — reframed as a process, not a spec sheet: idea →
          intelligent product → AI system → engineered software → grounded
          in research, each stage numbered and colored using the same
          accent/mint/accent2/gold cycle as Technical Capabilities, connected
          by arrows so it reads as one continuous line of work instead of
          four disconnected facts. It closes with a live playable demo (the
          game that used to sit at the very bottom of the page) explicitly
          tied back to all four stages, so a visitor doesn't just read the
          claim, they get to test it. */}
      <section className="relative overflow-hidden border-t border-hairline/10 bg-ink py-16 sm:py-20">
        <div className="section-wash-3" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader
              title="What I build"
              description="Not four separate skills — one continuous line of work, from a raw idea to something you can actually put in front of people. Try the last part yourself, below."
            />

            <div className="mt-10 flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-0">
              {capabilities.map((c, i) => {
                const colorKey = skillGroupColor[i % skillGroupColor.length];
                const color = tagColor[colorKey];
                const cardColor = skillCardColor[colorKey];
                return (
                  <div key={c.title} className="flex flex-col gap-3 lg:contents">
                    <div
                      className={`group relative flex-1 overflow-hidden rounded-2xl border border-hairline/10 bg-surface/[0.02] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${cardColor.hoverBorder}`}
                    >
                      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${cardColor.bar}`} />
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs text-paper/35">{String(i + 1).padStart(2, "0")}</span>
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105 ${color.bg} ${color.text}`}
                        >
                          <span className="h-4 w-4">{buildIcons[c.title]}</span>
                        </div>
                      </div>
                      <h3 className="mt-4 text-base font-bold text-paper">{c.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-paper/65">{c.description}</p>
                    </div>

                    {i < capabilities.length - 1 && (
                      <span aria-hidden="true" className="flex items-center justify-center lg:px-2">
                        <span className="block h-6 w-px flow-connector lg:h-px lg:w-6" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div id="play" className="mt-8 scroll-mt-24 overflow-hidden rounded-2xl border border-accent/25 bg-surface/[0.03] shadow-sm">
              <div className="p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-wider text-accent">See it in action</p>
                <h3 className="mt-2 text-xl font-bold text-paper sm:text-2xl">Experience it yourself</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-paper/65">
                  An AI opponent reads the board and predicts what happens next, built on the same thinking behind
                  the work above. Play it yourself, or let the AI take over.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {capabilities.map((c, i) => {
                    const colorKey = skillGroupColor[i % skillGroupColor.length];
                    const color = tagColor[colorKey];
                    return (
                      <span
                        key={c.title}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${color.bg} ${color.text}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                        {c.title}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-hairline/10 bg-ink/40 p-6 sm:p-8">
                <BouncePad />
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      {/* EXPERIENCE */}
      <section
        id="experience"
        className="relative scroll-mt-20 overflow-hidden border-t border-hairline/10 bg-ink py-16 sm:py-20"
        style={darkBand}
      >
        <div className="section-wash-4" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader
              title="Experience"
              description="From backend engineering to applied AI research — a progression toward building and studying the systems that power intelligent products."
            />

            <div className="mt-12 mb-10 rounded-2xl border border-hairline/10 bg-surface/[0.02] shadow-sm px-6 py-6 sm:px-8">
              <p className="mb-5 font-mono text-[11px] uppercase tracking-wider text-paper/60">
                Range of engineering work
              </p>
              <FlowHorizontal steps={experienceRange} />
            </div>

            <ul className="space-y-6">
              {experience.map((e) => (
                <li
                  key={e.role + e.org}
                  className="group relative rounded-2xl border border-hairline/10 bg-surface/[0.02] shadow-sm p-6 pl-8 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 sm:p-8 sm:pl-10"
                >
                  <span
                    className="absolute left-0 top-8 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent ring-4 ring-ink"
                    aria-hidden="true"
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-paper">
                      {e.role} · {e.org}
                    </h3>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full border border-hairline/10 px-2.5 py-0.5 text-xs text-paper/70">
                      {e.period}
                    </span>
                    <span className="rounded-full border border-hairline/10 px-2.5 py-0.5 text-xs text-paper/70">
                      {e.location}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-base leading-relaxed text-paper/78">
                    {e.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <IconCheck className="mt-[3px] h-4 w-4 shrink-0 text-accent" />
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

      {/* RESEARCH — pipeline breadcrumb as connected pills (not plain
          arrow-joined text), a labeled "Research interests" tag cloud, and
          a labeled pipeline card matching the same card treatment used for
          Experience's "Range of engineering work", so the section reads as
          a deliberate sequence: focus → interests → process. */}
      <section id="research" className="relative scroll-mt-20 overflow-hidden border-t border-hairline/10 bg-ink py-16 sm:py-20">
        <div className="section-wash-1" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader title="Research focus" description={researchFocus.description} />

            <p className="mb-4 mt-10 text-center font-mono text-[11px] uppercase tracking-wider text-paper/55">
              Research interests
            </p>
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {researchFocus.interests.map((tag, i) => {
                const c = tagColor[tagColorCycle[i % tagColorCycle.length]];
                return (
                  <span key={tag} className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${c.bg} ${c.text}`}>
                    {tag}
                  </span>
                );
              })}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-hairline/10 bg-surface/[0.02] shadow-sm px-6 py-7 sm:px-10">
              <p className="mb-5 font-mono text-[11px] uppercase tracking-wider text-paper/60">Research pipeline</p>
              <FlowHorizontal steps={researchFocus.stages} />
            </div>
          </Container>
        </Reveal>
      </section>

      {/* TECHNICAL CAPABILITIES */}
      <section
        id="skills"
        className="relative scroll-mt-20 overflow-hidden border-t border-hairline/10 bg-ink py-16 sm:py-20"
        style={darkBand}
      >
        <div className="section-wash-2" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader
              title="Technical capabilities"
              description="Systems, frameworks, and engineering foundations I use to build AI-powered products."
            />

            {/*
              Each category gets its own full-width horizontal card — same
              shell as the Selected Work project cards (rounded border, soft
              surface tint, colored top bar, lift-on-hover), stacked one per
              row. The header pill sizes to its own text (never wraps, so a
              longer title like "Software Engineering" can't balloon into a
              two-line block) and sits inline with the skill tags on the same
              row; the description drops below as one quiet caption line
              instead of a second competing block, which keeps every card's
              rhythm even regardless of title length. Each skill cycles its
              own color independently of the category color, and no
              proficiency percentages (or skill counts) are shown — there's
              no honest number to put on an individual skill, so we don't
              invent one.
            */}
            <div className="mt-12 space-y-6">
              {skillGroups.map((group, i) => {
                const colorKey = skillGroupColor[i % skillGroupColor.length];
                const headerColor = tagColor[colorKey];
                const cardColor = skillCardColor[colorKey];
                return (
                  <div
                    key={group.title}
                    className={`group relative overflow-hidden rounded-2xl border border-hairline/10 bg-surface/[0.02] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8 ${cardColor.hoverBorder}`}
                  >
                    <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${cardColor.bar}`} />

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex flex-none items-center gap-2.5 whitespace-nowrap rounded-full px-5 py-2.5 text-lg font-bold ${headerColor.bg} ${headerColor.text}`}
                      >
                        <span className="font-mono text-sm opacity-70">{String(i + 1).padStart(2, "0")}</span>
                        {group.title}
                      </span>
                      <ul className="flex flex-1 flex-wrap gap-2.5">
                        {group.items.map((item, j) => {
                          const c = tagColor[tagColorCycle[j % tagColorCycle.length]];
                          return (
                            <li
                              key={item}
                              className={`rounded-full px-4 py-2 text-sm font-medium ${c.bg} ${c.text}`}
                            >
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <p className="mt-5 text-sm text-paper/50">{group.description}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </Reveal>
      </section>

      {/* EDUCATION */}
      <section id="education" className="relative scroll-mt-20 overflow-hidden border-t border-hairline/10 bg-ink py-16 sm:py-20">
        <div className="section-wash-3" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader
              title="Education"
              description="The formal grounding behind the engineering and research work above."
            />
            <div className="group relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-hairline/10 bg-surface/[0.02] shadow-sm p-8 transition-all duration-300 hover:-translate-y-1 hover:border-mint/40 hover:bg-surface/[0.04] sm:p-10">
              <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <IconGradCap />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-accent sm:text-3xl">{education.degree}</h3>
                  <p className="mt-2 text-lg font-semibold text-mint">{education.org}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-paper/60">
                    <span className="flex items-center gap-2">
                      <IconPin className="h-4 w-4 shrink-0" />
                      {education.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <IconCalendar className="h-4 w-4 shrink-0" />
                      {education.year}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-hairline/10 pt-6">
                <p className="text-base leading-relaxed text-paper/70">{education.description}</p>
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

      {/* TESTIMONIALS — kept short (compact padding, clamped quote behind a
          Read more toggle) so it doesn't read as a big empty block before
          Contact; the card runs long horizontally rather than a centered
          narrow box. */}
      <section id="testimonials" className="relative scroll-mt-20 overflow-hidden border-t border-hairline/10 bg-ink py-10 sm:py-14" style={darkBand}>
        <div className="section-wash-1" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader title="What people say" description="A recommendation from a colleague I worked with." />
            <div className="mt-8">
              <Testimonials items={testimonials} />
            </div>
          </Container>
        </Reveal>
      </section>

      {/* CONTACT — light band, following the alternating rhythm above
          (Testimonials right before it is dark) rather than a forced
          override. */}
      <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-hairline/10 bg-ink py-16 sm:py-24">
        <div className="section-wash-4" aria-hidden="true" />
        <Reveal>
          <Container wide>
            <SectionHeader
              title="Let's build something intelligent."
              description="Open to AI/ML engineering opportunities, research collaboration, and ambitious product ideas."
            />

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-surface/[0.03] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_0_36px_rgba(59,130,246,0.16)] sm:p-8">
                <span aria-hidden="true" className="gradient-bg absolute inset-x-0 top-0 h-1" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent2/10 blur-3xl transition-opacity duration-300 group-hover:opacity-80"
                />

                <div className="relative flex flex-wrap items-center justify-between gap-3">
                  <h3 className="gradient-text text-xl font-bold">Contact Information</h3>
                  <span className="inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[11px] font-semibold text-mint">
                    <span className="status-dot h-1.5 w-1.5 shrink-0 rounded-full bg-mint" aria-hidden="true" />
                    Open to opportunities
                  </span>
                </div>

                <ul className="relative mt-8 space-y-5">
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent shadow-[0_0_0_1px_rgb(var(--accent-rgb)/0.3)] transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(59,130,246,0.55)]">
                      <IconMail className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-paper/50">Email</span>
                      <a href={`mailto:${siteConfig.email}`} className="text-sm font-medium text-paper transition-colors hover:text-accent">
                        {siteConfig.email}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mint/10 text-mint shadow-[0_0_0_1px_rgb(var(--mint-rgb)/0.3)] transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(45,212,191,0.55)]">
                      <IconPhone className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-paper/50">Phone</span>
                      <a
                        href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`}
                        className="text-sm font-medium text-paper transition-colors hover:text-mint"
                      >
                        {siteConfig.phone}
                      </a>
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent2/10 text-accent2 shadow-[0_0_0_1px_rgb(var(--accent2-rgb)/0.3)] transition-all duration-300 group-hover:shadow-[0_0_18px_rgba(139,92,246,0.55)]">
                      <IconLinkedIn className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-wide text-paper/50">LinkedIn</span>
                      <a
                        href={siteConfig.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-paper transition-colors hover:text-accent2"
                      >
                        Connect on LinkedIn
                      </a>
                    </span>
                  </li>
                </ul>

                <div className="relative mt-8 rounded-xl border-l-2 border-accent/50 bg-ink/40 py-3 pl-4 pr-3">
                  <p className="text-sm italic leading-relaxed text-paper/65">
                    &#8220;Open to AI/ML engineering opportunities, research collaboration, and ambitious product
                    ideas.&#8221;
                  </p>
                </div>

                <p className="relative mb-3 mt-8 text-xs uppercase tracking-wide text-paper/50">Connect</p>
                <div className="relative flex gap-3">
                  <a
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-accent2/25 text-paper/78 transition-all hover:border-accent2 hover:text-accent2 hover:shadow-[0_0_14px_rgba(139,92,246,0.5)]"
                  >
                    <IconLinkedIn className="h-4 w-4" />
                  </a>
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/25 text-paper/78 transition-all hover:border-accent hover:text-accent hover:shadow-[0_0_14px_rgba(59,130,246,0.5)]"
                  >
                    <IconGitHub className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-hairline/10 bg-surface/[0.02] shadow-sm p-6 sm:p-8">
                <h3 className="mb-6 text-lg font-semibold text-paper">Send a Message</h3>
                <ContactForm email={siteConfig.email} />
              </div>
            </div>
          </Container>
        </Reveal>
      </section>

    </>
  );
}
