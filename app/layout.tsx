import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Intro, INTRO_SCRIPT } from "@/components/Intro";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CONTACT, NAME, ROLES, SITE_URL } from "@/lib/content";
import "./globals.css";

// Upright only: no italics anywhere on the site.
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal"], variable: "--font-display" });
const text = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-text" });

const description = `${NAME}: ${ROLES.join(", ")}. Choreography, dance performance, teaching and movement direction.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: NAME, template: `%s | ${NAME}` },
  description,
  openGraph: { type: "website", siteName: NAME, title: NAME, description, locale: "en_US" },
  twitter: { card: "summary_large_image" },
};

// Structured data so search engines know who the site is about.
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: NAME,
  url: SITE_URL,
  jobTitle: ROLES.join(", "),
  email: `mailto:${CONTACT.email}`,
  sameAs: [CONTACT.igHref],
  alumniOf: ["London Contemporary Dance School", "Chapman University"],
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The intro script adds a class to <html> before hydration.
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>
        <Intro />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
