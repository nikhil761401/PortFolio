type FlowVerticalProps = {
  steps: string[];
  className?: string;
};

/**
 * Decorative technical diagram: vertical stack of labeled nodes connected by
 * a subtly pulsing line. Purely presentational — respects prefers-reduced-motion
 * via the .flow-connector animation defined in globals.css.
 */
export default function FlowVertical({ steps, className = "" }: FlowVerticalProps) {
  return (
    <div
      role="img"
      aria-label={steps.join(" leads to ")}
      className={`inline-flex flex-col ${className}`}
    >
      {steps.map((step, i) => (
        <div key={step}>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-paper/80">
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="ml-[17px] block h-10 w-px flow-connector" />
          )}
        </div>
      ))}
    </div>
  );
}
