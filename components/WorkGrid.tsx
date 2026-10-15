"use client";
import { useState } from "react";
import type { Work } from "@/lib/content";
import { Img } from "./Img";
import { Ripple } from "./Ripple";
import { Scroller } from "./Scroller";
import { YouTube } from "./YouTube";
import s from "./WorkGrid.module.css";

// Choreography and Dance Performance: stills first, three across, no dates.
// A still with a video plays in place on click (the player loads only then);
// one without a video opens its photos inside the same frame.
export function WorkGrid({ works }: { works: Work[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={s.grid}>
      {works.map((w) => {
        const on = active === w.id;
        return (
          <article key={w.id} className={s.cell} data-rh>
            {on && w.yt ? (
              <YouTube id={w.yt} title={w.title} />
            ) : on && w.photos ? (
              <div className={s.media}>
                <Scroller className={s.cellStrip} label={`${w.title}, photos`}>
                  {w.photos.map((ph, i) => <Img key={i} photo={ph} className={s.cellStripImg} sizes="400px" />)}
                </Scroller>
              </div>
            ) : w.yt || w.photos ? (
              <button className={s.media} onClick={() => setActive(w.id)} aria-label={w.yt ? `Play ${w.title}` : `${w.title}, show photos`}>
                <Img photo={w.poster} className={s.cellImg} sizes="(max-width: 899px) 100vw, (max-width: 1199px) 50vw, 33vw" />
                <span className={s.play}>{w.yt ? "Play" : "Photos"}</span>
              </button>
            ) : (
              <div className={s.media}>
                <Img photo={w.poster} className={s.cellImg} sizes="(max-width: 899px) 100vw, (max-width: 1199px) 50vw, 33vw" />
              </div>
            )}
            <div className={s.cellText}>
              <h2 className={s.cellTitle}><Ripple text={w.title} /></h2>
              <p>{w.detail}</p>
              {w.venue && <p className={s.muted}>{w.venue}</p>}
              {w.press && (
                <p className={s.press}>
                  {w.press.map((p) => <a key={p.href} href={p.href} target="_blank" rel="noreferrer">{p.name}</a>)}
                </p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
