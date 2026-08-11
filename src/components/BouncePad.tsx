"use client";

import { useEffect, useRef, useState } from "react";

// A full-width canvas bounce game: a paddle deflects a ball, score goes up
// on every return, speed creeps up over time. A field of triangle obstacles
// near the top adds real (if simplified) physics deflection, and a slow
// animated wave layer runs behind everything purely for atmosphere — it
// never touches ball/paddle collision. Mouse/touch drag the paddle, arrow
// keys work too. Canvas resizes to fill its container (via ResizeObserver)
// so it can stretch edge-to-edge at any viewport width. Best score persists
// locally via localStorage, wrapped defensively — same pattern as the
// clipboard copy elsewhere on the site.
const PADDLE_H = 10;
const BALL_R = 7;
const BEST_KEY = "portfolio-bounce-best";

type Phase = "idle" | "playing" | "over";
type Mode = "human" | "ai";
type Point = [number, number];
type Triangle = { p1: Point; p2: Point; p3: Point; color: string };
type Particle = { x: number; y: number; vx: number; vy: number; color: string; life: number; size: number; rot: number; vr: number };

type GameVars = {
  width: number;
  height: number;
  paddleW: number;
  paddleX: number;
  ballX: number;
  ballY: number;
  vx: number;
  vy: number;
  score: number;
  running: boolean;
  mode: Mode;
  aiStartedAt: number;
  keys: { left: boolean; right: boolean };
};

// The "AI" opponent is an honest, tiny rule-based agent — not a neural net.
// Each frame it unfolds the ball's straight-line path off the side walls to
// predict where the ball will land, so it reacts to upcoming wall bounces
// instead of just chasing the ball's current position. Once the ball is
// somewhere unpredictable (mid-obstacle-field, heading away from the
// paddle), it falls back to tracking the ball's live position rather than
// parking in the middle — the same "detect, then position underneath"
// instinct a real agent would use when it can't fully plan ahead. When ball
// speed eventually outpaces AI_MAX_SPEED, the bot starts missing on its
// own — a natural difficulty ceiling, not a scripted loss.
const AI_MAX_SPEED = 6.4;
// The AI demo always wraps up on its own after this long, rather than
// running forever — see endGame("timeout") below.
const AI_DURATION_MS = 60_000;

const OBSTACLE_COLORS = ["#3b82f6", "#2dd4bf", "#8b5cf6", "#fbbf24"];

