#!/usr/bin/env python3
"""Builds public/ assets from Taylor's originals.

Reads ../taylor-website/photos and the docx, writes:
  assets/source/from-doc/imageN.jpg   doc-only originals, untouched
  public/photos/{project}-{nn}.jpg    2000px long side, JPEG q82
  public/posters/{youtubeId}.jpg      YouTube thumbnails
  public/videos/reel.mp4 + reel.webm  muted hero reel
  lib/photos.generated.ts             src + width/height for next/image
  app/opengraph-image.jpg, icons      share image and favicon

Run: python3 scripts/prepare-assets.py  (needs Pillow and ffmpeg)
"""
import shutil
import subprocess
import urllib.request
import zipfile
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT.parent / "taylor-website"
DOCX = SRC / "Taylor's Website.docx"
PF = SRC / "photos" / "Portfolio & Recent Projects"
MD = SRC / "photos" / "Movement Direction"
REEL = SRC / "mockups" / "public" / "videos" / "taylor_montage.mp4"

LONG_SIDE = 2000
QUALITY = 82


def doc(n):
    return ("doc", f"image{n}.jpg")


# Order within each project is the order in Taylor's doc.
PROJECTS = {
    "breath": [PF / "4681_RPP2026_BalletNights.jpeg", PF / "4741_RPP2026_BalletNights.jpeg",
               PF / "4525_RPP2026_BalletNights.jpeg", PF / "4405_RPP2026_BalletNights.jpeg"],
    "zomer": [PF / "IMG_1422(1).PNG", PF / "IMG_1421.PNG", doc(2), doc(21), doc(3), doc(34), doc(15)],
    "italic": [doc(8), PF / "100-DSC05309.jpeg", PF / "88-DSC05292.jpeg", PF / "101-DSC05310.jpeg",
               PF / "IMG_5723.PNG", PF / "IMG_5683.PNG"],
    "body-fischer": [PF / "IMG_3171.JPG", PF / "IMG_3167.JPG", doc(14), PF / "IMG_3177.JPG", doc(38)],
    "studio": [PF / "IMG_9731.JPG", doc(46), PF / "IMG_9741.JPG", PF / "IMG_9748.JPG",
               PF / "IMG_9736.JPG", PF / "IMG_9710.JPG"],
    "mokita": [doc(1), doc(23), doc(12), PF / "f5f95b6d-f5e7-49d3-91a3-56dddbd4978a.jpg", doc(33), doc(31)],
    "md-owens": [MD / "MD(4).jpg", MD / "MD(1).jpg", MD / "MD(3).jpg", MD / "MD.jpg",
                 MD / "MD(5).jpg", MD / "MD(2).jpg"],
    "md-clandestine": [MD / "IMG_0003.JPG", MD / "IMG_0011.JPG", MD / "IMG_0017.JPG", MD / "IMG_0018.JPG",
                       doc(41), MD / "IMG_9991.JPG", MD / "IMG_9992.JPG"],
}

YOUTUBE = ["cP7MPj4-uPo", "7jJ3gfekW1s", "sU9FKLZcwwg", "qeiWKer3oGQ", "JM6zBSPJVGE",
           "xpmag2Gvi0g", "orMNvNEUzB8", "CWFmWHok1bY", "lYgOe6lZSsU"]


def fresh(path):
    shutil.rmtree(path, ignore_errors=True)
    path.mkdir(parents=True)
    return path


def extract_doc_images(out):
    names = {s[1] for photos in PROJECTS.values() for s in photos if isinstance(s, tuple)}
    with zipfile.ZipFile(DOCX) as z:
        for name in sorted(names):
            (out / name).write_bytes(z.read(f"word/media/{name}"))
    return len(names)


def save_photo(src, dest):
    im = Image.open(src)
    icc = im.info.get("icc_profile")
    im = ImageOps.exif_transpose(im).convert("RGB")
    im.thumbnail((LONG_SIDE, LONG_SIDE), Image.LANCZOS)
    im.save(dest, "JPEG", quality=QUALITY, progressive=True, optimize=True, icc_profile=icc)
    return im.size


