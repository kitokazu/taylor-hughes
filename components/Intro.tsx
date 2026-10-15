"use client";
import { useEffect, useLayoutEffect, useState, type AnimationEvent } from "react";
import { NAME, ROLES } from "@/lib/content";
import s from "./Intro.module.css";

// First-visit intro, once per session: a hairline rule opens, the name rides up
// out of a mask, the roles fade in, then the panel lifts away. About 2.2s.
//
// Pre-paint: `INTRO_SCRIPT` runs in <head> before anything renders and adds
// `js-preload` to <html> for a first visit with motion allowed. The panel is
// `display:none` without that class, so no JS, reduced motion or a repeat visit
// all mean "no intro" with nothing to dismiss. See Intro.module.css.

const FLAG = "tlh:intro";

export const INTRO_SCRIPT = `try{if(!sessionStorage.getItem('${FLAG}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-preload')}}catch(e){}`;

export function Intro() {
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);

  const markSeen = () => {
    try { sessionStorage.setItem(FLAG, "1"); } catch {}
    document.documentElement.classList.remove("js-preload");
  };

  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem(FLAG); } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) { markSeen(); setDone(true); return; }
    setPlaying(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Hold the page still while the panel is up.
  useEffect(() => {
    if (!playing || done) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, [playing, done]);

  const onEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    markSeen();
    setDone(true);
  };

  if (done) return null;

  return (
    <div className={s.intro} aria-hidden onAnimationEnd={onEnd}>
      <div className={s.words}>
        {NAME.split(" ").map((w, i) => (
          <span key={w} className={s.mask}>
            <span className={s.word} style={{ animationDelay: `${220 + i * 70}ms` }}>{w}</span>
          </span>
        ))}
      </div>
      <div className={s.rule}><span /></div>
      <div className={s.meta}>{ROLES.join(", ")}</div>
    </div>
  );
}
