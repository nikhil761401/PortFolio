import type { Project } from "@/lib/data";

const dimensionIndex: Record<string, string> = {
  crackai: "01",
  "knowledge-copilot": "02",
  "multi-agent": "03",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className={`group rounded-lg border p-7 transition-all duration-300 hover:-translate-y-1 sm:p-10 ${
        project.flagship
          ? "border-accent/40 bg-gradient-to-br from-accent/[0.08] to-transparent hover:border-accent/60"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm text-paper/45">{dimensionIndex[project.slug]}</span>
          <span className="font-mono text-sm uppercase tracking-wider text-accent">
            {project.capability}
          </span>
        </div>
        {project.flagship && (
          <span className="rounded-full bg-accent px-3 py-1 text-sm font-medium text-white">
            Flagship
          </span>
        )}
      </div>

      <h3 className="text-2xl font-semibold text-paper sm:text-3xl">{project.name}</h3>
      <p className="mt-1.5 text-base text-paper/60">{project.headline}</p>

      <ul className="mt-6 space-y-2.5 text-base leading-relaxed text-paper/75">
        {project.bullets.map((b) => (
          <li key={b} className="flex gap-3">
            <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <li
            key={s}
            className="rounded border border-white/10 px-3 py-1 text-sm text-paper/65 transition-colors group-hover:border-white/20"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
