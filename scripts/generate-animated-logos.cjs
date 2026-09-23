/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");

const source = fs.readFileSync("logo/ixlos-school.svg", "utf8");
const pathData = source.match(/<path d="([\s\S]+?)" stroke=/)?.[1];

if (!pathData) throw new Error("Vector path topilmadi");

const reducedMotion = "@media(prefers-reduced-motion:reduce){*{animation-duration:.001ms!important;animation-iteration-count:1!important}}";
const path = `<path id="logo" pathLength="1" d="${pathData}" fill-rule="evenodd"/>`;
const clips = `<clipPath id="left"><rect x="700" y="560" width="1110" height="1700"/></clipPath><clipPath id="right"><rect x="1800" y="560" width="1110" height="1700"/></clipPath><clipPath id="center"><rect x="1370" y="1000" width="870" height="690"/></clipPath><clipPath id="word"><rect x="850" y="2290" width="1900" height="700"/></clipPath>`;
const use = (attrs = "") => `<use href="#logo" ${attrs}/>`;
const svg = (style, body, extra = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3601 3601" role="img" aria-label="Ixlos School animated logosi"><style>${style}${reducedMotion}</style><defs>${path}${clips}${extra}</defs>${body}</svg>`;

const animations = {
  "intro-01-signature-classic.svg": svg(
    `.draw{fill:transparent;stroke:#163e32;stroke-width:10;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:draw 4.8s cubic-bezier(.45,0,.25,1) .3s both}.fill{fill:#163e32;opacity:0;animation:fill 1.1s ease 4.15s both}@keyframes draw{to{stroke-dashoffset:0}}@keyframes fill{to{opacity:1}}`,
    `${use('class="draw"')}${use('class="fill"')}`
  ),
  "intro-02-signature-staged.svg": svg(
    `.draw{fill:transparent;stroke:#163e32;stroke-width:11;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1}.laurel{animation:draw 3.3s ease .25s both}.center{animation:draw 2.5s ease 1.55s both}.word{animation:draw 2.4s ease 2.8s both}.fill{fill:#163e32;opacity:0;animation:fill 1s ease 4.55s both}@keyframes draw{to{stroke-dashoffset:0}}@keyframes fill{to{opacity:1}}`,
    `<g class="draw laurel" clip-path="url(#left)">${use()}</g><g class="draw laurel" clip-path="url(#right)">${use()}</g><g class="draw center" clip-path="url(#center)">${use()}</g><g class="draw word" clip-path="url(#word)">${use()}</g>${use('class="fill"')}`
  ),
  "intro-03-signature-dual.svg": svg(
    `.draw{fill:transparent;stroke:#163e32;stroke-width:10;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;animation:draw 4.9s cubic-bezier(.5,0,.2,1) .25s both}.left{stroke-dashoffset:1}.right{stroke-dashoffset:-1}.fill{fill:#163e32;opacity:0;animation:fill 1s ease 4.25s both}@keyframes draw{to{stroke-dashoffset:0}}@keyframes fill{to{opacity:1}}`,
    `<g class="draw left" clip-path="url(#halfLeft)">${use()}</g><g class="draw right" clip-path="url(#halfRight)">${use()}</g>${use('class="fill"')}`,
    `<clipPath id="halfLeft"><rect width="1801" height="3601"/></clipPath><clipPath id="halfRight"><rect x="1800" width="1801" height="3601"/></clipPath>`
  ),
  "intro-04-signature-ink.svg": svg(
    `.ghost{fill:transparent;stroke:#163e32;stroke-width:4;opacity:.18}.ink{fill:transparent;stroke:#163e32;stroke-width:7;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:1;stroke-dashoffset:1;animation:ink 5.6s cubic-bezier(.4,0,.2,1) .2s both}.fill{fill:#163e32;opacity:0;animation:fill 1.2s ease 4.75s both}@keyframes ink{0%{stroke-dashoffset:1;stroke-width:4}75%{stroke-width:8}100%{stroke-dashoffset:0;stroke-width:13}}@keyframes fill{to{opacity:1}}`,
    `${use('class="ghost"')}${use('class="ink"')}${use('class="fill"')}`
  ),
  "intro-gold-reveal.svg": svg(
    `.outline{fill:transparent;stroke:url(#gold);stroke-width:12;stroke-linejoin:round;stroke-linecap:round;opacity:0;animation:appear 1.35s cubic-bezier(.4,0,.2,1) .1s both}.fill{fill:url(#gold);opacity:0;animation:fill 1s cubic-bezier(.4,0,.2,1) 1.2s both}@keyframes appear{to{opacity:1}}@keyframes fill{to{opacity:1}}`,
    `${use('class="outline"')}${use('class="fill"')}`,
    `<linearGradient id="gold" x1="0" x2="1"><stop stop-color="#9b742d"/><stop offset=".48" stop-color="#f1d486"/><stop offset="1" stop-color="#b98c38"/></linearGradient>`
  ),
  "loader-01-scan-vertical.svg": svg(
    `.scan{animation:scan 4.4s cubic-bezier(.45,0,.55,1) infinite}@keyframes scan{0%,8%{transform:translateY(-2200px)}50%{transform:translateY(2200px)}92%,100%{transform:translateY(-2200px)}}`,
    `<g mask="url(#mask)"><rect width="3601" height="3601" fill="#163e32" opacity=".14"/><rect class="scan" width="3601" height="1050" y="1280" fill="url(#vertical)"/></g>`,
    `<mask id="mask">${use('fill="#fff"')}</mask><linearGradient id="vertical" x1="0" y1="0" x2="0" y2="1"><stop stop-color="transparent"/><stop offset=".5" stop-color="#163e32"/><stop offset="1" stop-color="transparent"/></linearGradient>`
  ),
  "loader-02-scan-horizontal.svg": svg(
    `.scan{animation:scan 4.8s cubic-bezier(.45,0,.55,1) infinite}@keyframes scan{0%,8%{transform:translateX(-2300px)}50%{transform:translateX(2300px)}92%,100%{transform:translateX(-2300px)}}`,
    `<g mask="url(#mask)"><rect width="3601" height="3601" fill="#163e32" opacity=".14"/><rect class="scan" x="1280" width="1050" height="3601" fill="url(#horizontal)"/></g>`,
    `<mask id="mask">${use('fill="#fff"')}</mask><linearGradient id="horizontal"><stop stop-color="transparent"/><stop offset=".5" stop-color="#163e32"/><stop offset="1" stop-color="transparent"/></linearGradient>`
  ),
  "loader-03-scan-dual.svg": svg(
    `.top{animation:top 5.2s cubic-bezier(.45,0,.55,1) infinite}.bottom{animation:bottom 5.2s cubic-bezier(.45,0,.55,1) infinite}@keyframes top{0%,10%{transform:translateY(-2100px)}50%{transform:translateY(380px)}90%,100%{transform:translateY(-2100px)}}@keyframes bottom{0%,10%{transform:translateY(2100px)}50%{transform:translateY(-380px)}90%,100%{transform:translateY(2100px)}}`,
    `<g mask="url(#mask)"><rect width="3601" height="3601" fill="#163e32" opacity=".12"/><rect class="top" width="3601" height="760" y="1050" fill="url(#down)"/><rect class="bottom" width="3601" height="760" y="1790" fill="url(#up)"/></g>`,
    `<mask id="mask">${use('fill="#fff"')}</mask><linearGradient id="down" x1="0" y1="0" x2="0" y2="1"><stop stop-color="transparent"/><stop offset="1" stop-color="#163e32"/></linearGradient><linearGradient id="up" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#163e32"/><stop offset="1" stop-color="transparent"/></linearGradient>`
  ),
  "loader-04-scan-diagonal.svg": svg(
    `.scan{transform:rotate(-24deg);transform-origin:center;animation:scan 5.4s cubic-bezier(.45,0,.55,1) infinite}@keyframes scan{0%,8%{transform:translate(-2300px,1100px) rotate(-24deg)}50%{transform:translate(2300px,-1100px) rotate(-24deg)}92%,100%{transform:translate(-2300px,1100px) rotate(-24deg)}}`,
    `<g mask="url(#mask)"><rect width="3601" height="3601" fill="#163e32" opacity=".12"/><rect class="scan" x="1280" y="-500" width="1050" height="4600" fill="url(#diagonal)"/></g>`,
    `<mask id="mask">${use('fill="#fff"')}</mask><linearGradient id="diagonal"><stop stop-color="transparent"/><stop offset=".5" stop-color="#c8a45a"/><stop offset="1" stop-color="transparent"/></linearGradient>`
  ),
  "loader-05-scan-radar.svg": svg(
    `.radar{transform-origin:1800px 1800px;animation:radar 5.8s linear infinite}@keyframes radar{to{transform:rotate(360deg)}}`,
    `<g mask="url(#mask)"><rect width="3601" height="3601" fill="#163e32" opacity=".12"/><path class="radar" d="M1800 1800 L1800 -900 A2700 2700 0 0 1 3709 3709 Z" fill="url(#radarGradient)"/></g>`,
    `<mask id="mask">${use('fill="#fff"')}</mask><radialGradient id="radarGradient"><stop stop-color="#c8a45a"/><stop offset="1" stop-color="#163e32" stop-opacity=".15"/></radialGradient>`
  ),
};

for (const filename of Object.keys(animations)) {
  if (filename.startsWith("intro-") && filename !== "intro-gold-reveal.svg") delete animations[filename];
  if (filename.startsWith("loader-") && filename !== "loader-04-scan-diagonal.svg") delete animations[filename];
}

for (const directory of ["logo/animated", "public/brand/animated"]) {
  fs.mkdirSync(directory, { recursive: true });
  for (const [filename, content] of Object.entries(animations)) fs.writeFileSync(`${directory}/${filename}`, content);
}
