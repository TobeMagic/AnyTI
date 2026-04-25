"""
Crop individual character images from 3 final source sheets:
  1. 刺面final.png     → self-mock characters
  2. 动物角色final.png → animal characters
  3. 甜心面final.png   → sweet characters

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
SELF_SHEET = BASE_DIR / "docs/刺面final.png"
ANIMAL_SHEET = BASE_DIR / "docs/动物角色final.png"
SWEET_SHEET = BASE_DIR / "docs/甜心面final.png"

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
GRID = (4, 4)
COMPONENT_MARGIN = 16


def get_cell_box(idx: int, grid_cols: int, grid_rows: int, sheet_w: int, sheet_h: int):
    """Return proportional 4x4 crop box, robust to non-divisible sheet sizes."""
    row, col = divmod(idx, grid_cols)
    left = round(col * sheet_w / grid_cols)
    top = round(row * sheet_h / grid_rows)
    right = round((col + 1) * sheet_w / grid_cols)
    bottom = round((row + 1) * sheet_h / grid_rows)
    return left, top, right, bottom


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


def remove_edge_artifacts(img: Image.Image) -> Image.Image:
    """
    Final sheets have a few neighboring-cell fragments crossing crop boundaries.
    Remove small alpha components touching the crop edge, while keeping the main
    character and detached inner decorations such as hearts, letters, and stars.
    """
    rgba = img.convert("RGBA")
    arr = np.array(rgba, dtype=np.uint8)
    alpha = arr[:, :, 3]
    mask = alpha > 12
    h, w = mask.shape
    visited = np.zeros((h, w), dtype=bool)
    components: list[dict[str, object]] = []
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    for y in range(h):
        for x in range(w):
            if not mask[y, x] or visited[y, x]:
                continue

            stack = [(y, x)]
            visited[y, x] = True
            pixels: list[tuple[int, int]] = []
            min_y = max_y = y
            min_x = max_x = x

            while stack:
                cy, cx = stack.pop()
                pixels.append((cy, cx))
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)

                for dy, dx in dirs:
                    ny, nx = cy + dy, cx + dx
                    if ny < 0 or ny >= h or nx < 0 or nx >= w:
                        continue
                    if visited[ny, nx] or not mask[ny, nx]:
                        continue
                    visited[ny, nx] = True
                    stack.append((ny, nx))

            components.append(
                {
                    "pixels": pixels,
                    "area": len(pixels),
                    "touches_edge": min_x == 0 or min_y == 0 or max_x == w - 1 or max_y == h - 1,
                }
            )

    if not components:
        return rgba

    largest_area = max(component["area"] for component in components)
    cleaned_alpha = np.zeros_like(alpha)

    for component in components:
        area = int(component["area"])
        touches_edge = bool(component["touches_edge"])
        keep = area >= max(36, largest_area * 0.015)
        if touches_edge and area < largest_area * 0.12:
            keep = False

        if keep:
            for py, px in component["pixels"]:
                cleaned_alpha[py, px] = alpha[py, px]

    out = arr.copy()
    out[:, :, 3] = cleaned_alpha
    out[cleaned_alpha == 0, 0:3] = 0
    return Image.fromarray(out, mode="RGBA")


def collect_components(rgba: Image.Image, alpha_threshold: int = 12, min_area: int = 12):
    """Return alpha connected components for a full transparent sheet."""
    arr = np.array(rgba.convert("RGBA"), dtype=np.uint8)
    alpha = arr[:, :, 3]
    mask = alpha > alpha_threshold
    h, w = mask.shape
    visited = np.zeros((h, w), dtype=bool)
    components: list[dict[str, object]] = []
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    for y in range(h):
        for x in range(w):
            if not mask[y, x] or visited[y, x]:
                continue

            stack = [(y, x)]
            visited[y, x] = True
            pixels: list[tuple[int, int]] = []
            min_y = max_y = y
            min_x = max_x = x
            sum_y = 0
            sum_x = 0

            while stack:
                cy, cx = stack.pop()
                pixels.append((cy, cx))
                sum_y += cy
                sum_x += cx
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)

                for dy, dx in dirs:
                    ny, nx = cy + dy, cx + dx
                    if ny < 0 or ny >= h or nx < 0 or nx >= w:
                        continue
                    if visited[ny, nx] or not mask[ny, nx]:
                        continue
                    visited[ny, nx] = True
                    stack.append((ny, nx))

            area = len(pixels)
            if area < min_area:
                continue

            components.append(
                {
                    "pixels": pixels,
                    "area": area,
                    "bbox": (min_x, min_y, max_x, max_y),
                    "centroid": (sum_x / area, sum_y / area),
                }
            )

    return arr, components


def assign_components_to_grid(components: list[dict[str, object]], grid: tuple[int, int], sheet_size: tuple[int, int]):
    """Assign each component to the nearest grid cell by component centroid."""
    grid_cols, grid_rows = grid
    sheet_w, sheet_h = sheet_size
    groups: list[list[dict[str, object]]] = [[] for _ in range(grid_cols * grid_rows)]

    for component in components:
        cx, cy = component["centroid"]
        col = min(grid_cols - 1, max(0, int(cx * grid_cols / sheet_w)))
        row = min(grid_rows - 1, max(0, int(cy * grid_rows / sheet_h)))
        groups[row * grid_cols + col].append(component)

    return groups


def process_sheet(
    sheet_path: Path,
    output_dir: Path,
    names: list[str],
    grid: tuple[int, int],
    mask_func,
    margin: int = COMPONENT_MARGIN,
):
    """Assign full-sheet components to each grid cell and save transparent PNGs."""
    output_dir.mkdir(parents=True, exist_ok=True)

    img = Image.open(sheet_path).convert("RGBA")
    cleaned_sheet = mask_func(img)
    cleaned_arr, components = collect_components(cleaned_sheet)
    sheet_w, sheet_h = cleaned_sheet.size
    grid_cols, grid_rows = grid
    groups = assign_components_to_grid(components, grid, (sheet_w, sheet_h))

    results = []
    for idx, name in enumerate(names):
        group = groups[idx]
        if not group:
            print(f"  [WARN] {name}.png has no assigned components; using empty fallback")
            out = np.zeros((256, 256, 4), dtype=np.uint8)
            out_path = output_dir / f"{name}.png"
            Image.fromarray(out, mode="RGBA").save(out_path, "PNG")
            results.append((name, out_path))
            continue

        min_x = min(component["bbox"][0] for component in group)
        min_y = min(component["bbox"][1] for component in group)
        max_x = max(component["bbox"][2] for component in group)
        max_y = max(component["bbox"][3] for component in group)

        source_left = max(0, int(min_x) - margin)
        source_top = max(0, int(min_y) - margin)
        source_right = min(sheet_w, int(max_x) + margin + 1)
        source_bottom = min(sheet_h, int(max_y) + margin + 1)
        canvas_w = source_right - source_left
        canvas_h = source_bottom - source_top

        out = np.zeros((canvas_h, canvas_w, 4), dtype=np.uint8)
        for component in groups[idx]:
            for py, px in component["pixels"]:
                if source_left <= px < source_right and source_top <= py < source_bottom:
                    oy = py - source_top
                    ox = px - source_left
                    if 0 <= oy < canvas_h and 0 <= ox < canvas_w:
                        out[oy, ox] = cleaned_arr[py, px]

        out_path = output_dir / f"{name}.png"
        Image.fromarray(out, mode="RGBA").save(out_path, "PNG")
        results.append((name, out_path))
        print(f"  [OK] {name}.png  ({canvas_w}x{canvas_h}, components={len(group)})")

    return results


def main():
    print("=" * 60)
    print("LBTI Character Sheet Cropper")
    print("=" * 60)

    # ── 1. Self-mock characters ────────────────────────────────────────────
    print(f"\n[1/3] Self-mock  ({SELF_SHEET.name})")
    results_self = process_sheet(
        SELF_SHEET, OUT_SELF, SELF_NAMES,
        GRID,
        remove_white_bg,
    )

    # ── 2. Animal characters ────────────────────────────────────────────────
    print(f"\n[2/3] Animal  ({ANIMAL_SHEET.name})")
    results_animal = process_sheet(
        ANIMAL_SHEET, OUT_ANIMAL, ANIMAL_NAMES,
        GRID,
        remove_white_bg,
    )

    # ── 3. Sweet characters ────────────────────────────────────────────────
    print(f"\n[3/3] Sweet  ({SWEET_SHEET.name})")
    results_sweet = process_sheet(
        SWEET_SHEET, OUT_SWEET, SWEET_NAMES,
        GRID,
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
