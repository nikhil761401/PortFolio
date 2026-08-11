"use client";

import { useRef, useState } from "react";

// Compact pattern-memory game (Simon-style): watch a growing sequence of
// tiles light up, then repeat it back. Ties into the actual research focus
// (sequence modeling / pattern recognition) without claiming to be a real
// model — it's a game, framed honestly as one.
const TILES = ["bg-accent", "bg-mint", "bg-accent2", "bg-gold"];
const FLASH_MS = 380;
const GAP_MS = 180;

type GameState = "idle" | "showing" | "input" | "over";

export default function NeuralGame() {
  const [state, setState] = useState<GameState>("idle");
  const [lit, setLit] = useState<number | null>(null);
  const [level, setLevel] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  const sequenceRef = useRef<number[]>([]);
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function playback(seq: number[], i = 0) {
    if (i >= seq.length) {
      setLit(null);
      stepRef.current = 0;
      setState("input");
      return;
    }
    setLit(seq[i]);
    timerRef.current = setTimeout(() => {
      setLit(null);
      timerRef.current = setTimeout(() => playback(seq, i + 1), GAP_MS);
    }, FLASH_MS);
  }

  function start() {
    const first = Math.floor(Math.random() * TILES.length);
    sequenceRef.current = [first];
    setLevel(1);
    setState("showing");
    playback(sequenceRef.current);
  }

  function handleTap(i: number) {
    if (state !== "input") return;
    if (i !== sequenceRef.current[stepRef.current]) {
      clearTimer();
      setState("over");
      setBest((prev) => (prev === null ? level : Math.max(prev, level)));
      return;
    }
    setLit(i);
    setTimeout(() => setLit(null), 150);
    stepRef.current += 1;
    if (stepRef.current === sequenceRef.current.length) {
      const next = Math.floor(Math.random() * TILES.length);
      sequenceRef.current = [...sequenceRef.current, next];
      setLevel(sequenceRef.current.length);
      setState("showing");
      timerRef.current = setTimeout(() => playback(sequenceRef.current), 500);
    }
  }

  const label =
    state === "idle"
      ? "Pattern recall"
      : state === "showing"
      ? "Watch…"
      : state === "input"
      ? `Level ${level}`
      : `Game over — level ${level}`;

  return (
    <div className="mx-auto w-fit text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-paper/50">{label}</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {TILES.map((color, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleTap(i)}
            disabled={state !== "input"}
            aria-label={`Tile ${i + 1}`}
            className={`h-14 w-14 rounded-2xl transition-all duration-150 sm:h-16 sm:w-16 ${color} ${
              lit === i ? "opacity-100 scale-95" : "opacity-30"
            } ${state === "input" ? "cursor-pointer" : "cursor-default"}`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        {(state === "idle" || state === "over") && (
          <button type="button" onClick={start} className="font-semibold text-accent hover:underline">
            {state === "over" ? "Retry" : "Start"}
          </button>
        )}
        {state === "over" && (
          <a href="#contact" className="font-semibold text-paper/60 hover:text-paper hover:underline">
            Let&apos;s talk →
          </a>
        )}
        {state === "over" && best !== null && (
          <span className="text-paper/40">best {best}</span>
        )}
      </div>
    </div>
  );
}
