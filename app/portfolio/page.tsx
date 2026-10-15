import type { Metadata } from "next";
import { PROJECTS } from "@/lib/content";
import { ProjectRows } from "@/components/ProjectRows";
import s from "../pages.module.css";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Recent projects with Ballet Nights, Zomer × Karhu, Femmanifesto Festival, Yeji Kim, Isaac Qureshi and Dickson Mbi.",
};

export default function Portfolio() {
  return (
    <section className={s.pageStrips}>
      <h1 className={`${s.h1} ${s.h1Inset}`}>Recent Projects</h1>
      <ProjectRows projects={PROJECTS} s={s} />
    </section>
  );
}
