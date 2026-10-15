import type { Metadata } from "next";
import { MD } from "@/lib/content";
import { Img } from "@/components/Img";
import { Scroller } from "@/components/Scroller";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "Movement Direction",
  description: "Movement direction by Taylor Lauren Hughes, photographed by Patrick Owens and Clandestine Pilot.",
};

// Patrick Owens first; strips drift on their own (Taylor's note).
export default function MovementDirection() {
  return (
    <section className={s.pageStrips}>
      <h1 className={`${s.h1} ${s.h1Inset}`}>Movement Direction</h1>
      {MD.map((p) => (
        <div key={p.id} className={s.project}>
          <Scroller className={s.strip} label={`${p.title}, photos`} auto>
            {p.photos.map((ph, i) => <Img key={i} photo={ph} className={s.stripImgMd} sizes="(max-width: 899px) 80vw, 40vw" />)}
          </Scroller>
          <div className={s.caption}>
            <h2 className={s.captionTitle}>{p.title}</h2>
          </div>
        </div>
      ))}
    </section>
  );
}
