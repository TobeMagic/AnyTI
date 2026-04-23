#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path
from typing import Iterable

from PIL import Image, ImageChops


BATCHES: dict[str, list[str]] = {
    "selfmock_sheet_01": [
        "01_tian-g",
        "02_bei-t",
        "03_wifi-0",
        "04_ojbk-er",
        "05_sb-lv",
        "06_npc",
        "07_ghost",
        "08_emo-ji",
    ],
    "selfmock_sheet_02": [
        "09_wifi-er",
        "10_gua",
        "11_99plus",
        "12_mamo",
        "13_simp",
        "14_atm-404",
        "15_beta-01",
        "16_sbti-love",
    ],
    "animal_sheet_01": [
        "01_bone",
        "02_puzzle",
        "03_offline",
        "04_slime",
        "05_frog",
        "06_npc-bear",
        "07_eternal",
        "08_drama",
    ],
    "animal_sheet_02": [
        "09_snail",
        "10_hollow",
        "11_muted",
        "12_sisyphus",
        "13_simp-dove",
        "14_atm-duck",
        "15_trial-fox",
        "16_meer",
    ],
    "sweet_sheet_01": [
        "01_dear",
        "02_moon",
        "03_hush",
        "04_soft",
        "05_muse",
        "06_wish",
        "07_echo",
        "08_tear",
    ],
    "sweet_sheet_02": [
        "09_wait",
        "10_snow",
        "11_mute",
        "12_hill",
        "13_true",
        "14_gift",
        "15_trust",
        "16_hope",
    ],
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Crop a Banana-generated 4x2 LBTI sheet into 8 single-character PNG files."
    )
    parser.add_argument("--input", required=True, help="Path to the source sheet PNG/JPG.")
    parser.add_argument("--batch", required=True, choices=sorted(BATCHES.keys()), help="Batch key.")
    parser.add_argument("--output-dir", required=True, help="Directory to write cropped PNG files.")
    parser.add_argument("--cols", type=int, default=4, help="Grid columns. Default: 4")
    parser.add_argument("--rows", type=int, default=2, help="Grid rows. Default: 2")
    parser.add_argument("--trim", action="store_true", help="Trim empty border based on sampled background color.")
    parser.add_argument("--margin", type=int, default=0, help="Extra transparent margin after trim. Default: 0")
    return parser.parse_args()


def estimate_background(image: Image.Image) -> tuple[int, int, int, int]:
    rgba = image.convert("RGBA")
    width, height = rgba.size
    sample_points = [
        (0, 0),
        (width - 1, 0),
        (0, height - 1),
        (width - 1, height - 1),
    ]
    pixels = [rgba.getpixel(point) for point in sample_points]
    return tuple(sum(channel) // len(pixels) for channel in zip(*pixels))


def trim_image(image: Image.Image, margin: int = 0) -> Image.Image:
    bg = estimate_background(image)
    background = Image.new("RGBA", image.size, bg)
    diff = ImageChops.difference(image.convert("RGBA"), background)
    bbox = diff.getbbox()
    if not bbox:
        return image.convert("RGBA")

    left, top, right, bottom = bbox
    cropped = image.convert("RGBA").crop((left, top, right, bottom))
    if margin <= 0:
        return cropped

    padded = Image.new("RGBA", (cropped.width + margin * 2, cropped.height + margin * 2), (0, 0, 0, 0))
    padded.paste(cropped, (margin, margin))
    return padded


def crop_grid(image: Image.Image, cols: int, rows: int) -> Iterable[Image.Image]:
    width, height = image.size
    cell_width = width // cols
    cell_height = height // rows

    for row in range(rows):
        for col in range(cols):
            left = col * cell_width
            top = row * cell_height
            right = (col + 1) * cell_width if col < cols - 1 else width
            bottom = (row + 1) * cell_height if row < rows - 1 else height
            yield image.crop((left, top, right, bottom))


def main() -> None:
    args = parse_args()
    names = BATCHES[args.batch]
    expected = args.cols * args.rows
    if len(names) != expected:
        raise SystemExit(f"Batch {args.batch} expects {len(names)} names, but grid is {expected} cells.")

    source = Path(args.input)
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    image = Image.open(source).convert("RGBA")

    for tile, name in zip(crop_grid(image, args.cols, args.rows), names):
        result = trim_image(tile, margin=args.margin) if args.trim else tile
        result.save(output_dir / f"{name}.png")

    print(f"Cropped {len(names)} characters from {source} into {output_dir}")


if __name__ == "__main__":
    main()
