import { embedUrl } from "@/lib/content";
import type { CSSProperties } from "react";

// Mounted only after Play, so no YouTube chrome or requests before then.
export function YouTube({ id, title, style, className }: { id: string; title: string; style?: CSSProperties; className?: string }) {
  return (
    <iframe
      src={embedUrl(id)}
      title={title}
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
      className={className}
      style={{ width: "100%", aspectRatio: "16/9", border: 0, background: "#000", display: "block", ...style }}
    />
  );
}
