import type { CSSProperties } from "react";

// Letter ripple. Characters stay inside word spans so lines only break at spaces.
// Any ancestor with the `data-rh` attribute triggers it on hover/focus; the
// keyframes and timing live in each direction's CSS (`[data-rh]:hover [data-ch]`).
export function Ripple({ text }: { text: string }) {
  let i = 0;
  const words = text.split(" ");
  return (
    <span aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden style={{ whiteSpace: "nowrap", display: "inline-block" }}>
          {[...word].map((ch) => {
            const idx = i++;
            return (
              <span key={idx} data-ch style={{ display: "inline-block", "--i": idx } as CSSProperties}>
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 && (i++, " ")}
        </span>
      ))}
    </span>
  );
}
