import type { Metadata } from "next";
import { PLACED, TEACH } from "@/lib/content";
import { Img } from "@/components/Img";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "Teaching Philosophy",
  description: "How Taylor Lauren Hughes teaches dance.",
};

export default function Teaching() {
  return (
    <section className={`${s.page} ${s.split}`}>
      <div>
        <h1 className={s.h1}>Teaching Philosophy</h1>
        {TEACH.map((t, i) => <p key={i} className={s.teach}>{t}</p>)}
      </div>
      <div className={s.teachImgs}>
        <Img photo={PLACED.teaching} className={s.teachImg} sizes="(max-width: 899px) 100vw, 50vw" />
        <Img photo={PLACED.teaching2} className={s.teachImg} sizes="(max-width: 899px) 100vw, 50vw" />
      </div>
    </section>
  );
}
