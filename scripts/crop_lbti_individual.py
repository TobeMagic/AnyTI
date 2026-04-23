"""
Crop individual character images from 3 source sheets:
  1. 纯白背景最终版刺面.png → self-mock characters
  2. 唯美设定稿4_4.jpeg     → animal characters
  3. 甜心面白底.png         → sweet characters

Layout for all sheets: 4 columns × 4 rows, left-to-right, top-to-bottom.
Order maps to lbti-personality-system.md table row 1→16.

SELF-MOCK order (侧面4_4.png, colormap-based mask):
  1  TIAN-G    舔者
  2  BEI-T     备胎
  3  WiFi-0    信号丢失体
  4  OJBK-er   都行无所谓者
  5  SB-lv     自我攻略者
  6  NPC       路人甲型恋人
  7  GHOST     赛博守寡者
  8  EMO-ji    戏精破碎者
  9  WiFi-er   被动连接人
 10  GUA       寡者
 11  99+       消息免打扰体
 12  MAMO      巨石吗喽
 13  SIMP      纯爱战神
 14  ATM-404   无效提款机
 15  BETA-01   试用期人
 16  SBTI-LOVE 傻逼爱情测试者

ANIMAL order (唯美设定稿4_4.jpeg, row/col index matches table):
  1  BONE        等铃铛的骨头犬
  2  PUZZLE      习惯替补的拼图猬
  3  OFFLINE     一碰就缩的断电章鱼
  4  SLIME       说随便的软泥史莱姆
  5  FROG        靠想象活着的导演蛙
  6  NPC-BEAR    站角落鼓掌的观众熊
  7  ETERNAL     给回忆上坟的守灵鹤
  8  DRAMA       自己写悲剧的编剧羊
  9  SNAIL       等别人敲壳的慢热蜗
 10  HOLLOW      风一吹就响的空心水母
 11  MUTED       把心跳调成震动的静音豚
 12  SISYPHUS    每天推同一块石头的西西弗猿
 13  SIMP-DOVE   还在写信的遗世信鸽
 14  ATM-DUCK    以为能买到爱的吐钞鸭
 15  TRIAL-FOX   永远在实习的述职狐
 16  MEER        不敢下场的旁观獴

SWEET order (甜心面4_4.jpeg, row/col index matches table):
  1  DEAR    偏爱独奏者
  2  MOON    月光守夜人
  3  HUSH    心跳静默者
  4  SOFT    柔软回声者
  5  MUSE    幻想成诗者
  6  WISH    角落许愿者
  7  ECHO    念念回响者
  8  TEAR    眼泪收藏家
  9  WAIT    原地开花者
 10  SNOW    初雪未落者
 11  MUTE    静音心动者
 12  HILL    日升推石者
 13  TRUE    真心手写者
 14  GIFT    礼物馈赠者
 15  TRUST   认真见习者
 16  HOPE    爱情相信者
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np

BASE_DIR = Path(__file__).resolve().parents[1]

# ─── Source files ──────────────────────────────────────────────────────────────
SELF_SHEET = BASE_DIR / "docs/image_w2048_h2048_纯白背景最终版刺面.png"
ANIMAL_SHEET = BASE_DIR / "docs/image_w2048_h2048_16角色合集_唯美设定稿_无文字_表情更丰富_局部更锐利4_4.jpeg"
SWEET_SHEET = BASE_DIR / "docs/image_w2400_h1792_甜心面白底.png"

# ─── Output dirs ──────────────────────────────────────────────────────────────
OUT_SELF   = BASE_DIR / "public/images/lbti/individual/self"
OUT_ANIMAL = BASE_DIR / "public/images/lbti/individual/animal"
OUT_SWEET  = BASE_DIR / "public/images/lbti/individual/sweet"

# ─── Character names (by row/col order 0-indexed) ────────────────────────────
SELF_NAMES = [
    "tian-g", "bei-t", "wifi-0", "ojbk-er",
    "sb-lv",  "npc",    "ghost",  "emo-ji",
    "wifi-er","gua",     "99plus", "mamo",
    "simp",   "atm-404","beta-01","sbti-love",
]
ANIMAL_NAMES = [
    "bone",       "puzzle",    "offline",   "slime",
    "frog",       "npc-bear",  "eternal",   "drama",
    "snail",      "hollow",    "muted",     "sisyphus",
    "simp-dove",  "atm-duck",  "trial-fox",  "meer",
]
SWEET_NAMES = [
    "dear",  "moon",  "hush",  "soft",
    "muse",  "wish",  "echo",  "tear",
    "wait",  "snow",  "mute",  "hill",
    "true",  "gift",  "trust", "hope",
]

# ─── Grid sizes ──────────────────────────────────────────────────────────────
SELF_CELL      = (512, 512)
SELF_GRID      = (4, 4)
SELF_SHEET_SIZE = (2048, 2048)

ANIMAL_CELL     = (512, 512)
ANIMAL_GRID     = (4, 4)
ANIMAL_SHEET_SIZE = (2048, 2048)

SWEET_CELL     = (600, 448)
SWEET_GRID     = (4, 4)
SWEET_SHEET_SIZE = (2400, 1792)


def get_cell_coords(idx, grid_cols, cell_w, cell_h):
    """Return (x, y) pixel coordinates of cell top-left."""
    row, col = divmod(idx, grid_cols)
    return col * cell_w, row * cell_h


def flood_fill_to_transparent(
    img: Image.Image,
    target_bg: np.ndarray | None = None,
    threshold: float = 28.0,
    blur_radius: float = 0.8,
) -> Image.Image:
    """
    Remove connected edge background into true transparency.
    This keeps inner highlights/details because only edge-connected pixels are removed.
    """
    rgba = img.convert("RGBA")
    arr = np.array(rgba, dtype=np.float32)
    h, w = arr.shape[:2]

    if target_bg is None:
        target_bg = np.array([
            arr[0, 0, :3],
            arr[0, w - 1, :3],
            arr[h - 1, 0, :3],
            arr[h - 1, w - 1, :3],
        ], dtype=np.float32).mean(axis=0)

    thr_sq = threshold * threshold
    visited = np.zeros((h, w), dtype=bool)
    queue: list[tuple[int, int]] = []

    for y, x in ((0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)):
        visited[y, x] = True
        queue.append((y, x))

    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]
    idx = 0
    while idx < len(queue):
        cy, cx = queue[idx]
        idx += 1
        for dy, dx in dirs:
            ny, nx = cy + dy, cx + dx
            if ny < 0 or ny >= h or nx < 0 or nx >= w or visited[ny, nx]:
                continue

            dr = arr[ny, nx, 0] - target_bg[0]
            dg = arr[ny, nx, 1] - target_bg[1]
            db = arr[ny, nx, 2] - target_bg[2]
            if (dr * dr + dg * dg + db * db) <= thr_sq:
                visited[ny, nx] = True
                queue.append((ny, nx))

    bg_mask = visited
    fg_mask = ~bg_mask

    # Soft alpha edge to reduce hard jaggies
    alpha = np.where(fg_mask, 255, 0).astype(np.uint8)
    alpha_img = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(radius=blur_radius))
    alpha_arr = np.array(alpha_img, dtype=np.uint8)

    out = np.array(rgba, dtype=np.uint8)
    out[:, :, 3] = alpha_arr
    out[bg_mask, 0:3] = 0
    return Image.fromarray(out, mode="RGBA")


def remove_white_bg(img: Image.Image) -> Image.Image:
    """White studio background => transparent PNG."""
    return flood_fill_to_transparent(
        img,
        target_bg=np.array([255.0, 255.0, 255.0], dtype=np.float32),
        threshold=34.0,
        blur_radius=0.7,
    )


def remove_corner_bg(img: Image.Image) -> Image.Image:
    """Auto infer corner color for non-white sheets (animal set)."""
    return flood_fill_to_transparent(
        img,
        target_bg=None,
        threshold=24.0,
        blur_radius=0.8,
    )


def process_sheet(
    sheet_path: Path,
    output_dir: Path,
    names: list[str],
    cell_size: tuple[int, int],
    grid: tuple[int, int],
    sheet_size: tuple[int, int],
    mask_func,
    pad: int = 0,
):
    """Crop each cell from sheet, apply background mask, save as PNG."""
    output_dir.mkdir(parents=True, exist_ok=True)

    img = Image.open(sheet_path).convert("RGBA")
    cell_w, cell_h = cell_size
    grid_cols, _ = grid
    sheet_w, sheet_h = sheet_size

    results = []
    for idx, name in enumerate(names):
        x, y = get_cell_coords(idx, grid_cols, cell_w, cell_h)

        left   = max(0, x - pad)
        top    = max(0, y - pad)
        right  = min(sheet_w, x + cell_w + pad)
        bottom = min(sheet_h, y + cell_h + pad)

        cell = img.crop((left, top, right, bottom))
        cell_clean = mask_func(cell)

        out_path = output_dir / f"{name}.png"
        cell_clean.save(out_path, "PNG")
        results.append((name, out_path))
        print(f"  [OK] {name}.png  ({right-left}x{bottom-top})")

    return results


def main():
    print("=" * 60)
    print("LBTI Character Sheet Cropper")
    print("=" * 60)

    # ── 1. Self-mock characters ────────────────────────────────────────────
    print(f"\n[1/3] Self-mock  ({SELF_SHEET.name})")
    results_self = process_sheet(
        SELF_SHEET, OUT_SELF, SELF_NAMES,
        SELF_CELL, SELF_GRID, SELF_SHEET_SIZE,
        remove_white_bg,
    )

    # ── 2. Animal characters ────────────────────────────────────────────────
    print(f"\n[2/3] Animal  ({ANIMAL_SHEET.name})")
    results_animal = process_sheet(
        ANIMAL_SHEET, OUT_ANIMAL, ANIMAL_NAMES,
        ANIMAL_CELL, ANIMAL_GRID, ANIMAL_SHEET_SIZE,
        remove_corner_bg,
    )

    # ── 3. Sweet characters ────────────────────────────────────────────────
    print(f"\n[3/3] Sweet  ({SWEET_SHEET.name})")
    results_sweet = process_sheet(
        SWEET_SHEET, OUT_SWEET, SWEET_NAMES,
        SWEET_CELL, SWEET_GRID, SWEET_SHEET_SIZE,
        remove_white_bg,
    )

    print("============================================================")
    print("Done!")
    print(f"  Self-mock: {len(results_self)}  => {OUT_SELF}")
    print(f"  Animal:    {len(results_animal)}  => {OUT_ANIMAL}")
    print(f"  Sweet:     {len(results_sweet)}  => {OUT_SWEET}")
    print("============================================================")


if __name__ == "__main__":
    main()
