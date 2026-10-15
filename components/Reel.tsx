"use client";
import { useEffect, useRef, useState } from "react";
import { Img } from "./Img";
import type { Photo } from "@/lib/content";

// Hero reel. The still renders first (it is also the LCP image); the video sits on
// top and fades in once it is actually playing, so there is no black flash.
// People with "reduce motion" on only ever see the still.
export function Reel({ still, className, sizes = "100vw", alt = "" }: { still: Photo; className: string; sizes?: string; alt?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotion(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // React does not always emit the `muted` attribute in server HTML, and browsers
  // only autoplay muted video, so set it by hand before asking to play.
  useEffect(() => {
    const v = ref.current;
    if (!v || !motion) return;
    v.muted = true;
    v.play().catch(() => {});
    // The browser may already be playing before hydration, in which case the
    // `playing` event fired before React was listening.
    if (!v.paused && v.readyState >= 2) setPlaying(true);
  }, [motion]);

  return (
    <>
      <Img photo={still} preload sizes={sizes} className={className} alt={alt} style={{ opacity: playing ? 0 : undefined, transition: "opacity .8s ease" }} />
      {motion && (
        <video
          ref={ref}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden
          onPlaying={() => setPlaying(true)}
          onTimeUpdate={(e) => { if (!playing && e.currentTarget.currentTime > 0) setPlaying(true); }}
          className={className}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "var(--grade)", opacity: playing ? undefined : 0, transition: "opacity .8s ease" }}
        >
          <source src="/videos/reel.webm" type="video/webm" />
          <source src="/videos/reel.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
