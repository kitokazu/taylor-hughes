import Link from "next/link";
import { BIO, FEATURED, NAME, PLACED, ROLES } from "@/lib/content";
import { Img } from "@/components/Img";
import { Reel } from "@/components/Reel";
import { FeaturedVideo } from "@/components/FeaturedVideo";
import s from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={s.hero} aria-label="Introduction">
        <Reel still={PLACED.heroStill} className={s.heroImg} alt={NAME} />
        <div className={s.heroShade} />
        <div className={s.heroText}>
          <h1 className={s.name}>{NAME}</h1>
          <p className={s.roles}>{ROLES.map((r) => <span key={r}>{r}</span>)}</p>
        </div>
        <div className={s.cue} aria-hidden />
      </section>

      {/* Taylor first: her portrait beside the bio. */}
      <section className={s.block}>
        <Img photo={PLACED.about} className={s.blockImg} sizes="(max-width: 900px) 100vw, 50vw" />
        <div className={s.blockText}>
          <p className={s.lead}>{BIO}</p>
          <Link href="/about" className={s.link}>About Taylor</Link>
        </div>
      </section>

      {/* Taylor's note: a recent piece at the bottom instead of a photo strip (Q2). */}
      <section className={s.featured}>
        <div className={s.featuredHead}>
          <h2 className={s.h2}>Recent work</h2>
          <Link href="/choreography" className={s.link}>All choreography</Link>
        </div>
        <FeaturedVideo work={FEATURED} />
      </section>
    </>
  );
}
