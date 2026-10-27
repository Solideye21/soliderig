/* ==========================================================================
   export-art.js  —  writes the SolidRig artwork to image files
   Run:  node tools/export-art.js
   Output: <Downloads>/SolidRig Pictures/  (SVG everywhere, PNG alongside)

   The site draws its art inline; this script exists so the same artwork can
   be used in WhatsApp, Instagram, invoices and print without a screenshot.
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(os.homedir(), "Downloads", "SolidRig Pictures");
const PARTS_DIR = path.join(OUT, "parts");
const RIGS_DIR = path.join(OUT, "rigs");

/* art.js / parts.js attach themselves to window — give them one. */
const sandbox = { window: {} };
const load = (file) => fs.readFileSync(path.join(ROOT, "site", "assets", "js", file), "utf8");
new Function("window", load("art.js"))(sandbox.window);
new Function("window", load("parts.js"))(sandbox.window);

const ART = sandbox.window.SOLIDRIG_ART;
const PARTS = sandbox.window.SOLIDRIG_PARTS;
if (!ART || !PARTS) throw new Error("Could not load art.js / parts.js");

fs.mkdirSync(PARTS_DIR, { recursive: true });
fs.mkdirSync(RIGS_DIR, { recursive: true });

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ------------------------------------------------------------ part icons */
let count = 0;
for (const cat of PARTS.categories) {
  for (const opt of cat.options) {
    const file = path.join(PARTS_DIR, `${cat.id}-${slug(opt.id)}.svg`);
    fs.writeFileSync(file, ART.partIcon(cat.id, opt), "utf8");
    count++;
  }
}

/* ---------------------------------------------------------- assembled rigs */
const byId = (catId, id) => PARTS.categories.find((c) => c.id === catId).options.find((o) => o.id === id);

const rigs = PARTS.presets.map((preset) => {
  const sel = {};
  for (const [cat, id] of Object.entries(preset.parts)) sel[cat] = byId(cat, id);
  sel._title = preset.name;
  sel._target = preset.target;
  const svg = ART.rig(sel, `export-${preset.id}`);
  fs.writeFileSync(path.join(RIGS_DIR, `${preset.id}.svg`), svg, "utf8");
  return { preset, svg };
});

/* --------------------------------------------------------------- PNG pass */
const browsers = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const chrome = browsers.find((p) => fs.existsSync(p));

let pngs = 0;
if (chrome) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "solidrig-"));
  const shoot = (svg, outPng, w, h) => {
    const html = path.join(tmp, "art.html");
    fs.writeFileSync(
      html,
      `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:transparent}` +
        `svg{display:block;width:${w}px;height:${h}px}</style>${svg}`,
      "utf8"
    );
    execFileSync(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=2",
        "--default-background-color=00000000",
        `--window-size=${w},${h}`,
        `--screenshot=${outPng}`,
        "file:///" + html.replace(/\\/g, "/"),
      ],
      { stdio: "ignore" }
    );
    if (fs.existsSync(outPng)) pngs++;
  };

  for (const cat of PARTS.categories) {
    for (const opt of cat.options) {
      const svg = fs.readFileSync(path.join(PARTS_DIR, `${cat.id}-${slug(opt.id)}.svg`), "utf8");
      shoot(svg, path.join(PARTS_DIR, `${cat.id}-${slug(opt.id)}.png`), 200, 150);
    }
  }
  for (const r of rigs) {
    shoot(r.svg, path.join(RIGS_DIR, `${r.preset.id}.png`), 560, 720);
  }
}

/* --------------------------------------------------------------- manifest */
const manifest = [
  "SolidRig artwork export",
  "======================",
  "",
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "parts/  — one SVG (and PNG) per part option, transparent background",
  "         200x150 SVG, 400x300 PNG",
  "rigs/   — the five site builds assembled, 560x720 SVG, 1120x1440 PNG",
  "",
  "Part files:",
  ...PARTS.categories.flatMap((c) =>
    c.options.map((o) => `  ${c.id}-${slug(o.id)}.svg  — ${o.name}`)
  ),
  "",
  "Rig files:",
  ...PARTS.presets.map((p) => `  ${p.id}.svg  — ${p.name} (${p.target})`),
  "",
  "Regenerate: node tools/export-art.js",
];
fs.writeFileSync(path.join(OUT, "README.txt"), manifest.join("\r\n"), "utf8");

console.log(`SVG files: ${count + rigs.length}  (${count} parts, ${rigs.length} rigs)`);
console.log(`PNG files: ${pngs}${chrome ? "" : "  (no Chrome/Edge found — SVG only)"}`);
console.log(`Output:    ${OUT}`);
