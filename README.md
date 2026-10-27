# SolidRig

Custom gaming and workstation PC builds, sold in Nigeria, priced in USD with a Naira conversion at the current rate — and every price calculated from an open, published cost model.

This folder is the project root. The website is a plain static site — no framework, no build step, no dependencies.

```
PC Rigs/
├── site/                        ← the website (this is what you deploy)
│   ├── index.html
│   └── assets/
│       ├── css/styles.css
│       ├── js/config.js         ← contact, FX rate, pricing model, commercials
│       ├── js/data.js           ← builds, parts budgets, component tier lists
│       ├── js/parts.js          ← build-your-own parts catalogue and presets
│       ├── js/art.js            ← vector part illustrations + assembled rig
│       ├── js/app.js            ← rendering, calculator, quote flow
│       ├── js/builder.js        ← build-your-own logic, bill, compatibility
│       └── img/favicon.svg
├── tools/
│   └── export-art.js            ← writes the artwork to image files
├── docs/
│   └── pricing-worksheet.md     ← the model, worked example and margin maths
├── README.md
├── CPU Tier List.txt            ← original research, untouched
├── AIO Cooler All Tier List.txt
├── ...                          ← other research notes and screenshots
```

## Preview it

Double-click `site/index.html`. It works straight from disk — deliberate, so you can preview on a machine with no tooling.

To preview the way a host will serve it:

```powershell
cd "site"
python -m http.server 8080
# open http://localhost:8080
```

## The site

| Section | What it does |
| --- | --- |
| Builds | Five builds, each with its parts budget, computed price and per-part tier grades |
| Build your own | Pick parts from pictures, watch the bill and the assembled-rig drawing update, download the picture |
| Pricing | Open-book calculator — change any input, watch the price recalculate, copy the cost sheet |
| Included | What every rig gets regardless of budget |
| Components | Component tier reference (S–F) built from the research notes |
| Sourcing | The 9-part purchasing sheet by tier, plus import cautions |
| Process | Consult → spec → source → assemble & test → deliver |
| FAQ | Warranty, delivery, FX, "why is this more than US retail" |
| Quote | Form → live estimate → formatted message opened in WhatsApp or email |

## What to edit first

| I want to change… | Edit this |
| --- | --- |
| WhatsApp number, email, city | `site/assets/js/config.js` → `phone`, `email`, `city` |
| Naira rate | `site/assets/js/config.js` → `ngnRate`, `rateUpdated` |
| Margin, duty allowance, fees | `site/assets/js/config.js` → `pricing` |
| Freight / labour / packaging per tier | `site/assets/js/config.js` → `tierAllowances` |
| Parts budget for a build | `site/assets/js/data.js` → `partsUsd` |
| Parts inside a build | `site/assets/js/data.js` → `parts` |
| Build names / blurbs | `site/assets/js/data.js` → `name`, `summary`, `target` |
| Component tier lists | `site/assets/js/data.js` → `SOLIDRIG_TIERS` |
| Part options, part prices, presets | `site/assets/js/parts.js` |
| Part and rig drawing | `site/assets/js/art.js` |
| Warranty, lead time, deposit terms | `site/assets/js/config.js` |

### Set your WhatsApp number

```js
phone: "2348012345678",   // digits only: country code + number, no +, no spaces
```

Until this is set, every call-to-action falls back to email and the buttons relabel themselves. A note is printed to the browser console telling you so.

## How "build your own" works

`site/assets/js/parts.js` holds eight categories — CPU, GPU, motherboard, memory, storage,
cooler, PSU, case — with one option per part, a tier grade and a USD price. The preset row maps
the five site builds onto those options.

- Clicking a part **picture** selects it and adds it to the build sheet. Click again to remove.
- The bill sums the selected parts, then runs the same cost model as the rest of the site
  (freight, duty, labour, warranty, margin), so the total is comparable with the pricing
  calculator and the build cards.
- Compatibility is checked live: socket, memory generation, ATX board in an mATX case, GPU
  length, radiator support and PSU headroom. Errors are red, warnings are amber, and neither
  blocks the download — they are advice, not a paywall.
- `art.js` draws every part as transparent SVG and composes the finished machine. Case size, GPU
  length and fan count, air vs liquid cooling, radiator size, RAM stick count and PSU wattage
  all change with the selection.
- **Download picture (PNG)** renders that drawing in the browser at 1120×1440 and saves it
  straight to Downloads. No server, no upload.
- Selections persist in `localStorage`. "Clear build" resets them.

On any build card, **Build this spec your way →** opens the builder preloaded with that build.

### Exporting the artwork as image files

```powershell
node tools/export-art.js
```

Writes to `Downloads/SolidRig Pictures/`:

| Folder | Contents |
| --- | --- |
| `parts/` | 41 transparent SVGs, plus 400×300 PNGs — one per part option |
| `rigs/` | the five builds assembled, SVG plus 1120×1440 PNG |
| `README.txt` | manifest of everything with part names |

The PNG pass uses Chrome or Edge headless, so the files match what the site draws. Re-run the
script after editing `parts.js` or `art.js`.

## How pricing works

Nothing is typed in as a price. Each build stores a **parts budget** (`partsUsd`) and a cost tier; the price is derived:

```
landed = (parts + freight) × (1 + duty)
cost   = landed + labour + consumables + packaging + (parts × warranty %)
price  = cost ÷ (1 − margin − fee)
```

So changing `ngnRate`, `marginPct` or a build's parts budget reprices the entire site — cards, calculator, quote summary and WhatsApp messages — with no other edits.

Current inputs are documented in `docs/pricing-worksheet.md`. The short version: ₦1,361.34/$, 15% duty allowance, 20% margin, 3% payment fees, 3% warranty reserve.

**The 15% duty figure is an allowance, not a customs assessment.** Confirm it with a clearing agent before treating these as final prices.

## How the quote flow works

There is no backend and no database. On submit, the site builds a formatted message and opens it in **WhatsApp** (or email) — the customer hits send, you reply.

That is intentional: it is how people actually buy in Nigeria, it needs no server, no hosting cost, and no data-protection obligations. A leads inbox with a real database would be a separate build.

## Deploy

Any static host works. The fastest:

1. Drag the `site` folder onto Netlify Drop. Live URL in about 20 seconds.
2. Point a domain at it (e.g. `solidrig.ng`).
3. Re-drag for each update, or connect a Git repo for automatic deploys.

Cloudflare Pages, GitHub Pages and Vercel all work the same way — publish directory is `site`.

## Honest notes on what is still placeholder

- **Two of five parts budgets are extrapolated.** $800 / $1,500 / $3,000 come from the price-sheet research. Solid Strike ($1,150) and Solid Titan ($4,350) were interpolated. Replace them with supplier quotes.
- **Duty + VAT (15%) is provisional.** See above.
- **The GPU tier list is marked "draft" on the site** — the only category with no saved research note behind it.
- **Lead time, warranty (24 months) and the 70/30 deposit are assumptions.** Change them in `config.js`.
- **Part prices in `parts.js` are placeholder street prices, not supplier quotes.** Swap them
  for real numbers and the builder's bill, Naira total and WhatsApp message all follow.
- **The rig drawing is an illustration, not a photo.** It is deliberately transparent and
  consistent; replace it with real bench photos when you have them.
- **No build photos, testimonials or social links yet.** Those need real content.

## Next steps that would move the needle

1. Set the WhatsApp number.
2. Get one real supplier quote and replace that build's `partsUsd`. The model corrects everything downstream.
3. Photograph three real builds — the hero currently uses a spec-ticket graphic.
4. Confirm the duty figure and correct `dutyPct`.
