"""Draws the Fileway branding into assets/ (needs Pillow: pip install pillow).

Run from the project root:  python3 tools/generate_branding.py
The mark is a fanned stack of folders with a storage ring and bar on the front
one, in the colors of the default Navy theme.
"""
import os
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

NAVY, NAVY_LIGHT = (0, 25, 53), (10, 62, 112)
ACCENT, ACCENT_DARK = (0, 184, 255), (14, 112, 178)
WHITE, INK, MUTED, LINE = (255, 255, 255), (11, 42, 77), (159, 179, 204), (195, 208, 224)
SS = 4  # supersampling
OUT = "assets"

FOLDER_W, FOLDER_H, FOLDER_R = 0.46, 0.34, 0.045  # body, as a fraction of the mark size
TAB_W, TAB_H = 0.17, 0.045  # the tab sticking up on the top left


def gradient(w, h):
    """Navy with a soft cyan-blue glow from the top left."""
    img = Image.new("RGB", (w, h), NAVY)
    glow = Image.radial_gradient("L").resize((int(w * 1.6), int(h * 1.6)))
    layer = Image.new("RGB", glow.size, NAVY_LIGHT)
    mask = ImageChops.invert(glow).point(lambda v: int(v * 0.9))
    img.paste(layer, (int(-w * 0.45), int(-h * 0.45)), mask)
    return img


def folder_layer(size, unit, details, grow=1.0):
    """One folder (body + tab), centered on a transparent canvas of size x size."""
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    c = size / 2
    w, h, r = FOLDER_W * unit * grow, FOLDER_H * unit * grow, FOLDER_R * unit * grow
    top = c - h / 2 + 0.03 * unit  # body sits a little low, the tab fills the space above
    tab_w, tab_h = TAB_W * unit * grow, TAB_H * unit * grow
    d.rounded_rectangle((c - w / 2, top - tab_h, c - w / 2 + tab_w, top + tab_h), r * 0.8, fill=WHITE)
    d.rounded_rectangle((c - w / 2, top, c + w / 2, top + h), r, fill=WHITE)
    if details:
        details(d, c, unit)
    return layer


def bar(d, x0, yc, w, h, fill):
    d.rounded_rectangle((x0, yc - h / 2, x0 + w, yc + h / 2), h / 2, fill=fill)


# Where things sit on the front folder (all relative to the mark size `u`, centered on `c`).
# The body spans c+0.03u-0.17u .. c+0.03u+0.17u vertically, so these are shifted by 0.03u.
def _geometry(c, u):
    cx, cy, R = c - 0.115 * u, c + 0.045 * u, 0.075 * u
    return cx, cy, R, 0.03 * u


def storage_details(d, c, u):
    """What is drawn on the front folder: a usage ring, two lines and a storage bar."""
    cx, cy, R, thick = _geometry(c, u)
    box = (cx - R, cy - R, cx + R, cy + R)
    d.ellipse(box, fill=LINE)
    d.pieslice(box, -90, 160, fill=ACCENT)
    d.ellipse((cx - R + thick, cy - R + thick, cx + R - thick, cy + R - thick), fill=WHITE)
    bar(d, c - 0.005 * u, c + 0.012 * u, 0.17 * u, 0.03 * u, INK)
    bar(d, c - 0.005 * u, c + 0.065 * u, 0.115 * u, 0.022 * u, MUTED)
    bar(d, c - 0.19 * u, c + 0.155 * u, 0.38 * u, 0.036 * u, LINE)
    bar(d, c - 0.19 * u, c + 0.155 * u, 0.24 * u, 0.036 * u, ACCENT)


def tint(layer, color):
    solid = Image.new("RGBA", layer.size, color + (255,))
    solid.putalpha(layer.getchannel("A"))
    return solid


def shadow(layer, dy, blur, opacity):
    a = layer.getchannel("A").filter(ImageFilter.GaussianBlur(blur))
    a = a.point(lambda v: int(v * opacity))
    s = Image.new("RGBA", layer.size, (0, 8, 24, 255))
    s.putalpha(a)
    return ImageChops.offset(s, 0, dy)


