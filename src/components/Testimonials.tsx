"use client";

import { useState } from "react";
import type { Testimonial } from "@/lib/data";

// A compact, full-width recommendation card — avatar/name/role sit in a
// fixed-width column on the left, the quote runs long horizontally on the
// right instead of everything being stacked and centered, and shown in
// full. Arrows and dot pagination only render once there's more than one
// testimonial to page through — with a single entry the card just sits
// still.
export default function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;
  const t = items[index];
  const initials = t.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  function goTo(i: number) {
    setIndex(i);
  }
  function prev() {
    goTo((index - 1 + items.length) % items.length);
  }
  function next() {
    goTo((index + 1) % items.length);
  }

  return (
    <div className="relative">
      <div className="w-full rounded-2xl border border-hairline/10 bg-surface/[0.02] shadow-sm p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex flex-none items-center gap-3 sm:w-56 sm:flex-col sm:items-start">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full gradient-bg text-sm font-bold text-white shadow-sm">
              {initials}
            </div>
            <div>
              <h3 className="text-sm font-bold text-paper">{t.name}</h3>
              <p className="mt-0.5 text-xs text-accent">{t.role}</p>
              <p className="mt-0.5 text-[11px] text-paper/45">
                {t.date} · {t.context}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-3 text-sm italic leading-relaxed text-paper/75">
            {t.quote.map((paragraph, i) => (
              <p key={i}>
                {i === 0 ? "“" : ""}
                {paragraph}
                {i === t.quote.length - 1 ? "”" : ""}
              </p>
            ))}
          </div>
        </div>

        {items.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 gradient-bg" : "w-1.5 bg-hairline/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute left-0 top-1/2 flex h-8 w-8 -translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border border-hairline/15 bg-ink text-paper/60 shadow-sm transition-colors hover:border-accent/40 hover:text-accent"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="absolute right-0 top-1/2 flex h-8 w-8 translate-x-3 -translate-y-1/2 items-center justify-center rounded-full border border-hairline/15 bg-ink text-paper/60 shadow-sm transition-colors hover:border-accent/40 hover:text-accent"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
