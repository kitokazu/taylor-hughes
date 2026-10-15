"use client";
import { useState } from "react";
import type { Work } from "@/lib/content";
import { Img } from "./Img";
import { YouTube } from "./YouTube";
import s from "./FeaturedVideo.module.css";

// One work, large: poster with Play, the YouTube player only after a click.
export function FeaturedVideo({ work }: { work: Work }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className={s.wrap}>
      {playing && work.yt ? (
        <YouTube id={work.yt} title={work.title} />
      ) : (
        <button className={s.poster} onClick={() => setPlaying(true)} aria-label={`Play ${work.title}`}>
          <Img photo={work.poster} className={s.posterImg} sizes="(max-width: 900px) 100vw, 66vw" />
          <span className={s.play}>Play</span>
        </button>
      )}
      <div className={s.caption}>
        <h3 className={s.title}>{work.title}</h3>
        <p>{work.detail}</p>
        {work.venue && <p className={s.muted}>{work.venue}</p>}
      </div>
    </div>
  );
}