function predictLandingX(ballX: number, ballY: number, vx: number, vy: number, paddleY: number, width: number) {
  if (vy <= 0) return null;
  const t = (paddleY - ballY) / vy;
  if (t <= 0) return null;
  const raw = ballX + vx * t;
  const span = width - 2 * BALL_R;
  const period = 2 * span;
  let m = (raw - BALL_R) % period;
  if (m < 0) m += period;
  const reflected = m <= span ? m : period - m;
  return reflected + BALL_R;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// The "ceiling" the ball actually collides with — a jagged ridge line built
// from a few summed sine harmonics at different frequencies. Animating the
// phase scrolls the whole ridge sideways every frame, so the unevenness
// visibly flows across the play field instead of sitting static, and the
// ball's deflection point (and angle) moves with it.
function ceilingHeightAt(x: number, phase: number) {
  const h =
    15 +
    Math.sin(x * 0.05 + phase * 1.3) * 7 +
    Math.sin(x * 0.12 - phase * 2.1) * 4 +
    Math.sin(x * 0.23 + phase * 3.1) * 2.4;
  return Math.max(5, h);
}

function buildCeilingPoints(width: number, phase: number): Point[] {
  const step = 10;
  const points: Point[] = [];
  for (let x = 0; x <= width; x += step) {
    points.push([x, ceilingHeightAt(x, phase)]);
  }
  if (points.length === 0 || points[points.length - 1][0] !== width) {
    points.push([width, ceilingHeightAt(width, phase)]);
  }
  return points;
}

function buildObstacles(width: number, height: number): Triangle[] {
  const count = width < 420 ? 4 : 6;
  const bandTop = height * 0.2;
  const bandHeight = height * 0.22;
  const colWidth = width / count;
  const list: Triangle[] = [];
  for (let i = 0; i < count; i++) {
    const cx = colWidth * i + colWidth / 2 + (Math.random() - 0.5) * colWidth * 0.3;
    const cy = bandTop + Math.random() * bandHeight;
    const size = 14 + Math.random() * 12;
    const rot = Math.random() * Math.PI * 2;
    const pts = [0, 1, 2].map((k) => {
      const angle = rot + (k * Math.PI * 2) / 3;
      return [cx + Math.cos(angle) * size, cy + Math.sin(angle) * size] as Point;
    });
    list.push({ p1: pts[0], p2: pts[1], p3: pts[2], color: OBSTACLE_COLORS[i % OBSTACLE_COLORS.length] });
  }
  return list;
}

// Reflects a moving circle off a line segment, if it's currently overlapping
// it — used for the triangle obstacles. Returns the corrected position +
// velocity, or null if there's no collision (or the circle is already
// separating from the segment, which avoids double-reflect jitter).
function reflectOffSegment(
  px: number,
  py: number,
  vx: number,
  vy: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius: number
) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  const distX = px - cx;
  const distY = py - cy;
  const dist = Math.hypot(distX, distY);
  if (dist >= radius || dist === 0) return null;
  const nx = distX / dist;
  const ny = distY / dist;
  const dot = vx * nx + vy * ny;
  if (dot >= 0) return null;
  const overlap = radius - dist;
  return {
    x: px + nx * overlap,
    y: py + ny * overlap,
    vx: vx - 2 * dot * nx,
    vy: vy - 2 * dot * ny,
  };
}

// Filled, layered "dune" bands instead of thin stray lines — each one is a
// closed shape from the wave curve down to the bottom of the canvas, so the
// background reads as a deliberate design rather than empty space.
const WAVE_LAYERS = [
  { amp: 10, freq: 0.016, speed: 0.8, baseYRatio: 0.62, color: "rgba(59,130,246,0.10)" },
  { amp: 8, freq: 0.024, speed: -0.55, baseYRatio: 0.76, color: "rgba(139,92,246,0.10)" },
  { amp: 6, freq: 0.03, speed: 1.05, baseYRatio: 0.9, color: "rgba(45,212,191,0.09)" },
];
const CONFETTI_COLORS = ["#3b82f6", "#8b5cf6", "#2dd4bf", "#fbbf24", "#f8fafc"];
const MILESTONE_STEP = 10;

