"""
Crop individual character images from 3 source sheets:
  1. 侧面4_4.png        → self-mock characters (SBTI)
  2. 唯美设定稿4_4.jpeg → animal characters
  3. 甜心面4_4.jpeg     → sweet characters

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

BASE_DIR = Path(r"D:\Growth_up_youth\repo\AnyTI")

# ─── Source files ──────────────────────────────────────────────────────────────
SELF_SHEET = BASE_DIR / "docs/image_w2048_h2048_16角色_纯角色_透明背景 侧面4_4.png"
ANIMAL_SHEET = BASE_DIR / "docs/image_w2048_h2048_16角色合集_唯美设定稿_无文字_表情更丰富_局部更锐利4_4.jpeg"
SWEET_SHEET = BASE_DIR / "docs/image_w2400_h1792_甜心面4_4绿色背景.jpeg"

# ─── Output dirs ──────────────────────────────────────────────────────────────
OUT_SELF   = BASE_DIR / "images/lbti/individual/self"
OUT_ANIMAL = BASE_DIR / "images/lbti/individual/animal"
OUT_SWEET  = BASE_DIR / "images/lbti/individual/sweet"

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


def flood_fill_transparent(img: Image.Image) -> Image.Image:
    """
    Remove background using flood fill from corners, with alpha-matte edge smoothing.

    1. Flood-fill from corners, replacing matching pixels with page background color.
       Tight tolerance (~3*sigma) preserves character pixels that overlap with bg color.
    2. Build an alpha-matte: pixels far from the character (deep background) get full
       opacity (page bg), pixels near the character boundary get a soft transition
       from transparent to opaque, so the page background shows through naturally.
    3. Composite character over page background for clean output.

    This eliminates JPEG compression artifacts at the fill boundary and prevents
    the dark fringe artifacts that occur when character pixels nearly match the bg color.
    """
    PAGE_BG = (250, 245, 240)

    img = img.convert("RGBA")
    arr = np.array(img, dtype=np.float32)
    H, W = arr.shape[:2]

    # Step 1: Get background color from corners
    corner_colors = np.array([
        arr[0, 0, :3],
        arr[0, W - 1, :3],
        arr[H - 1, 0, :3],
        arr[H - 1, W - 1, :3],
    ])
    bg_color = corner_colors.mean(axis=0)

    # Flood fill: mark background pixels
    tolerance_sq = 12.0 ** 2  # very tight: only exact background

    visited = np.zeros((H, W), dtype=bool)
    queue = []
    for cy, cx in [(0, 0), (0, W - 1), (H - 1, 0), (H - 1, W - 1)]:
        if arr[cy, cx, 3] > 0:
            queue.append((cy, cx))
            visited[cy, cx] = True

    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]
    idx = 0
    while idx < len(queue):
        cy, cx = queue[idx]
        idx += 1
        for dc, dr in dirs:
            ny, nx = cy + dr, cx + dc
            if 0 <= ny < H and 0 <= nx < W and not visited[ny, nx]:
                if arr[ny, nx, 3] > 0:
                    dc_c = arr[ny, nx, 0] - bg_color[0]
                    dg_c = arr[ny, nx, 1] - bg_color[1]
                    db_c = arr[ny, nx, 2] - bg_color[2]
                    dist_sq = dc_c * dc_c + dg_c * dg_c + db_c * db_c
                    if dist_sq < tolerance_sq:
                        visited[ny, nx] = True
                        queue.append((ny, nx))

    # Step 2: Replace background with page bg color
    bg_mask = visited
    arr_out = arr.copy()
    arr_out[bg_mask, 0] = PAGE_BG[0]
    arr_out[bg_mask, 1] = PAGE_BG[1]
    arr_out[bg_mask, 2] = PAGE_BG[2]

    # Step 3: Alpha matte — blur the character/background boundary for smooth transition
    # Create a grayscale image: character=255 (white), background=0 (black)
    char_mask = ~bg_mask
    gray_arr = np.where(char_mask, 255, 0).astype(np.uint8)
    gray_img = Image.fromarray(gray_arr, mode="L")

    # Gaussian blur with radius=1 creates ~3px soft transition at boundary
    gray_blurred = gray_img.filter(ImageFilter.GaussianBlur(radius=1))
    alpha_arr = np.array(gray_blurred, dtype=np.float32)

    # Build RGBA output: character pixels keep their color, background shows page bg
    bg_r, bg_g, bg_b = PAGE_BG
    out_r = np.where(char_mask, arr[:, :, 0], bg_r)
    out_g = np.where(char_mask, arr[:, :, 1], bg_g)
    out_b = np.where(char_mask, arr[:, :, 2], bg_b)
    out_a = (alpha_arr).clip(0, 255).astype(np.uint8)

    out_arr = np.stack([out_r, out_g, out_b, out_a], axis=2).astype(np.uint8)
    return Image.fromarray(out_arr, mode="RGBA")


def remove_green_bg(img: Image.Image) -> Image.Image:
    """
    Remove green background and replace with page background color (#faf5f0).
    Returns an RGBA image with the green background replaced by the page bg color.
    """
    PAGE_BG = np.array([250, 245, 240], dtype=np.float32)

    img = img.convert("RGBA")
    arr = np.array(img, dtype=np.float32)

    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]

    # Reference greens
    ref_green      = np.array([0.0, 255.0, 0.0])
    ref_dark_green = np.array([46.0, 139.0, 87.0])  # sea green #2E8B57
    ref_forest     = np.array([34.0, 139.0, 34.0])  # forest green #228B22
    ref_moss       = np.array([80.0, 125.0, 42.0])  # moss green

    refs = np.array([ref_green, ref_dark_green, ref_forest, ref_moss])

    # Compute minimum distance to any green reference
    pixels = np.stack([r, g, b], axis=-1)   # shape: (H, W, 3)
    dists = np.linalg.norm(pixels[:, :, np.newaxis, :] - refs[np.newaxis, np.newaxis, :, :], axis=3)
    dist = dists.min(axis=2)

    threshold = 75.0
    # Identify green pixels (where dist < threshold and alpha > 0)
    is_green = (dist < threshold) & (a > 50)

    # Replace green pixels with page background color
    arr[is_green, 0] = PAGE_BG[0]
    arr[is_green, 1] = PAGE_BG[1]
    arr[is_green, 2] = PAGE_BG[2]
    # Keep alpha at 255 (opaque)
    arr[:, :, 3] = 255

    return Image.fromarray(arr.clip(0, 255).astype(np.uint8), mode="RGBA")


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
        flood_fill_transparent,
    )

    # ── 2. Animal characters ────────────────────────────────────────────────
    print(f"\n[2/3] Animal  ({ANIMAL_SHEET.name})")
    results_animal = process_sheet(
        ANIMAL_SHEET, OUT_ANIMAL, ANIMAL_NAMES,
        ANIMAL_CELL, ANIMAL_GRID, ANIMAL_SHEET_SIZE,
        flood_fill_transparent,
    )

    # ── 3. Sweet characters ────────────────────────────────────────────────
    print(f"\n[3/3] Sweet  ({SWEET_SHEET.name})")
    results_sweet = process_sheet(
        SWEET_SHEET, OUT_SWEET, SWEET_NAMES,
        SWEET_CELL, SWEET_GRID, SWEET_SHEET_SIZE,
        remove_green_bg,
    )

    print("============================================================")
    print("Done!")
    print(f"  Self-mock: {len(results_self)}  => {OUT_SELF}")
    print(f"  Animal:    {len(results_animal)}  => {OUT_ANIMAL}")
    print(f"  Sweet:     {len(results_sweet)}  => {OUT_SWEET}")
    print("============================================================")


if __name__ == "__main__":
    main()
