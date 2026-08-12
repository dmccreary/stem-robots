from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps
import qrcode
from qrcode.constants import ERROR_CORRECT_H
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


ROOT = Path("/Users/dan/Documents/ws/stem-robots")
OUT_DIR = ROOT / "output" / "motion-detection-kit"
PDF_DIR = ROOT / "output" / "pdf"
BG_PATH = ROOT / "output" / "motion-detection-kit" / "motion-background-source.png"
PHOTO_PATH = ROOT / "docs" / "kits" / "imu-mpu6050" / "motion-detection-kit.jpg"
MASCOT_PATH = ROOT / "docs" / "img" / "mascot" / "welcome.png"
PNG_PATH = OUT_DIR / "motion-detection-kit-label-7x4-300dpi.png"
PDF_PATH = PDF_DIR / "motion-detection-kit-label-7x4.pdf"

W, H = 2100, 1200  # 7 x 4 inches at 300 DPI
URL = "https://dmccreary.github.io/stem-robots/kits/imu-mpu6050/"


def font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/Supplemental/Avenir Next.ttc",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for candidate in candidates:
        try:
            # Avenir Next TTC: index 1 is Demi Bold and index 0 is Regular.
            return ImageFont.truetype(candidate, size=size, index=1 if bold else 0)
        except (OSError, ValueError):
            continue
    return ImageFont.load_default()


def rounded_crop(image: Image.Image, box, radius: int, border: int = 0, border_color="#1687d9"):
    x0, y0, x1, y1 = box
    width, height = x1 - x0, y1 - y0
    fitted = ImageOps.fit(image.convert("RGB"), (width, height), method=Image.Resampling.LANCZOS, centering=(0.48, 0.52))
    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, width - 1, height - 1), radius=radius, fill=255)
    if border:
        framed = Image.new("RGBA", (width + border * 2, height + border * 2), border_color)
        frame_mask = Image.new("L", framed.size, 0)
        ImageDraw.Draw(frame_mask).rounded_rectangle((0, 0, framed.width - 1, framed.height - 1), radius=radius + border, fill=255)
        framed.putalpha(frame_mask)
        fitted.putalpha(mask)
        framed.alpha_composite(fitted, (border, border))
        return framed
    fitted.putalpha(mask)
    return fitted


def draw_check(draw, x, y, color="#0b8f87"):
    draw.rounded_rectangle((x, y, x + 46, y + 46), radius=12, fill=color)
    draw.line((x + 11, y + 24, x + 20, y + 34, x + 37, y + 13), fill="white", width=7, joint="curve")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PDF_DIR.mkdir(parents=True, exist_ok=True)

    bg = Image.open(BG_PATH).convert("RGB")
    canvas_img = ImageOps.fit(bg, (W, H), method=Image.Resampling.LANCZOS)
    # A white veil keeps the generated art subtle and economical to print.
    veil = Image.new("RGBA", (W, H), (255, 255, 255, 38))
    canvas_img = Image.alpha_composite(canvas_img.convert("RGBA"), veil)
    draw = ImageDraw.Draw(canvas_img)

    navy = "#123A63"
    blue = "#087FC4"
    teal = "#0B938B"
    coral = "#F06B5D"
    yellow = "#F4B83A"
    pale = "#F7FBFD"

    # Title area.
    draw.text((74, 52), "Motion Detection Kit", font=font(132, True), fill=navy)
    draw.rounded_rectangle((78, 218, 905, 286), radius=34, fill="#E8F7FB", outline="#8BD7E3", width=3)
    draw.text((111, 226), "TILT  •  SPIN  •  SHAKE  •  CODE", font=font(50, True), fill=blue)

    # Hero hardware photograph.
    photo = Image.open(PHOTO_PATH)
    hero_box = (327, 320, 1197, 927)
    # Soft offset shadow on a light background.
    draw.rounded_rectangle((341, 337, 1211, 944), radius=54, fill=(27, 80, 114, 32))
    hero = rounded_crop(photo, hero_box, radius=48, border=9, border_color="#56C6D2")
    canvas_img.alpha_composite(hero, (hero_box[0] - 9, hero_box[1] - 9))

    # Sparky stays distinctly on the left and overlaps the photo like a host.
    mascot = Image.open(MASCOT_PATH).convert("RGBA")
    mascot.thumbnail((405, 455), Image.Resampling.LANCZOS)
    mascot_x, mascot_y = 16, 490
    canvas_img.alpha_composite(mascot, (mascot_x, mascot_y))

    # Compact component strip, all text >= 12 pt at 300 DPI.
    draw.rounded_rectangle((330, 966, 1188, 1045), radius=38, fill=navy)
    draw.text((392, 978), "6-AXIS IMU  •  OLED  •  PYTHON", font=font(50, True), fill="white")

    # Right checklist panel.
    panel = (1225, 300, 2040, 1127)
    draw.rounded_rectangle(panel, radius=52, fill=(255, 255, 255, 238), outline="#BBDCEB", width=5)
    draw.rounded_rectangle((1225, 300, 2040, 402), radius=52, fill="#EAF7FB")
    draw.rectangle((1225, 352, 2040, 402), fill="#EAF7FB")
    draw.text((1271, 326), "COMPUTATIONAL THINKING", font=font(54, True), fill=navy)

    items = [
        ("Break systems into parts", blue),
        ("Spot X, Y, Z patterns", teal),
        ("Design tilt & shake logic", coral),
        ("Test, debug & improve", blue),
        ("Calibrate noisy data", yellow),
        ("Fuse sensors for accuracy", teal),
    ]
    y = 425
    for label, color in items:
        draw_check(draw, 1272, y + 5, color)
        draw.text((1342, y), label, font=font(50, False), fill=navy)
        y += 68

    # QR call-to-action. The QR has a full quiet zone and high error correction.
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_H, box_size=12, border=4)
    qr.add_data(URL)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#123A63", back_color="white").convert("RGB")
    qr_img = qr_img.resize((246, 246), Image.Resampling.NEAREST)
    canvas_img.alpha_composite(qr_img.convert("RGBA"), (1748, 840))

    draw.text((1272, 865), "12 HANDS-ON", font=font(51, True), fill=coral)
    draw.text((1272, 925), "PROGRAMS", font=font(51, True), fill=coral)
    draw.text((1272, 1000), "SCAN TO START!", font=font(53, True), fill=blue)

    # Small color accents, still large enough to print cleanly.
    for x, color in [(80, teal), (110, yellow), (140, coral), (170, blue)]:
        draw.ellipse((x, 1092, x + 24, 1116), fill=color)
    draw.text((215, 1070), "Move it. Measure it. Make sense of it.", font=font(52, True), fill=navy)

    canvas_img.convert("RGB").save(PNG_PATH, dpi=(300, 300), quality=95)

    # Exact 7 x 4 inch PDF page, with the 300-DPI artwork filling the page.
    c = canvas.Canvas(str(PDF_PATH), pagesize=(7 * 72, 4 * 72), pageCompression=1)
    c.drawImage(ImageReader(str(PNG_PATH)), 0, 0, width=7 * 72, height=4 * 72)
    c.showPage()
    c.save()
    print(PNG_PATH)
    print(PDF_PATH)


if __name__ == "__main__":
    main()
