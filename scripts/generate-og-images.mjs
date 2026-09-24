// Regenerates public/og/og-{uz,ru,en}.png (link-preview images) from the hero copy in messages/*.json,
// so the share image always matches the site. One-off tool, not part of the build.
//
//   npm i --no-save playwright-core
//   CHROME_PATH="/path/to/Chrome or Chromium binary" node scripts/generate-og-images.mjs
//
// Fonts (Manrope, Bodoni Moda) are loaded from Google Fonts, so this needs network access.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";

const root = path.resolve(import.meta.dirname, "..");
const chromePath = process.env.CHROME_PATH;
if (!chromePath) throw new Error("Set CHROME_PATH to a Chrome/Chromium executable.");

const crest = fs
  .readFileSync(path.join(root, "public/brand/ixlos-school-crest.svg"), "utf8")
  .replace(/fill="#[0-9a-fA-F]{3,8}"/g, 'fill="#eff4f7"');
const crestUri = `data:image/svg+xml;base64,${Buffer.from(crest).toString("base64")}`;

const html = (hero) => `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&family=Bodoni+Moda:wght@600&display=block" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; background: #163e32; color: #eff4f7; font-family: 'Manrope', sans-serif; position: relative; overflow: hidden; }
  .glow { position: absolute; inset: 0; background: radial-gradient(ellipse 70% 90% at 95% 10%, #285345 0%, rgba(22,62,50,0) 70%); }
  .mark { position: absolute; right: -40px; top: 40px; width: 520px; opacity: .1; }
  .brand { position: absolute; left: 80px; top: 64px; display: flex; align-items: center; gap: 20px; }
  .brand img { height: 64px; }
  .brand span { font-family: 'Bodoni Moda', serif; font-weight: 600; font-size: 34px; letter-spacing: .3em; text-transform: uppercase; }
  h1 { position: absolute; left: 80px; top: 172px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.08; }
  h1 .l1 { display: block; font-size: 96px; }
  h1 .l1 em { font-style: normal; color: #cdd8bc; }
  h1 .l2 { display: block; font-size: 74px; }
  h1 .l3 { display: block; font-size: 74px; color: #dbc38c; }
  .sub { position: absolute; left: 80px; bottom: 58px; right: 80px; display: flex; justify-content: space-between; align-items: flex-end; gap: 32px; }
  .sub p { font-size: 27px; font-weight: 600; color: #c8d8d1; line-height: 1.3; max-width: 760px; }
  .sub small { display: block; margin-bottom: 10px; font-size: 16px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #dbc38c; }
  .domain { font-size: 28px; font-weight: 800; color: #dbc38c; white-space: nowrap; }
</style>
<div class="glow"></div>
<img class="mark" src="${crestUri}" alt="">
<div class="brand"><img src="${crestUri}" alt=""><span>Ixlos School</span></div>
<h1><span class="l1">${hero.line1Pre} <em>${hero.line1Em}</em></span><span class="l2">${hero.line2}</span><span class="l3">${hero.line3}</span></h1>
<div class="sub"><p><small>${hero.eyebrowRight}</small>${hero.leadStrong}</p><div class="domain">ixlosschool.uz</div></div>`;

const browser = await chromium.launch({ executablePath: chromePath });
for (const locale of ["uz", "ru", "en"]) {
  const { hero } = JSON.parse(fs.readFileSync(path.join(root, `messages/${locale}.json`), "utf8"));
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(html(hero));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const file = path.join(root, `public/og/og-${locale}.png`);
  await page.screenshot({ path: file });
  await page.close();
  console.log(locale, `${Math.round(fs.statSync(file).size / 1024)} KB`);
}
await browser.close();