export default function BouncePad() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const obstaclesRef = useRef<Triangle[]>([]);
  const ceilingRef = useRef<Point[]>([]);
  const ceilingPhaseRef = useRef(0);
  const obstacleStuckRef = useRef(0);
  const ballSpeedRef = useRef(1);
  const flowSpeedRef = useRef(1);
  const particlesRef = useRef<Particle[]>([]);
  const dotLayerRef = useRef<HTMLCanvasElement | null>(null);
  const lastMilestoneRef = useRef(0);
  const g = useRef<GameVars>({
    width: 480,
    height: 220,
    paddleW: 90,
    paddleX: 195,
    ballX: 240,
    ballY: 160,
    vx: 3,
    vy: -3.4,
    score: 0,
    running: false,
    mode: "human",
    aiStartedAt: 0,
    keys: { left: false, right: false },
  });

  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<Mode>("human");
  const [endReason, setEndReason] = useState<"miss" | "timeout" | null>(null);
  const [ballSpeedDisplay, setBallSpeedDisplay] = useState(1);
  const [flowSpeedDisplay, setFlowSpeedDisplay] = useState(1);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(BEST_KEY);
      if (stored) setBest(Number(stored));
    } catch {
      // localStorage unavailable — game still works, just no persisted best.
    }
    try {
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      // matchMedia unavailable — default to motion on.
    }
  }, []);

  function resize() {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);

    const s = g.current;
    s.width = w;
    s.height = h;
    s.paddleW = Math.max(72, Math.min(140, w * 0.14));
    s.paddleX = Math.min(s.paddleX, w - s.paddleW);
    s.ballX = Math.min(s.ballX, w - BALL_R);
    s.ballY = Math.min(s.ballY, h - BALL_R);
    obstaclesRef.current = buildObstacles(w, h);
    // Seed the ceiling immediately so the very first draw (below) isn't
    // empty — frame() recomputes it every tick after that as it flows.
    ceilingRef.current = buildCeilingPoints(w, ceilingPhaseRef.current);

    // Static dot-grid texture, pre-rendered once per resize onto an
    // offscreen canvas so the main loop just drawImages it instead of
    // redrawing hundreds of dots every frame.
    const dotCanvas = dotLayerRef.current ?? document.createElement("canvas");
    dotCanvas.width = w;
    dotCanvas.height = h;
    const dotCtx = dotCanvas.getContext("2d");
    if (dotCtx) {
      dotCtx.clearRect(0, 0, w, h);
      dotCtx.fillStyle = "rgba(255,255,255,0.06)";
      const spacing = 22;
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          dotCtx.beginPath();
          dotCtx.arc(x, y, 1, 0, Math.PI * 2);
          dotCtx.fill();
        }
      }
    }
    dotLayerRef.current = dotCanvas;

    draw();
  }

  useEffect(() => {
    resize();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") g.current.keys.left = true;
      if (e.key === "ArrowRight") g.current.keys.right = true;
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") g.current.keys.left = false;
      if (e.key === "ArrowRight") g.current.keys.right = false;
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Track pointer position at the window level, not just over the canvas —
    // most people drag past the edge of a small game window without meaning
    // to let go, and a canvas-scoped listener stops updating the instant the
    // cursor leaves those bounds. This keeps the paddle following the
    // cursor's x position anywhere on the page while a round is playable.
    function onPointerMove(e: PointerEvent) {
      const canvas = canvasRef.current;
      const s = g.current;
      if (!canvas || s.mode === "ai") return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      s.paddleX = Math.max(0, Math.min(s.width - s.paddleW, x - s.paddleW / 2));
    }
    window.addEventListener("pointermove", onPointerMove);

    const observer = new ResizeObserver(() => resize());
    if (wrapRef.current) observer.observe(wrapRef.current);

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // Mount-only: the render loop, observer, and listeners are set up once
    // and torn down on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const s = g.current;

    ctx.clearRect(0, 0, s.width, s.height);
    ctx.fillStyle = "rgba(255,255,255,0.015)";
    ctx.fillRect(0, 0, s.width, s.height);

    // Static dot-grid texture, blitted from the offscreen canvas built in
    // resize() — keeps the background from ever reading as empty space.
    if (dotLayerRef.current) {
      ctx.drawImage(dotLayerRef.current, 0, 0, s.width, s.height);
    }

    // Layered "dune" bands — atmosphere only, no collision involvement.
    // Each is a closed shape from the wave curve down to the canvas floor,
    // so together they read as a deliberate layered design.
    for (const layer of WAVE_LAYERS) {
      ctx.beginPath();
      const baseY = s.height * layer.baseYRatio;
      for (let x = 0; x <= s.width; x += 6) {
        const y = baseY + Math.sin(x * layer.freq + phaseRef.current * layer.speed) * layer.amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(s.width, s.height);
      ctx.lineTo(0, s.height);
      ctx.closePath();
      ctx.fillStyle = layer.color;
      ctx.fill();
    }

    // Jagged ceiling surface — draw it so the deflection the ball does up
    // there reads as "bouncing off uneven terrain" rather than an invisible
    // wall. Filled down from the very top edge, with a bright stroke tracing
    // the actual jagged collision line.
    const ceiling = ceilingRef.current;
    if (ceiling.length > 1) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (const [x, y] of ceiling) ctx.lineTo(x, y);
      ctx.lineTo(s.width, 0);
      ctx.closePath();
      const ceilGrad = ctx.createLinearGradient(0, 0, 0, 30);
      ceilGrad.addColorStop(0, "rgba(96,165,250,0.28)");
      ceilGrad.addColorStop(1, "rgba(96,165,250,0.04)");
      ctx.fillStyle = ceilGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(ceiling[0][0], ceiling[0][1]);
      for (let i = 1; i < ceiling.length; i++) ctx.lineTo(ceiling[i][0], ceiling[i][1]);
      ctx.strokeStyle = "rgba(147,197,253,0.85)";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.stroke();
    }

    // Triangle obstacles.
    for (const tri of obstaclesRef.current) {
      ctx.beginPath();
      ctx.moveTo(tri.p1[0], tri.p1[1]);
      ctx.lineTo(tri.p2[0], tri.p2[1]);
      ctx.lineTo(tri.p3[0], tri.p3[1]);
      ctx.closePath();
      ctx.fillStyle = `${tri.color}26`;
      ctx.fill();
      ctx.strokeStyle = `${tri.color}b3`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    const paddleY = s.height - 20;
    const grad = ctx.createLinearGradient(s.paddleX, 0, s.paddleX + s.paddleW, 0);
    grad.addColorStop(0, "#3b82f6");
    grad.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = grad;
    roundRect(ctx, s.paddleX, paddleY, s.paddleW, PADDLE_H, 5);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(s.ballX, s.ballY, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = "#f8fafc";
    ctx.shadowColor = "#60a5fa";
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    updateAndDrawParticles(ctx);
  }

  function triggerConfetti(x: number, y: number) {
    for (let i = 0; i < 46; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        life: 1,
        size: 3 + Math.random() * 3,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.4,
      });
    }
  }

  function updateAndDrawParticles(ctx: CanvasRenderingContext2D) {
    const particles = particlesRef.current;
    if (particles.length === 0) return;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vy += 0.12;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.018;
      if (p.life <= 0 || p.y > g.current.height + 20) {
        particles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }

  function resetBall() {
    const s = g.current;
    s.ballX = s.width / 2;
    s.ballY = s.height - 70;
    const dir = Math.random() < 0.5 ? -1 : 1;
    s.vx = 2.8 * dir;
    s.vy = -3.6;
  }

  function endGame(reason: "miss" | "timeout") {
    const s = g.current;
    s.running = false;
    setPhase("over");
    setEndReason(reason);
    setBest((prev) => {
      const nb = prev === null ? s.score : Math.max(prev, s.score);
      try {
        window.localStorage.setItem(BEST_KEY, String(nb));
      } catch {
        // ignore — best just won't persist this session
      }
      return nb;
    });
  }

  // Resolves up to a few overlaps in the same frame instead of just one —
  // a ball wedged into a corner between two obstacle edges can otherwise
  // ping-pong between them for several frames in a row and visually read as
  // "stuck". A small radius pad on the push-out also keeps it from landing
  // exactly tangent to an edge and re-triggering the same collision next
  // frame. Returns whether any collision happened, so the caller can run a
  // safety valve if it keeps colliding frame after frame.
  function deflectOffObstacles(): boolean {
    const s = g.current;
    let collided = false;
    for (let iter = 0; iter < 4; iter++) {
      let hit = false;
      for (const tri of obstaclesRef.current) {
        const edges: [Point, Point][] = [
          [tri.p1, tri.p2],
          [tri.p2, tri.p3],
          [tri.p3, tri.p1],
        ];
        for (const [a, b] of edges) {
          const res = reflectOffSegment(s.ballX, s.ballY, s.vx, s.vy, a[0], a[1], b[0], b[1], BALL_R + 0.4);
          if (res) {
            s.ballX = res.x;
            s.ballY = res.y;
            s.vx = res.vx;
            s.vy = res.vy;
            hit = true;
            collided = true;
            break;
          }
        }
        if (hit) break;
      }
      if (!hit) break;
    }
    return collided;
  }

  // Same idea as the obstacle field: reflect off whichever segment of the
  // jagged ceiling line the ball is actually touching, so the bounce angle
  // depends on the slope right there instead of always being a flat
  // straight-down deflection.
  function deflectOffCeiling(): boolean {
    const s = g.current;
    const ceiling = ceilingRef.current;
    for (let i = 0; i < ceiling.length - 1; i++) {
      const [x1, y1] = ceiling[i];
      const [x2, y2] = ceiling[i + 1];
      const res = reflectOffSegment(s.ballX, s.ballY, s.vx, s.vy, x1, y1, x2, y2, BALL_R + 0.4);
      if (res) {
        s.ballX = res.x;
        s.ballY = res.y;
        s.vx = res.vx;
        s.vy = res.vy;
        return true;
      }
    }
    return false;
  }

  function updatePhysics() {
    const s = g.current;
    const paddleY = s.height - 20;

    if (s.mode === "ai" && performance.now() - s.aiStartedAt >= AI_DURATION_MS) {
      endGame("timeout");
      return;
    }

    if (s.mode === "ai") {
      const predicted = predictLandingX(s.ballX, s.ballY, s.vx, s.vy, paddleY, s.width);
      // Can't cleanly predict a landing (ball heading away, or bouncing
      // around the obstacle field) — track its live position instead of
      // parking in the middle, so it reads as attentive the whole time.
      const targetCenter = predicted ?? s.ballX;
      const target = targetCenter - s.paddleW / 2;
      const move = Math.max(-AI_MAX_SPEED, Math.min(AI_MAX_SPEED, target - s.paddleX));
      s.paddleX += move;
    } else {
      if (s.keys.left) s.paddleX -= 6.5;
      if (s.keys.right) s.paddleX += 6.5;
    }
    s.paddleX = Math.max(0, Math.min(s.width - s.paddleW, s.paddleX));

    // ballSpeedRef is the visitor-controlled dial (left-side arrows) — it
    // scales how far the ball travels per frame without touching the
    // "base" vx/vy that collision math reflects off, so direction stays
    // correct no matter how it's set.
    s.ballX += s.vx * ballSpeedRef.current;
    s.ballY += s.vy * ballSpeedRef.current;

    if (s.ballX <= BALL_R || s.ballX >= s.width - BALL_R) {
      s.vx *= -1;
      s.ballX = Math.max(BALL_R, Math.min(s.width - BALL_R, s.ballX));
    }
    const hitCeiling = deflectOffCeiling();
    if (!hitCeiling && s.ballY <= BALL_R) {
      // Fallback safety clamp for the rare case a fast ball tunnels past a
      // thin peak faster than the segment check catches it.
      s.vy = Math.abs(s.vy);
      s.ballY = BALL_R;
    }

    const hitObstacle = deflectOffObstacles();
    obstacleStuckRef.current = hitObstacle ? obstacleStuckRef.current + 1 : 0;
    if (obstacleStuckRef.current > 40) {
      // Safety valve: on the off chance the ball gets wedged in a tight
      // corner between two obstacle edges and keeps re-colliding frame
      // after frame, force it back into open play rather than let it sit
      // there looking stuck.
      s.vx = (Math.random() < 0.5 ? -1 : 1) * 4;
      s.vy = Math.max(Math.abs(s.vy), 4);
      s.ballY += 6;
      obstacleStuckRef.current = 0;
    }

    if (
      s.vy > 0 &&
      s.ballY + BALL_R >= paddleY &&
      s.ballY + BALL_R <= paddleY + PADDLE_H + 8 &&
      s.ballX >= s.paddleX - BALL_R &&
      s.ballX <= s.paddleX + s.paddleW + BALL_R
    ) {
      const hitPos = (s.ballX - (s.paddleX + s.paddleW / 2)) / (s.paddleW / 2);
      // Speed climbs smoothly with score instead of compounding an ad-hoc
      // multiplier on every single hit, and caps out so it stays winnable.
      const speedMul = Math.min(1.9, 1 + s.score * 0.035);
      s.vx = hitPos * 4.4 * speedMul;
      s.vy = -4.6 * speedMul;
      s.ballY = paddleY - BALL_R;
      s.score += 1;
      setScore(s.score);

      if (s.score > 0 && s.score % MILESTONE_STEP === 0 && lastMilestoneRef.current !== s.score) {
        lastMilestoneRef.current = s.score;
        triggerConfetti(s.ballX, s.ballY);
      }
    }

    if (s.ballY - BALL_R > s.height) {
      endGame("miss");
    }
  }

  function frame() {
    if (!reducedMotionRef.current) {
      phaseRef.current += 0.02;
      // flowSpeedRef is the visitor-controlled dial (right-side arrows) —
      // it scales how fast the ridge line scrolls sideways.
      ceilingPhaseRef.current += 0.018 * flowSpeedRef.current;
    }
    ceilingRef.current = buildCeilingPoints(g.current.width, ceilingPhaseRef.current);
    if (g.current.running) updatePhysics();
    draw();
    rafRef.current = requestAnimationFrame(frame);
  }

  function start(nextMode: Mode) {
    const s = g.current;
    s.mode = nextMode;
    s.aiStartedAt = performance.now();
    s.paddleX = s.width / 2 - s.paddleW / 2;
    s.score = 0;
    s.running = true;
    resetBall();
    particlesRef.current = [];
    lastMilestoneRef.current = 0;
    setMode(nextMode);
    setScore(0);
    setEndReason(null);
    setPhase("playing");
  }

  // Visitor-controlled dials, flanking the game window rather than
  // overlaid on it. Ball speed scales how fast the ball actually moves;
  // flow speed scales how fast the ceiling's unevenness scrolls sideways.
  // Both just nudge the ref a step and mirror it into state for the
  // on-screen readout.
  function adjustBallSpeed(delta: number) {
    const next = Math.max(0.5, Math.min(2.5, Math.round((ballSpeedDisplay + delta) * 100) / 100));
    ballSpeedRef.current = next;
    setBallSpeedDisplay(next);
  }
  function adjustFlowSpeed(delta: number) {
    const next = Math.max(0.25, Math.min(3, Math.round((flowSpeedDisplay + delta) * 100) / 100));
    flowSpeedRef.current = next;
    setFlowSpeedDisplay(next);
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-paper/40">
              {mode === "ai" && phase !== "idle" ? "AI score" : "Score"}
            </span>
            <span className="neon-score text-lg font-bold tabular-nums leading-none">{score}</span>
            {best !== null && (
              <span className="text-xs font-medium tabular-nums text-paper/40">· Best {best}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => start("human")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                mode === "human" && phase === "playing"
                  ? "gradient-bg text-white shadow-[0_0_14px_rgba(59,130,246,0.7),0_0_28px_rgba(139,92,246,0.35)]"
                  : "border border-accent/30 text-paper/70 hover:border-accent hover:text-accent hover:shadow-[0_0_10px_rgba(59,130,246,0.4)]"
              }`}
            >
              Play
            </button>
            <button
              type="button"
              onClick={() => start("ai")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                mode === "ai" && phase === "playing"
                  ? "gradient-bg text-white shadow-[0_0_14px_rgba(59,130,246,0.7),0_0_28px_rgba(139,92,246,0.35)]"
                  : "border border-accent2/30 text-paper/70 hover:border-accent2 hover:text-accent2 hover:shadow-[0_0_10px_rgba(139,92,246,0.4)]"
              }`}
            >
              🤖 Play by AI
            </button>
          </div>
        </div>
        <a href="#contact" className="text-xs font-semibold text-accent hover:underline">
          Like what you see? Let&apos;s build something together →
        </a>
      </div>

      <div className="flex items-stretch gap-1.5 sm:gap-2">
        <div className="flex flex-none flex-col items-center justify-center gap-1">
          <span className="text-[8px] font-semibold uppercase tracking-wide text-accent/70">Ball</span>
          <button
            type="button"
            onClick={() => adjustBallSpeed(0.25)}
            aria-label="Increase ball speed"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-accent/30 text-accent/70 transition-all hover:border-accent hover:text-accent hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 15l6-6 6 6" />
            </svg>
          </button>
          <span className="text-[9px] font-medium tabular-nums text-accent [text-shadow:0_0_6px_rgba(59,130,246,0.6)]">
            {ballSpeedDisplay.toFixed(2)}x
          </span>
          <button
            type="button"
            onClick={() => adjustBallSpeed(-0.25)}
            aria-label="Decrease ball speed"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-accent/30 text-accent/70 transition-all hover:border-accent hover:text-accent hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div
          ref={wrapRef}
          className="relative h-44 w-full flex-1 overflow-hidden rounded-2xl border border-hairline/10 bg-ink shadow-sm sm:h-52 md:h-60"
        >
          <canvas ref={canvasRef} className="block h-full w-full touch-none" />
          {phase !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/75 px-4 text-center backdrop-blur-sm">
              {phase === "over" ? (
                endReason === "timeout" ? (
                  <p className="max-w-sm text-sm text-paper/70">
                    That&apos;s a wrap — the AI held on for a minute, score {score}. Predict, adapt, repeat: that&apos;s
                    the core loop behind most AI. I build systems that scale that idea with real data.
                  </p>
                ) : (
                  <p className="text-sm text-paper/70">
                    {mode === "ai" ? `AI played to ${score}. ` : `Missed it — score ${score}. `}
                    Nice run either way.
                  </p>
                )
              ) : (
                <p className="text-sm text-paper/60">
                  Drag to move the pad, or let the AI play for you.
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => start("human")}
                  className="rounded-2xl gradient-bg px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_16px_rgba(59,130,246,0.65),0_0_32px_rgba(139,92,246,0.35)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(59,130,246,0.85),0_0_44px_rgba(139,92,246,0.5)]"
                >
                  {phase === "over" && mode === "human" ? "Play Again" : "Play"}
                </button>
                <button
                  type="button"
                  onClick={() => start("ai")}
                  className="rounded-2xl border-2 border-accent2/60 px-6 py-2.5 text-sm font-semibold text-accent2 shadow-[0_0_12px_rgba(139,92,246,0.4)] transition-all hover:-translate-y-0.5 hover:border-accent2 hover:shadow-[0_0_20px_rgba(139,92,246,0.65)]"
                >
                  🤖 {phase === "over" && mode === "ai" ? "Play Again" : "Play by AI"}
                </button>
              </div>
              <p className="max-w-xs text-[11px] leading-snug text-paper/40">
                The AI is a small trajectory-predicting bot — not a neural net, but the same instinct behind the agents I build.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-none flex-col items-center justify-center gap-1">
          <span className="text-[8px] font-semibold uppercase tracking-wide text-accent2/70">Flow</span>
          <button
            type="button"
            onClick={() => adjustFlowSpeed(0.25)}
            aria-label="Increase ceiling flow speed"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-accent2/30 text-accent2/70 transition-all hover:border-accent2 hover:text-accent2 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 15l6-6 6 6" />
            </svg>
          </button>
          <span className="text-[9px] font-medium tabular-nums text-accent2 [text-shadow:0_0_6px_rgba(139,92,246,0.6)]">
            {flowSpeedDisplay.toFixed(2)}x
          </span>
          <button
            type="button"
            onClick={() => adjustFlowSpeed(-0.25)}
            aria-label="Decrease ceiling flow speed"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-accent2/30 text-accent2/70 transition-all hover:border-accent2 hover:text-accent2 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
