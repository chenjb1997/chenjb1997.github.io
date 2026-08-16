"""Generate lightweight WebP previews for every footprint photo used by the site."""

from __future__ import annotations

import argparse
import re
from concurrent.futures import ProcessPoolExecutor, as_completed
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
FOOTPRINT_SOURCE = ROOT / "src" / "pages" / "Footprint.tsx"
ORIGINAL_DIR = ROOT / "public" / "footprint"
PREVIEW_DIR = ROOT / "public" / "footprint-preview"
PHOTO_PATTERN = re.compile(r'src:\s*"/footprint/([^"?]+\.(?:jpe?g|png))"', re.IGNORECASE)


def referenced_photos() -> list[str]:
    source = FOOTPRINT_SOURCE.read_text(encoding="utf-8")
    return sorted(set(PHOTO_PATTERN.findall(source)))


def optimize_one(job: tuple[str, int, int, bool]) -> tuple[str, int, int, str]:
    filename, max_edge, quality, force = job
    source = ORIGINAL_DIR / filename
    destination = (PREVIEW_DIR / filename).with_suffix(".webp")
    destination.parent.mkdir(parents=True, exist_ok=True)

    if not source.exists():
        return filename, 0, 0, "missing"
    if (
        not force
        and destination.exists()
        and destination.stat().st_mtime_ns >= source.stat().st_mtime_ns
    ):
        return filename, source.stat().st_size, destination.stat().st_size, "skipped"

    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGB")
        image.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
        if image.mode == "RGBA":
            background = Image.new("RGB", image.size, "white")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        image.save(
            destination,
            format="WEBP",
            quality=quality,
            method=6,
            optimize=True,
        )

    return filename, source.stat().st_size, destination.stat().st_size, "written"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--max-edge", type=int, default=1600)
    parser.add_argument("--quality", type=int, default=78)
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    photos = referenced_photos()
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)
    jobs = [(photo, args.max_edge, args.quality, args.force) for photo in photos]
    source_bytes = 0
    preview_bytes = 0
    written = skipped = missing = 0

    with ProcessPoolExecutor(max_workers=max(1, args.workers)) as executor:
        futures = [executor.submit(optimize_one, job) for job in jobs]
        for completed, future in enumerate(as_completed(futures), start=1):
            filename, source_size, preview_size, status = future.result()
            source_bytes += source_size
            preview_bytes += preview_size
            if status == "written":
                written += 1
            elif status == "skipped":
                skipped += 1
            else:
                missing += 1
                print(f"Missing source: {filename}", flush=True)
            if completed % 25 == 0 or completed == len(futures):
                print(
                    f"Processed {completed}/{len(futures)} "
                    f"(written {written}, skipped {skipped}, missing {missing})",
                    flush=True,
                )

    ratio = (preview_bytes / source_bytes * 100) if source_bytes else 0
    print(
        f"Finished: {preview_bytes / 1024 / 1024:.1f} MiB previews from "
        f"{source_bytes / 1024 / 1024:.1f} MiB originals ({ratio:.2f}%).",
        flush=True,
    )


if __name__ == "__main__":
    main()
