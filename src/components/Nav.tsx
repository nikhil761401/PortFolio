import Container from "./Container";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#research", label: "Research" },
  { href: "#skills", label: "Capabilities" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur">
      <Container wide className="flex h-16 items-center justify-between">
        <a
          href="#top"
          className="font-mono text-sm tracking-tight text-paper hover:text-accent"
        >
          nikhil<span className="text-accent">.</span>dev
        </a>
        <nav aria-label="Primary" className="flex gap-6 overflow-x-auto text-[15px]">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="whitespace-nowrap text-paper/70 transition-colors hover:text-paper"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </Container>
    </header>
  );
}
