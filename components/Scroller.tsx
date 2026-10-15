"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import s from "./Scroller.module.css";

// Horizontal strip that works without a trackpad: click-and-drag with momentum,
// left/right arrow keys when the strip has focus, and previous/next buttons on
// hover-capable screens. Native swipe on touch devices is untouched.
// With `auto`, the strip also drifts on its own, pausing while you hover, focus or touch it.
export function Scroller({ className, label, auto = false, children }: { className: string; label: string; auto?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const drag = useRef({ on: false, x: 0, left: 0, v: 0, t: 0, moved: false, raf: 0 });
  const resume = useRef(0);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Auto: ~30px/s, ping-pong with a short hold at each end.
  useEffect(() => {
    const el = ref.current;
    if (!auto || !el || paused || dragging || reduced()) return;
    // Keep a fractional position: the browser rounds scrollLeft to whole pixels,
    // which would swallow the sub-pixel steps this speed needs.
    let pos = el.scrollLeft;
    let dir = pos + el.clientWidth >= el.scrollWidth - 1 ? -1 : 1;
    let last = performance.now();
    let holdUntil = 0;
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (now > holdUntil) {
        const max = el.scrollWidth - el.clientWidth;
        pos = Math.max(0, Math.min(max, pos + dir * dt * 0.03));
        el.scrollLeft = pos;
        if (pos <= 0 || pos >= max) { dir = -dir; holdUntil = now + 1200; }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto, paused, dragging]);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    cancelAnimationFrame(drag.current.raf);
    setDragging(false);
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduced() ? "auto" : "smooth" });
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    // Touch: hold still while a finger is down, then pick up again (see onUp).
    if (e.pointerType !== "mouse") { clearTimeout(resume.current); setPaused(true); return; }
    if (e.button !== 0) return;
    const el = ref.current!;
    cancelAnimationFrame(drag.current.raf);
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, v: 0, t: performance.now(), moved: false, raf: 0 };
    el.setPointerCapture(e.pointerId);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.on) return;
    const el = ref.current!;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 3) { d.moved = true; setDragging(true); }
    const now = performance.now();
    const before = el.scrollLeft;
    el.scrollLeft = d.left - dx;
    d.v = (el.scrollLeft - before) / Math.max(now - d.t, 1);
    d.t = now;
  };

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") { resume.current = window.setTimeout(() => setPaused(false), 2500); return; }
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    const el = ref.current!;
    let v = d.v * 16; // px per frame
    const fling = () => {
      if (Math.abs(v) < 0.4) { setDragging(false); return; }
      const before = el.scrollLeft;
      el.scrollLeft += v;
      if (el.scrollLeft === before) { setDragging(false); return; } // hit an edge
      v *= 0.94;
      d.raf = requestAnimationFrame(fling);
    };
    if (d.moved && !reduced()) d.raf = requestAnimationFrame(fling);
    else setDragging(false);
  };

  const cls = [className, s.scroll, dragging && s.dragging, auto && s.noSnap].filter(Boolean).join(" ");

  return (
    <div
      className={s.wrap}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPaused(false)}
      onFocus={(e) => e.target.matches(":focus-visible") && setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={ref}
        className={cls}
        tabIndex={0}
        aria-label={label}
        onScroll={update}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDragStart={(e) => e.preventDefault()}
      >
        {children}
      </div>
      <button type="button" className={`${s.arrow} ${s.prev}`} onClick={() => step(-1)} disabled={edge.start} tabIndex={-1} aria-label="Previous photos">
        <Chevron />
      </button>
      <button type="button" className={`${s.arrow} ${s.next}`} onClick={() => step(1)} disabled={edge.end} tabIndex={-1} aria-label="Next photos">
        <Chevron />
      </button>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