def fetch_poster(vid, dest):
    for size in ("maxresdefault", "sddefault", "hqdefault"):
        try:
            with urllib.request.urlopen(f"https://i.ytimg.com/vi/{vid}/{size}.jpg", timeout=20) as r:
                dest.write_bytes(r.read())
            break
        except Exception:
            continue
    else:
        raise RuntimeError(f"no thumbnail for {vid}")
    # Lower sizes are 4:3 with black bars around a 16:9 frame; crop them off.
    with Image.open(dest) as im:
        w, h = im.size
        if w * 9 != h * 16:
            top = (h - w * 9 // 16) // 2
            im = im.crop((0, top, w, top + w * 9 // 16))
            im.save(dest, "JPEG", quality=90)
        return im.size


def encode_reel(out):
    common = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(REEL), "-an"]
    subprocess.run(common + ["-c:v", "libx264", "-crf", "26", "-preset", "slow", "-pix_fmt", "yuv420p",
                             "-movflags", "+faststart", str(out / "reel.mp4")], check=True)
    subprocess.run(common + ["-c:v", "libvpx-vp9", "-crf", "36", "-b:v", "0", "-row-mt", "1",
                             str(out / "reel.webm")], check=True)


def make_share_and_icons(app):
    # Open Graph: IMG_9710 cropped to 1200x630 around Taylor's head and shoulders.
    im = ImageOps.exif_transpose(Image.open(PF / "IMG_9710.JPG")).convert("RGB")
    im = ImageOps.fit(im, (1200, 630), Image.LANCZOS, centering=(0.5, 0.22))
    im.save(app / "opengraph-image.jpg", "JPEG", quality=85, optimize=True)
    (app / "opengraph-image.alt.txt").write_text("Taylor Lauren Hughes")

    # Monogram: an ink square with a ground-colored serif T (Georgia stands in for Cormorant).
    from PIL import ImageDraw, ImageFont

    def monogram(size):
        icon = Image.new("RGB", (size, size), "#171512")
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", int(size * 0.72))
        ImageDraw.Draw(icon).text((size / 2, size / 2), "T", font=font, fill="#f3efe7", anchor="mm")
        return icon

    monogram(512).save(app / "icon.png")
    monogram(180).save(app / "apple-icon.png")
    monogram(48).convert("RGBA").save(app / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])  # Next reads RGBA ICOs only


def main():
    from_doc = fresh(ROOT / "assets" / "source" / "from-doc")
    print(f"doc images: {extract_doc_images(from_doc)}")

    photos_dir = fresh(ROOT / "public" / "photos")
    lines = []
    for project, sources in PROJECTS.items():
        for i, s in enumerate(sources, 1):
            src = from_doc / s[1] if isinstance(s, tuple) else s
            key = f"{project}-{i:02d}"
            w, h = save_photo(src, photos_dir / f"{key}.jpg")
            lines.append(f'  "{key}": {{ src: "/photos/{key}.jpg", w: {w}, h: {h} }}, // {src.name}')
    print(f"photos: {len(lines)}")

    posters_dir = fresh(ROOT / "public" / "posters")
    poster_lines = []
    for vid in YOUTUBE:
        w, h = fetch_poster(vid, posters_dir / f"{vid}.jpg")
        poster_lines.append(f'  "{vid}": {{ src: "/posters/{vid}.jpg", w: {w}, h: {h} }},')
    print(f"posters: {len(poster_lines)}")

    encode_reel(fresh(ROOT / "public" / "videos"))
    print("reel: mp4 + webm")

    (ROOT / "lib").mkdir(exist_ok=True)
    (ROOT / "lib" / "photos.generated.ts").write_text(
        "// Generated by scripts/prepare-assets.py. Do not edit by hand.\n"
        "export const PHOTOS = {\n" + "\n".join(lines) + "\n} as const;\n\n"
        "export const POSTERS = {\n" + "\n".join(poster_lines) + "\n} as const;\n"
    )
    print("wrote lib/photos.generated.ts")

    make_share_and_icons(ROOT / "app")
    print("wrote app/opengraph-image.jpg and icons")


if __name__ == "__main__":
    main()
