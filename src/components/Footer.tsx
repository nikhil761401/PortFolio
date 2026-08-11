import Container from "./Container";
import { siteConfig } from "@/lib/site";
import { IconLinkedIn, IconGitHub, IconMail } from "./icons";

const quickLinksA = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
];

const quickLinksB = [
  { href: "#research", label: "Research" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline/10">
      <Container wide className="py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <a href="#top" className="font-mono text-sm tracking-tight text-paper hover:text-accent">
              nikhil<span className="text-accent">.</span>dev
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/70">
              AI/ML Engineer &amp; Researcher — building generative AI, retrieval,
              and agentic systems, from research to production.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline/15 text-paper/78 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <IconLinkedIn className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline/15 text-paper/78 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <IconGitHub className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline/15 text-paper/78 transition-colors hover:border-accent/40 hover:text-accent"
              >
                <IconMail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-paper">Quick Links</p>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {[...quickLinksA, ...quickLinksB].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-paper/70 transition-colors hover:text-paper"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-paper">Get in Touch</p>
            <p className="mt-4 text-sm text-paper/70">
              Email:{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-paper/85 hover:text-accent">
                {siteConfig.email}
              </a>
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full gradient-bg px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              Send a Message
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-hairline/10 pt-6 text-xs text-paper/60 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>Built with Next.js &amp; Tailwind CSS, deployed on GitHub Pages.</p>
        </div>
      </Container>
    </footer>
  );
}
