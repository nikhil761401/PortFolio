type FlowHorizontalProps = {
  steps: string[];
  className?: string;
};

/**
 * Decorative technical diagram: a labeled pipeline that stacks vertically on
 * small screens and lays out horizontally from `sm` up, using `display:
 * contents` so the connector participates directly in the parent flex row.
 */
export default function FlowHorizontal({ steps, className = "" }: FlowHorizontalProps) {
  return (
    <div
      role="img"
      aria-label={steps.join(" leads to ")}
      className={`flex flex-col sm:flex-row sm:items-center ${className}`}
    >
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col sm:contents">
          <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2.5 sm:text-center">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 font-mono text-xs text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-paper/82 sm:max-w-[8.5rem] sm:text-[13px]">
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="ml-[17px] my-2 block h-6 w-px flow-connector sm:my-0 sm:ml-0 sm:h-px sm:w-8 sm:flex-1 lg:w-12"
            />
          )}
        </div>
      ))}
    </div>
  );
}
