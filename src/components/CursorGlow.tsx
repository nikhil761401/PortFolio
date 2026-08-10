"use client";

import { useEffect, useRef } from "react";

/**
 * A soft ambient glow that trails the pointer, so the page feels reactive to
 * the cursor everywhere — not just on interactive elements. Purely visual:
 * fixed position, pointer-events disabled, sits behind all content via a
 * negative z-index. Hidden on touch devices (`.cursor-glow` has no pointer
 * to follow there) and under prefers-reduced-motion, both handled in CSS.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      el.classList.add("is-active");
    };
    const handleLeave = () => el.classList.remove("is-active");

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />;
}
