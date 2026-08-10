import Container from "./Container";
import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 text-sm text-paper/60">
      <Container wide className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js, deployed on GitHub Pages.
        </p>
        <div className="flex gap-4">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="hover:text-paper">GitHub</a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-paper">LinkedIn</a>
          <a href={`mailto:${siteConfig.email}`} className="hover:text-paper">Email</a>
        </div>
      </Container>
    </footer>
  );
}
