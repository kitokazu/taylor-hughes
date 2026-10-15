import type { Metadata } from "next";
import { CHOREO } from "@/lib/content";
import { WorkGrid } from "@/components/WorkGrid";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "Choreography",
  description: "Choreography by Taylor Lauren Hughes, from The Place in London to Orange County, with video of each piece.",
};

export default function Choreography() {
  return (
    <section className={s.page}>
      <h1 className={s.h1}>Choreography</h1>
      <WorkGrid works={CHOREO} />
    </section>
  );
}
