import type { Metadata } from "next";
import { PERF } from "@/lib/content";
import { WorkGrid } from "@/components/WorkGrid";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "Dance Performance",
  description: "Taylor Lauren Hughes as a dancer: Claude × F1, Zomer × Karhu, Ballet Nights and more.",
};

export default function Performance() {
  return (
    <section className={s.page}>
      <h1 className={s.h1}>Dance Performance</h1>
      <WorkGrid works={PERF} />
    </section>
  );
}
