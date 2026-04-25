"""Generate lightweight local WebP thumbnails for LBTI character grids."""

from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).resolve().parents[1]
SOURCE_ROOT = BASE_DIR / "public/images/lbti/individual"
OUTPUT_ROOT = BASE_DIR / "public/images/lbti/thumbs"
MAX_SIZE = (128, 128)


def generate_thumbnail(source: Path) -> Path:
    face_dir = source.parent.name
    output_dir = OUTPUT_ROOT / face_dir
    output_dir.mkdir(parents=True, exist_ok=True)
    output = output_dir / f"{source.stem}.webp"

    with Image.open(source) as image:
        thumb = image.convert("RGBA")
        thumb.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
        thumb.save(output, "WEBP", quality=82, method=6)

    return output


def main() -> None:
    sources = sorted(SOURCE_ROOT.glob("*/*.png"))
    if not sources:
        raise SystemExit(f"No source PNG files found under {SOURCE_ROOT}")

    outputs = [generate_thumbnail(source) for source in sources]
    total_size = sum(output.stat().st_size for output in outputs)
    print(f"Generated {len(outputs)} thumbnails in {OUTPUT_ROOT}")
    print(f"Total thumbnail size: {total_size / 1024:.1f} KiB")


if __name__ == "__main__":
    main()