def render_mark(size, scale):
    """The fanned stack of folders on a transparent size x size canvas."""
    big = size * SS
    unit = big * scale
    canvas = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    for angle, color in ((-24, ACCENT_DARK), (-12, ACCENT)):  # back folder, middle folder
        folder = tint(folder_layer(big, unit, None), color).rotate(-angle, resample=Image.BICUBIC)
        canvas.alpha_composite(shadow(folder, int(0.012 * unit), 0.012 * unit, 0.45))
        canvas.alpha_composite(folder)
    front = folder_layer(big, unit, storage_details)
    canvas.alpha_composite(shadow(front, int(0.014 * unit), 0.014 * unit, 0.5))
    canvas.alpha_composite(front)
    return canvas.resize((size, size), Image.LANCZOS)


def render_mono(size, scale):
    """One-color version for Android's themed icons: only the alpha matters."""
    big = size * SS
    unit = big * scale
    backs = [folder_layer(big, unit, None).rotate(a, resample=Image.BICUBIC) for a in (24, 12)]
    sil = ImageChops.lighter(backs[0].getchannel("A"), backs[1].getchannel("A"))
    gap = folder_layer(big, unit, None, grow=1.07).getchannel("A")  # clear gap around the front folder
    sil = ImageChops.subtract(sil, gap)
    sil = ImageChops.lighter(sil, folder_layer(big, unit, None).getchannel("A"))
    holes = Image.new("L", (big, big), 0)  # the ring, lines and bar become holes
    hd = ImageDraw.Draw(holes)
    c = big / 2
    cx, cy, R, thick = _geometry(c, unit)
    hd.ellipse((cx - R, cy - R, cx + R, cy + R), fill=255)
    hd.ellipse((cx - R + thick, cy - R + thick, cx + R - thick, cy + R - thick), fill=0)
    bar(hd, c - 0.005 * unit, c + 0.012 * unit, 0.17 * unit, 0.03 * unit, 255)
    bar(hd, c - 0.005 * unit, c + 0.065 * unit, 0.115 * unit, 0.022 * unit, 255)
    bar(hd, c - 0.19 * unit, c + 0.155 * unit, 0.38 * unit, 0.036 * unit, 255)
    sil = ImageChops.subtract(sil, holes)
    out = Image.new("RGBA", (big, big), (255, 255, 255, 0))
    out.putalpha(sil)
    return out.resize((size, size), Image.LANCZOS)


def save(img, name, mode=None):
    path = os.path.join(OUT, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.convert(mode).save(path, optimize=True) if mode else img.save(path, optimize=True)
    print("wrote", path, img.size)


def icon_on_gradient(size, scale):
    base = gradient(size, size).convert("RGBA")
    base.alpha_composite(render_mark(size, scale))
    return base


def font(size):
    for p in ("/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def main():
    # App icon (full bleed, no transparency, so the OS can round it)
    save(icon_on_gradient(1024, 1.42), "icon.png", "RGB")
    # Android adaptive icon: background, foreground (kept in the 66dp safe zone), monochrome
    save(gradient(512, 512), "android-icon-background.png", "RGB")
    save(render_mark(512, 1.0), "android-icon-foreground.png")
    save(render_mono(432, 1.0), "android-icon-monochrome.png")
    # Splash: just the mark, the background color comes from app.json
    save(render_mark(1024, 1.0), "splash-icon.png")
    # Web favicon
    save(icon_on_gradient(256, 1.5).resize((48, 48), Image.LANCZOS), "favicon.png", "RGB")
    # Play Store: 512 icon and 1024x500 feature graphic
    save(icon_on_gradient(512, 1.42), "store/play-icon-512.png", "RGB")
    fg = gradient(1024, 500).convert("RGBA")
    mark = render_mark(500, 1.55)
    fg.alpha_composite(mark, (510, 0))
    d = ImageDraw.Draw(fg)
    d.text((70, 160), "Fileway", font=font(84), fill=WHITE)
    d.text((74, 275), "Browse. Search. See your space.", font=font(30), fill=ACCENT)
    save(fg, "store/feature-graphic-1024x500.png", "RGB")


if __name__ == "__main__":
    main()
