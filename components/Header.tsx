"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONTACT, NAME, NAV } from "@/lib/content";
import { Ripple } from "./Ripple";
import { InstagramIcon, MailIcon } from "./SocialIcons";
import s from "./Header.module.css";

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const current = (p: string) => (path === p ? "page" : undefined);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => setOpen(false), [path]);

  // Clear while it sits over a full-height photo (home reel, About); a frosted bar
  // everywhere else, so page text never has to fight the menu.
  useEffect(() => {
    const hero = path === "/" || path === "/about";
    const update = () => setSolid(!hero || window.scrollY > window.innerHeight - 62);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [path]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Phone menu: Escape closes it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className={`${s.header} ${solid ? s.headerSolid : ""}`}>
        <Link href="/" className={s.logo}>{NAME}</Link>
        <nav className={s.nav} aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.key} href={n.path} className={s.navItem} aria-current={current(n.path)} data-rh>
              <Ripple text={n.label} />
            </Link>
          ))}
        </nav>
        <button className={s.menuBtn} onClick={() => setOpen(true)} aria-expanded={open}>Menu</button>
      </header>
      {open && (
        <div className={s.overlay} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={s.overlayTop}>
            <Link href="/" className={s.logo} style={{ fontSize: 20 }}>{NAME}</Link>
            <button onClick={() => setOpen(false)} className={s.closeBtn}>Close</button>
          </div>
          <nav className={s.overlayNav} aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.key} href={n.path} className={s.overlayItem} aria-current={current(n.path)}>{n.label}</Link>
            ))}
          </nav>
          <div className={s.overlayFoot}>
            <a href={`mailto:${CONTACT.email}`} className={s.footLink}><MailIcon />{CONTACT.email}</a>
            <a href={CONTACT.igHref} className={s.footLink}><InstagramIcon />{CONTACT.ig}</a>
          </div>
        </div>
      )}
    </>
  );
}
