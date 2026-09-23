/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const potrace = require("potrace");

const input = "public/brand/ixlos-school-original.png";
const options = {
  threshold: 180,
  turdSize: 12,
  alphaMax: 1,
  optCurve: true,
  optTolerance: 0.2,
  color: "#163e32",
  background: "transparent",
};

potrace.trace(input, options, (error, svg) => {
  if (error) throw error;
  fs.writeFileSync("logo/ixlos-school.svg", svg);
  fs.writeFileSync("public/brand/ixlos-school.svg", svg);
  fs.writeFileSync("public/brand/ixlos-school-vector.svg", svg);
  fs.writeFileSync("public/brand/ixlos-school-navy.svg", svg.replaceAll("#163e32", "#10233f"));
  fs.writeFileSync("public/brand/ixlos-school-gold.svg", svg.replaceAll("#163e32", "#c8a45a"));
  fs.writeFileSync("public/brand/ixlos-school-white.svg", svg.replaceAll("#163e32", "#ffffff"));
});
