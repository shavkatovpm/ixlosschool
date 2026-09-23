import fs from "node:fs/promises";
import sharp from "sharp";

const source = "public/brand/ixlos-school-original.png";
const variants = {
  "ixlos-school.svg": { color: [22, 62, 50], label: "yashil" },
  "ixlos-school-navy.svg": { color: [16, 35, 63], label: "to'q ko'k" },
  "ixlos-school-gold.svg": { color: [200, 164, 90], label: "oltin" },
  "ixlos-school-white.svg": { color: [255, 255, 255], label: "oq" },
};

const { data, info } = await sharp(source)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (const [filename, variant] of Object.entries(variants)) {
  const pixels = Buffer.alloc(data.length);

  for (let index = 0; index < data.length; index += 4) {
    const darkness = 255 - (data[index] + data[index + 1] + data[index + 2]) / 3;
    const alpha = Math.max(0, Math.min(255, Math.round(darkness * 1.5)));

    pixels[index] = variant.color[0];
    pixels[index + 1] = variant.color[1];
    pixels[index + 2] = variant.color[2];
    pixels[index + 3] = alpha;
  }

  const png = await sharp(pixels, { raw: info }).png().toBuffer();
  const embeddedImage = png.toString("base64");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${info.width} ${info.height}" role="img" aria-label="Ixlos School ${variant.label} logosi"><image width="${info.width}" height="${info.height}" href="data:image/png;base64,${embeddedImage}"/></svg>`;

  await fs.writeFile(`public/brand/${filename}`, svg);
}
