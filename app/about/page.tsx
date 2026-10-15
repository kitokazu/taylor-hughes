import { Fragment } from "react";
import type { Metadata } from "next";
import { BIO, FACTS, PLACED } from "@/lib/content";
import { Img } from "@/components/Img";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "About",
  description: BIO.split(". ")[0] + ".",
};

export default function About() {
  return (
    <section className={s.about}>
      <Img photo={PLACED.about} preload className={s.aboutImg} />
      <div className={s.aboutShade} />
      <div className={s.aboutBody}>
        <div>
          <h1 className={s.h1}>About</h1>
          <dl className={s.facts}>
            {FACTS.map(([k, v]) => <Fragment key={k}><dt>{k}</dt><dd>{v}</dd></Fragment>)}
          </dl>
        </div>
        <p className={s.bio}>{BIO}</p>
      </div>
    </section>
  );
}
