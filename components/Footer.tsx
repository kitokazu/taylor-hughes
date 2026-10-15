import { CONTACT, NAME } from "@/lib/content";
import { InstagramIcon, MailIcon } from "./SocialIcons";
import s from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.logo}>{NAME}</div>
      <div className={s.col}>
        <a href={`mailto:${CONTACT.email}`} className={s.link}><MailIcon />{CONTACT.email}</a>
        <a href={CONTACT.igHref} className={s.link}><InstagramIcon />{CONTACT.ig}</a>
      </div>
    </footer>
  );
}
