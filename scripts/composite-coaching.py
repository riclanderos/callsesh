"""
Composites coachingSetup.png onto the laptop screen in BookingSetup.png.
Output: public/images/coaching.png at 800x560.

Requires: Pillow, numpy  (pip install Pillow numpy)
"""
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import os, random

BASE   = r"c:\Users\Ricardo L\Desktop\Projects\callsesh\public\images"
LAPTOP = os.path.join(BASE, "BookingSetup.png")
UI     = os.path.join(BASE, "coachingSetup.png")
OUT    = os.path.join(BASE, "coaching.png")
DEBUG  = os.path.join(BASE, "_coaching_debug.png")  # remove after tuning

# ── 1. Load ───────────────────────────────────────────────────────────────────

laptop_orig = Image.open(LAPTOP).convert("RGBA")
ui_orig     = Image.open(UI).convert("RGBA")
W, IH = laptop_orig.size          # 1250 × 703  (IH = image height)
UW, UH = ui_orig.size            # 1200 × 800
print(f"Laptop: {W}x{IH}   UI: {UW}x{UH}")

# ── 2. Screen corners (inner content edge, inside the bezel) ─────────────────
#
# BookingSetup.png (1250×703) — MacBook viewed from slightly above/front.
# Adjust these 4 points if the warp looks off after a first run.
#
#   TL ────────────────────── TR
#   │                          │
#   │      laptop screen       │
#   │                          │
#   BL ────────────────────── BR
#
# The screen has very slight top-narrowing perspective (camera ~slightly elevated).

screen_tl = (110,  30)
screen_tr = (1128,  30)
screen_br = (1128, 548)
screen_bl = (110,  548)

# ── 3. Compute homography (UI corners → screen corners) ──────────────────────

def compute_homography(src, dst):
    """Return 3×3 H such that dst ≈ H @ src (homogeneous)."""
    A = []
    for (xs, ys), (xd, yd) in zip(src, dst):
        A += [
            [-xs, -ys, -1,   0,   0,  0, xd*xs, xd*ys, xd],
            [  0,   0,  0, -xs, -ys, -1, yd*xs, yd*ys, yd],
        ]
    _, _, Vt = np.linalg.svd(np.array(A, dtype=np.float64))
    H = Vt[-1].reshape(3, 3)
    return H / H[2, 2]

ui_corners     = [(0, 0), (UW, 0), (UW, UH), (0, UH)]
screen_corners = [screen_tl, screen_tr, screen_br, screen_bl]

H     = compute_homography(ui_corners, screen_corners)  # UI → screen space
H_inv = np.linalg.inv(H)                                # screen space → UI

# ── 4. Perspective-warp the UI into laptop-photo space ───────────────────────

# Build (W × H) pixel grid in homogeneous coords
xs_d, ys_d = np.meshgrid(np.arange(W), np.arange(IH))
coords_d = np.stack([xs_d.ravel(), ys_d.ravel(), np.ones(W * IH, dtype=np.float64)])

# Map each output pixel back to UI source coords
coords_s = H_inv @ coords_d
coords_s /= coords_s[2:3]

src_x = coords_s[0].reshape(IH, W)
src_y = coords_s[1].reshape(IH, W)

# Valid mask: pixel is inside the UI image bounds
valid = (src_x >= 0) & (src_x < UW - 1) & (src_y >= 0) & (src_y < UH - 1)

# Bilinear sampling
x0 = np.floor(src_x).astype(np.int32)
y0 = np.floor(src_y).astype(np.int32)
x1 = np.clip(x0 + 1, 0, UW - 1)
y1 = np.clip(y0 + 1, 0, UH - 1)
dx = (src_x - x0)[..., np.newaxis]
dy = (src_y - y0)[..., np.newaxis]

x0c = np.clip(x0, 0, UW - 1)
y0c = np.clip(y0, 0, UH - 1)

ui_arr = np.array(ui_orig, dtype=np.float32)
warped = (
    ui_arr[y0c, x0c] * (1 - dx) * (1 - dy) +
    ui_arr[y0c, x1 ] * dx       * (1 - dy) +
    ui_arr[y1,  x0c] * (1 - dx) * dy       +
    ui_arr[y1,  x1 ] * dx       * dy
)
warped = warped.astype(np.uint8)

# Zero out pixels outside the screen quad
warped[~valid] = 0

warped_img = Image.fromarray(warped, "RGBA")

# ── 5. Screen realism post-processing ────────────────────────────────────────

# 5a. Desaturate the UI slightly (real screens look less vivid in photos)
warped_rgb = warped_img.convert("RGB")
warped_rgb = ImageEnhance.Color(warped_rgb).enhance(0.85)

# 5b. Lower brightness to match the ambient lighting in the photo
warped_rgb = ImageEnhance.Brightness(warped_rgb).enhance(0.82)

