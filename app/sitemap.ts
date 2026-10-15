import type { MetadataRoute } from "next";
import { NAV, SITE_URL } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", ...NAV.map((n) => n.path)].map((path) => ({ url: `${SITE_URL}${path}` }));
}
