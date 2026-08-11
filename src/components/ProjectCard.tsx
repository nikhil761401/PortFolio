import type { Project } from "@/lib/data";

// Tech-tag colors cycle through the site's controlled accent palette instead
// of one flat gray tone — real tag names, just distributed across colors for
// scanability, the same way the reference project cards do.
const tagPalette = [
  { bg: "bg-accent/10", text: "text-accent" },
  { bg: "bg-mint/10", text: "text-mint" },
  { bg: "bg-accent2/10", text: "text-accent2" },
  { bg: "bg-gold/10", text: "text-gold" },
];

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-10 ${
        project.flagship
          ? "border-accent/30 bg-surface/[0.04] hover:border-accent/50"
          : "border-hairline/10 bg-surface/[0.02] hover:border-hairline/20"
      }`}
    >
      <span aria-hidden="true" className="gradient-bg absolute inset-x-0 top-0 h-1" />

      {project.flagship && (
        <span className="absolute right-6 top-7 flex items-center gap-1 rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden="true">
            <path d="M12 2.5 14.7 9l7 .6-5.3 4.6 1.6 6.8L12 17.7 5.9 21l1.7-6.8-5.4-4.6 7-.6L12 2.5Z" />
          </svg>
          Featured
        </span>
      )}

      <h3 className={`text-2xl font-bold text-paper sm:text-3xl ${project.flagship ? "pr-24" : ""}`}>
        {project.name}
      </h3>
      <p className="mt-1.5 text-base text-paper/65">{project.headline}</p>

      <ul className="mt-5 space-y-2.5 text-base leading-relaxed text-paper/85">
        {project.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((s, i) => {
          const palette = tagPalette[i % tagPalette.length];
          return (
            <li key={s} className={`rounded-full px-3 py-1 text-sm font-medium ${palette.bg} ${palette.text}`}>
              {s}
            </li>
          );
        })}
      </ul>

      <p className="mt-6 flex items-center gap-2.5 text-sm font-medium text-mint">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" aria-hidden="true" />
        {project.capability}
      </p>
    </div>
  );
}