# 5c. Slight warm tone shift (the photo has warm tungsten ambient light)
r, g, b = warped_rgb.split()
r = r.point(lambda v: min(255, int(v * 1.04)))  # very mild warm push
b = b.point(lambda v: min(255, int(v * 0.97)))
warped_rgb = Image.merge("RGB", (r, g, b))

# 5d. Gentle blur to reduce the "pasted-on" sharpness
warped_rgb = warped_rgb.filter(ImageFilter.GaussianBlur(radius=0.6))

# 5e. Screen edge vignette (screens are darkest at corners)
vig_arr = np.ones((IH, W), dtype=np.float32)
# Vectorised vignette only over the screen quad bounding box
x_bb = np.arange(W)
y_bb = np.arange(IH)
xx, yy = np.meshgrid(x_bb, y_bb)
# Normalised distance from screen centre
scr_cx = (screen_tl[0] + screen_br[0]) / 2
scr_cy = (screen_tl[1] + screen_br[1]) / 2
scr_rx = (screen_br[0] - screen_tl[0]) / 2
scr_ry = (screen_br[1] - screen_tl[1]) / 2
dist = np.sqrt(((xx - scr_cx) / scr_rx)**2 + ((yy - scr_cy) / scr_ry)**2)
vig_arr = np.clip(1.0 - 0.08 * dist**2, 0.88, 1.0)  # keep subtle
vig_pil = Image.fromarray((vig_arr * 255).astype(np.uint8), "L")

# 5f. Screen glare: single soft diagonal streak (top-left to mid)
glare = Image.new("RGB", (W, IH), (0, 0, 0))
gdraw = ImageDraw.Draw(glare)
# A bright diagonal highlight along the top-left of the screen
glare_pts = [
    screen_tl,
    (screen_tl[0] + int(scr_rx * 0.35), screen_tl[1]),
    (screen_tl[0] + int(scr_rx * 0.25), screen_tl[1] + int(scr_ry * 0.30)),
    (screen_tl[0], screen_tl[1] + int(scr_ry * 0.20)),
]
gdraw.polygon(glare_pts, fill=(180, 185, 195))
glare = glare.filter(ImageFilter.GaussianBlur(radius=18))

# ── 6. Composite onto laptop photo ───────────────────────────────────────────

laptop_rgb = laptop_orig.convert("RGB")

# Create composite base: warp the processed UI as a full-photo-sized RGBA layer
comp_layer = warped_rgb.convert("RGBA")
# Apply vignette to alpha channel
comp_arr = np.array(comp_layer, dtype=np.float32)
valid_f = valid.astype(np.float32)
comp_arr[..., 3] = valid_f * 255  # alpha: 255 inside screen, 0 outside

# Paste UI onto laptop
result = laptop_rgb.copy()
ui_final = Image.fromarray(comp_arr.astype(np.uint8), "RGBA")
result.paste(ui_final.convert("RGB"), mask=ui_final.split()[3])

# Blend glare on top with screen alpha mask as limiter
glare_layer = np.array(glare, dtype=np.float32)
result_arr  = np.array(result, dtype=np.float32)
# Glare alpha: multiply by valid mask and a low opacity
glare_alpha = valid_f * 0.09
result_arr = result_arr * (1 - glare_alpha[..., np.newaxis]) + glare_layer * glare_alpha[..., np.newaxis]
result_arr = np.clip(result_arr, 0, 255)
result = Image.fromarray(result_arr.astype(np.uint8), "RGB")

# ── 7. Subtle film grain (matching photo sensor noise) ───────────────────────

np.random.seed(42)
grain = np.random.normal(0, 3.5, (IH, W, 3)).astype(np.float32)
result_arr = np.array(result, dtype=np.float32) + grain
result_arr = np.clip(result_arr, 0, 255)
result = Image.fromarray(result_arr.astype(np.uint8), "RGB")

# ── 8. Very slight photo warmth overall (home office ambient) ────────────────
result = ImageEnhance.Color(result).enhance(1.05)
result = ImageEnhance.Contrast(result).enhance(1.02)

# ── 9. Save debug (full res) then final at 800×560 ───────────────────────────

# Debug: draw screen corner markers on a copy
debug = result.copy()
ddraw = ImageDraw.Draw(debug)
for pt in screen_corners:
    ddraw.ellipse([pt[0]-6, pt[1]-6, pt[0]+6, pt[1]+6], fill="red", outline="white")
ddraw.line([screen_tl, screen_tr, screen_br, screen_bl, screen_tl], fill="red", width=2)
debug.save(DEBUG)
print("Debug saved ->", DEBUG)

# Final output
final = result.resize((800, 560), Image.LANCZOS)
final.save(OUT)
print("Final saved ->", OUT, f"({final.size[0]}x{final.size[1]})")
