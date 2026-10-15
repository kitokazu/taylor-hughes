"use client";
import { useState } from "react";
import { Img } from "./Img";
import { Ripple } from "./Ripple";
import { Scroller } from "./Scroller";
import type { Project } from "@/lib/content";

// Portfolio as a row list: the project's first photo fades in behind the hovered
// row; clicking a row opens its photo strip beneath. One open at a time.
// Expected keys: rows, row, rowBg, rowBtn, rowTitle, rowMeta, rowStrip, rowPlace, strip, stripImg.
export type RowClasses = { readonly [key: string]: string };

export function ProjectRows({ projects, s }: { projects: Project[]; s: RowClasses }) {
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className={s.rows}>
      {projects.map((p) => {
        const isOpen = open === p.id;
        return (
          <div key={p.id} className={s.row} onMouseEnter={() => setHovered(p.id)} onMouseLeave={() => setHovered(null)}>
            {hovered === p.id && !isOpen && <Img photo={p.photos[0]} className={s.rowBg} sizes="100vw" />}
            <button className={s.rowBtn} onClick={() => setOpen(isOpen ? null : p.id)} aria-expanded={isOpen} data-rh>
              <span className={s.rowTitle}><Ripple text={p.title} /></span>
              <span className={s.rowMeta}>{p.role}</span>
            </button>
            {isOpen && (
              <div className={s.rowStrip}>
                {p.location && <p className={s.rowPlace}>{p.location}</p>}
                <Scroller className={s.strip} label={`${p.title}, photos`}>
                  {p.photos.map((ph, i) => (
                    <Img key={i} photo={ph} className={s.stripImg} sizes="(max-width: 760px) 80vw, 45vw" />
                  ))}
                </Scroller>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
