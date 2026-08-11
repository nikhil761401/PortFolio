"use client";

import { useEffect, useState } from "react";

/**
 * Sun/moon toggle. Theme state lives as a `data-theme` attribute on <html>
 * (read by the CSS variables in globals.css) and is persisted to
 * localStorage. A blocking inline script in layout.tsx sets the initial
 * attribute before paint, so there's no flash of the wrong theme — this
 * component just needs to stay in sync with whatever that script decided.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "light" ? "light" : "dark");
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // localStorage unavailable (private browsing, disabled storage) —
      // the toggle still works for the current page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-hairline/10 bg-surface/[0.06] text-paper/78 transition-colors hover:border-hairline/25 hover:text-paper"
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path strokeLinecap="round" d="M12 2.5v2M12 19.5v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2.5 12h2M19.5 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.3A8.5 8.5 0 1 1 9.7 4a6.7 6.7 0 0 0 10.3 10.3Z" />
        </svg>
      )}
    </button>
  );
}
