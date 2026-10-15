# Taylor Lauren Hughes

Portfolio site for Taylor Lauren Hughes (dancer, choreographer, dance educator). Next.js 16 App Router, static output, deploys to Vercel.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build, all routes static
npm run lint
```

## Where things live

| What | Where |
| --- | --- |
| All copy, ordering, photo choices, contact details | `lib/content.ts` |
| Photo sizes (generated, do not edit) | `lib/photos.generated.ts` |
| Colors, fonts, warm photo grade | `app/globals.css`, `app/layout.tsx` |
| Pages | `app/page.tsx` (home), `app/{about,choreography,performance,teaching,movement-direction,portfolio}/page.tsx` |
| Shared components | `components/` |

Open questions for Taylor are tagged `Q1` to `Q13` in `lib/content.ts` and listed in `PLAN.md`.

## Updating photos or the reel

`scripts/prepare-assets.py` rebuilds `public/photos`, `public/posters`, `public/videos`, the share image and the icons from Taylor's originals in `../taylor-website/` (the `photos/` folder, `Taylor's Website.docx`, and the reel at `mockups/public/videos/taylor_montage.mp4`). It needs Python 3 with Pillow, and ffmpeg.

```bash
python3 scripts/prepare-assets.py
```

To add or reorder photos, edit the `PROJECTS` map at the top of the script, rerun it, then update `lib/content.ts` if a project was added. Photos that only exist inside the docx are kept in `assets/source/from-doc/`.
