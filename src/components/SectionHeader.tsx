/**
 * Shared section-header pattern used at the top of every major section:
 * a centered bold title, a short gradient accent line beneath it, and an
 * optional centered muted description. Reused consistently instead of each
 * section improvising its own heading layout.
 */
export default function SectionHeader({
  title,
  description,
  className = "",
}: {
  title: string;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      <h2 className="text-3xl font-bold tracking-tight text-paper sm:text-4xl">{title}</h2>
      <span
        className="gradient-bg mx-auto mt-4 block h-1 w-16 rounded-full"
        aria-hidden="true"
      />
      {description && (
        <p className="mt-5 text-base leading-relaxed text-paper/75 sm:text-lg">{description}</p>
      )}
    </div>
  );
}
