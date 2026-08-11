"use client";

import { useEffect, useState } from "react";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#about", label: "About", id: "about" },
  { href: "#work", label: "Work", id: "work" },
  { href: "#experience", label: "Experience", id: "experience" },
  { href: "#research", label: "Research", id: "research" },
  { href: "#skills", label: "Capabilities", id: "skills" },
  { href: "#education", label: "Education", id: "education" },
];

export default function Nav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Tracks whichever tracked section is currently most visible near the
    // top of the viewport, so the nav highlights where you actually are
    // while scrolling rather than only reacting to hash changes.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-hairline/10 bg-ink/80 backdrop-blur">
      <Container wide className="flex h-20 items-center justify-between gap-6">
        <nav aria-label="Primary" className="flex flex-1 gap-8 overflow-x-auto text-base sm:gap-10 sm:text-lg">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative whitespace-nowrap pb-1 font-medium transition-colors ${
                  isActive ? "text-accent" : "text-paper/78 hover:text-paper"
                }`}
              >
                {l.label}
                <span
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-accent transition-all duration-300 ${
                    isActive ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-4">
          <ThemeToggle />
          <a
            href="#contact"
            className="gradient-bg whitespace-nowrap rounded-full px-6 py-3 text-base font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
          >
            Let&apos;s Talk
          </a>
          <a
            href="#play"
            aria-label="Play the interactive demo"
            title="Play the interactive demo"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-accent2 bg-accent2/10 px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-accent2 shadow-[0_0_12px_rgba(139,92,246,0.55),0_0_24px_rgba(59,130,246,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(139,92,246,0.85),0_0_36px_rgba(59,130,246,0.4)]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-px" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </a>
        </div>
      </Container>
    </header>
  );
}
