import type { ReactNode } from "react";

export type BadgeItem = {
  kind: string;
  label: string;
  icon: ReactNode;
  colorClass: string;
};

export type BadgeSlot = {
  items: BadgeItem[];
  /** Tailwind positioning classes — each slot sits in a fixed spot around
   * the hero photo and never moves; only its content changes. */
  position: string;
};

// How long each item stays on screen before the next one takes its turn.
// The badge-cycle-N-* keyframes (globals.css) divide a slot's full cycle
// into N even turns, so this is "seconds per item", not the total loop.
const DWELL_SECONDS = 12;

// Two small, fixed badges around the hero photo — top-right and
// bottom-left, never moving and never fully disappearing. The outer card
// (border, background, shadow) is a single persistent element per slot;
// only the icon and text swap underneath it, so it always reads as "the
// same card, new content" rather than a card popping away and back.
export default function HeroBadges({ slots }: { slots: BadgeSlot[] }) {
  return (
    <>
      {slots.map((slot, i) => {
        const n = slot.items.length;
        return (
          <div
            key={i}
            className={`absolute ${slot.position} flex h-[52px] w-[152px] items-center gap-2.5 rounded-xl border border-hairline/15 bg-ink/90 px-2.5 shadow-lg backdrop-blur sm:h-[58px] sm:w-[168px]`}
            aria-hidden="true"
          >
            <span className="relative h-7 w-7 shrink-0">
              {slot.items.map((item, j) => (
                <span
                  key={item.label}
                  className={`badge-cycle absolute inset-0 flex items-center justify-center rounded-full ${item.colorClass}`}
                  style={{ animation: `badge-cycle-${n}-${j} ${DWELL_SECONDS * n}s ease-in-out infinite` }}
                >
                  {item.icon}
                </span>
              ))}
            </span>
            <span className="relative h-8 flex-1">
              {slot.items.map((item, j) => (
                <span
                  key={item.label}
                  className="badge-cycle absolute inset-0 flex flex-col justify-center"
                  style={{ animation: `badge-cycle-${n}-${j} ${DWELL_SECONDS * n}s ease-in-out infinite` }}
                >
                  <span className="block text-[9px] uppercase tracking-wide text-paper/50">{item.kind}</span>
                  <span className="block truncate text-[11px] font-semibold leading-snug text-paper">
                    {item.label}
                  </span>
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </>
  );
}
