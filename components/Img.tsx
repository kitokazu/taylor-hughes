import Image from "next/image";
import type { CSSProperties } from "react";
import type { Photo } from "@/lib/content";

// next/image with the site-wide warm photo grade (--grade, set in globals.css).
export function Img({ photo, sizes = "100vw", className, style, preload, alt }: {
  photo: Photo; sizes?: string; className?: string; style?: CSSProperties; preload?: boolean; alt?: string;
}) {
  return (
    <Image
      src={photo.src}
      width={photo.w}
      height={photo.h}
      alt={alt ?? photo.alt ?? ""}
      sizes={sizes}
      preload={preload}
      className={className}
      style={{ filter: "var(--grade)", ...style }}
    />
  );
}
