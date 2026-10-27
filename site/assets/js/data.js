/* ==========================================================================
   SolidRig — build catalog + component tier reference
   This is the single source of truth for the site. Edit here, not in index.html.
   Prices are in USD. Naira prices are generated from config.ngnRate.
   ========================================================================== */

/* --- Tier ladder -------------------------------------------------------
   5 rungs. `featured` gets the highlight treatment on the site.
   Every part carries a `tier` so customers can see the reasoning behind it.
   ---------------------------------------------------------------------- */
window.SOLIDRIG_BUILDS = [
  {
    id: "solid-one",
    name: "Solid One",
    tier: "C",
    kicker: "Entry",
    target: "1080p · 100+ fps esports",
    summary:
      "The honest entry point. Plays Valorant, CS2, Fortnite and GTA on high settings without cutting corners on the parts that fail first.",
    partsUsd: 800,
    costTier: "low",
    parts: [
      { k: "CPU",       v: "AMD Ryzen 5 5600",                    tier: "C" },
      { k: "GPU",       v: "Radeon RX 6600 8GB",                  tier: "C" },
      { k: "Motherboard", v: "B550M (AM4, Gen 4)",                tier: "B" },
      { k: "Memory",    v: "16GB DDR4-3200 CL16 (2×8)",           tier: "A" },
      { k: "Storage",   v: "1TB NVMe SSD (Gen 3)",                tier: "C" },
      { k: "Cooler",    v: "120mm tower air",                     tier: "C" },
      { k: "Power",     v: "550W 80+ Bronze",                     tier: "B" },
      { k: "Case",      v: "Mesh mATX, 3 fans",                   tier: "B" },
    ],
  },
  {
    id: "solid-strike",
    name: "Solid Strike",
    tier: "B",
    kicker: "Esports",
    target: "1080p · 165–240 Hz",
    summary:
      "High refresh on a current platform. DDR5 and a Gen 4 drive mean it still feels fast three years from now, so upgrades stay cheap.",
    partsUsd: 1150,
    costTier: "mid",
    parts: [
      { k: "CPU",       v: "AMD Ryzen 5 7600",                    tier: "B" },
      { k: "GPU",       v: "GeForce RTX 5060 Ti 16GB",            tier: "B" },
      { k: "Motherboard", v: "B650M (AM5, Gen 4)",                tier: "B" },
      { k: "Memory",    v: "32GB DDR5-6000 CL30 (2×16)",          tier: "S" },
      { k: "Storage",   v: "1TB NVMe SSD (Gen 4)",                tier: "B" },
      { k: "Cooler",    v: "Dual-tower air (240W TDP)",           tier: "B" },
      { k: "Power",     v: "750W 80+ Gold",                       tier: "B" },
      { k: "Case",      v: "Mid tower, mesh front, 4 fans",       tier: "B" },
    ],
  },
  {
    id: "solid-core",
    name: "Solid Core",
    tier: "A",
    kicker: "Mainstream",
    target: "1440p · 144 Hz",
    summary:
      "The sweet spot, and the build most people should buy. 3D V-Cache gaming performance, 32GB of fast DDR5, and headroom for a GPU upgrade later.",
    partsUsd: 1500,
    costTier: "mid",
    featured: true,
    parts: [
      { k: "CPU",       v: "AMD Ryzen 7 7800X3D",                 tier: "A" },
      { k: "GPU",       v: "GeForce RTX 5070 12GB",               tier: "A" },
      { k: "Motherboard", v: "B650 (AM5, Gen 4)",                 tier: "B" },
      { k: "Memory",    v: "32GB DDR5-6000 CL30 (2×16)",          tier: "S" },
      { k: "Storage",   v: "2TB NVMe SSD (Gen 4, DRAM)",          tier: "A" },
      { k: "Cooler",    v: "240mm AIO liquid",                    tier: "B" },
      { k: "Power",     v: "850W 80+ Gold",                       tier: "B" },
      { k: "Case",      v: "Mid tower, airflow glass side",       tier: "A" },
    ],
  },
  {
    id: "solid-apex",
    name: "Solid Apex",
    tier: "S",
    kicker: "Enthusiast",
    target: "4K · 100+ fps / 1440p · 240 Hz",
    summary:
      "Flagship gaming silicon with the cooling and power delivery to actually hold its clocks. Built for 4K, ultrawide, and silent operation.",
    partsUsd: 3000,
    costTier: "high",
    parts: [
      { k: "CPU",       v: "AMD Ryzen 7 9800X3D",                 tier: "S" },
      { k: "GPU",       v: "GeForce RTX 5080 16GB",               tier: "S" },
      { k: "Motherboard", v: "X870E (AM5, Gen 5)",                tier: "A" },
      { k: "Memory",    v: "32GB DDR5-6000 CL30 (2×16, EXPO)",    tier: "S" },
      { k: "Storage",   v: "2TB NVMe SSD (Gen 5)",                tier: "S" },
      { k: "Cooler",    v: "360mm AIO liquid",                    tier: "A" },
      { k: "Power",     v: "1000W 80+ Gold, ATX 3.1",             tier: "A" },
      { k: "Case",      v: "Full mesh tower, 6 fans",             tier: "A" },
    ],
  },
  {
    id: "solid-titan",
    name: "Solid Titan",
    tier: "S+",
    kicker: "Flagship",
    target: "4K max settings · creation · local AI",
    summary:
      "No compromises. Maximum core count, maximum VRAM, maximum everything — with a display-cooler and the headroom for a second GPU-era of upgrades.",
    partsUsd: 4350,
    costTier: "high",
    parts: [
      { k: "CPU",       v: "AMD Ryzen 9 9950X3D",                 tier: "S" },
      { k: "GPU",       v: "GeForce RTX 5090 32GB",               tier: "S" },
      { k: "Motherboard", v: "X870E flagship (Gen 5, Wi-Fi 7)",   tier: "A" },
      { k: "Memory",    v: "64GB DDR5-6000 CL30 (2×32)",          tier: "S" },
      { k: "Storage",   v: "4TB NVMe SSD (Gen 5)",                tier: "S" },
      { k: "Cooler",    v: "360mm LCD AIO liquid",                tier: "S" },
      { k: "Power",     v: "1200W 80+ Platinum, ATX 3.1",         tier: "A" },
      { k: "Case",      v: "Flagship full tower, 7 fans",         tier: "S" },
    ],
  },
];

/* --- Included with every rig (same for all builds) --------------------- */
window.SOLIDRIG_INCLUDED = [
  {
    title: "Assembled, not shipped in a box",
    body: "Every part is mounted, cable-managed and photographed before it leaves the bench.",
  },
  {
    title: "24-hour burn-in",
    body: "CPU and GPU stressed, memory tested, thermals logged. If it fails here, it never reaches you.",
  },
  {
    title: "Windows 11 + drivers + BIOS",
    body: "Clean install, all drivers, XMP/EXPO enabled, fan curves tuned, updates applied.",
  },
  {
    title: "Warranty you can actually use",
    body: "24 months on the build and labour, plus full manufacturer warranty on every component.",
  },
  {
    title: "Upgrade path documented",
    body: "You get a parts sheet and a note on what to upgrade next — no planned obsolescence.",
  },
  {
    title: "Support after delivery",
    body: "Direct line to the person who built it. Remote diagnostics first, bench visit if needed.",
  },
];

/* --- Component tier reference -----------------------------------------
   Distilled from the research notes in this folder. Tiers run S (best)
   down to F (avoid). Each tier has an `examples` list and a `note`.
   ---------------------------------------------------------------------- */
window.SOLIDRIG_TIERS = [
  {
    id: "cpu",
    label: "CPU",
    intro:
      "The processor sets the ceiling on everything else. Match the tier to the resolution you actually play at — 1080p leans on CPU, 4K leans on GPU.",
    tiers: [
      { tier: "S", name: "Extreme / enthusiast", note: "Hardcore 4K high-refresh gaming, rendering, heavy multithreaded work.", examples: ["Ryzen 9 9950X3D", "Ryzen 9 9950X", "Ryzen 7 9800X3D", "Core i9-14900K", "Core Ultra 9 285K"] },
      { tier: "A", name: "High-end", note: "High-FPS gaming, content creation, video editing, heavy multitasking.", examples: ["Ryzen 9 9900X", "Ryzen 7 9700X", "Ryzen 7 7800X3D", "Ryzen 7 7700X", "Core Ultra 7 265K", "Core i7-14700K"] },
      { tier: "B", name: "Mid-range", note: "Solid 1080p/1440p gaming, everyday productivity, mainstream creation.", examples: ["Ryzen 5 9600X", "Ryzen 5 7600X", "Core Ultra 5 245K", "Core i5-14600K", "Core i5-13600K"] },
      { tier: "C", name: "Budget / entry-mid", note: "Affordable 1080p gaming and general multitasking without overspending.", examples: ["Ryzen 5 7600", "Ryzen 5 8600G", "Core Ultra 5 225", "Core i5-14400", "Core i5-13400F"] },
      { tier: "D", name: "Entry-level / office", note: "Light office work, browsing, streaming, older and indie games.", examples: ["Ryzen 5 5600", "Ryzen 3 series", "Core i3-12100F"] },
    ],
  },
  {
    id: "gpu",
    label: "GPU",
    intro:
      "Draft working list — the only category without a saved research note yet. Verify against current local stock and pricing before quoting.",
    draft: true,
    tiers: [
      { tier: "S", name: "4K flagship", note: "Max settings at 4K, heavy ray tracing, local AI workloads.", examples: ["GeForce RTX 5090 32GB", "RTX 5080 16GB"] },
      { tier: "A", name: "1440p high refresh", note: "Comfortable 1440p at 144 Hz+, strong ray tracing.", examples: ["RTX 5070 Ti 16GB", "RTX 5070 12GB", "Radeon RX 9070 XT"] },
      { tier: "B", name: "1080p high refresh", note: "165–240 Hz at 1080p, entry 1440p with settings tuned.", examples: ["RTX 5060 Ti 16GB", "RTX 5060 8GB", "Radeon RX 9060 XT"] },
      { tier: "C", name: "Budget 1080p", note: "100+ fps esports titles, AAA at medium.", examples: ["Radeon RX 6600", "RTX 3050 8GB"] },
    ],
  },
  {
    id: "motherboard",
    label: "Motherboard",
    intro:
      "The chipset decides what you can upgrade later. Spending on a better board is usually cheaper than replacing one.",
    tiers: [
      { tier: "S", name: "Workstation / HEDT", note: "Xeon and Threadripper platforms. ECC memory, enormous PCIe lane counts.", examples: ["W890 / W790", "WRX90 / sTR5"] },
      { tier: "A", name: "Enthusiast", note: "Full CPU and memory overclocking, maximum PCIe lanes, USB4/Thunderbolt, Wi-Fi 7.", examples: ["Z890 / Z790", "X870E / X870 / X670E"] },
      { tier: "B", name: "Mainstream — best value", note: "Memory overclocking and modern PCIe without the flagship tax. The right pick for most gamers.", examples: ["B860 / B760", "B850 / B650 / B550"] },
      { tier: "C", name: "Entry / budget", note: "Locked overclocking, fewer M.2 and SATA ports, minimal VRMs.", examples: ["H810 / H610", "A620 / A520"] },
    ],
  },
  {
    id: "memory",
    label: "RAM",
    intro:
      "Speed matters less than running dual-channel with XMP/EXPO actually enabled — which is where most prebuilts quietly fail you.",
    tiers: [
      { tier: "S", name: "Elite", note: "DDR5 6000–7000 CL30, dual-channel, XMP/EXPO on.", examples: ["2×16GB DDR5-6000 CL30", "2×32GB DDR5-6000 CL30"] },
      { tier: "A", name: "High performance", note: "DDR4 3200–3600 CL16–18, dual-channel, XMP on.", examples: ["2×8GB DDR4-3200 CL16", "2×16GB DDR4-3600 CL18"] },
      { tier: "B", name: "Mid-high", note: "DDR5 5200–5600, dual-channel. Fine, just leaves frame rate on the table.", examples: ["2×16GB DDR5-5200"] },
      { tier: "C", name: "Mainstream / budget", note: "DDR4 3000–3200.", examples: ["2×8GB DDR4-3000"] },
      { tier: "D", name: "Slow", note: "DDR4 under 3000 MHz, or a single stick.", examples: ["1×16GB DDR4-2666"] },
      { tier: "E", name: "Legacy", note: "DDR3, mixed sticks, or no XMP profile configured.", examples: ["2×8GB DDR3-1600"] },
      { tier: "F", name: "Avoid", note: "Mismatched pairs and DDR3 without a profile. Instability waiting to happen.", examples: ["Mixed 8GB + 4GB sticks"] },
    ],
  },
  {
    id: "storage",
    label: "Storage",
    intro:
      "Capacity by use case. A DRAM cache matters more than the headline sequential number for real-world load times.",
    tiers: [
      { tier: "C", name: "Entry — 512GB–1TB", note: "Gen 3 or basic Gen 4. OS, core apps, a small library of lighter titles.", examples: ["1TB NVMe Gen 3"] },
      { tier: "B", name: "Mid-range — 1–2TB", note: "Fast Gen 4. 5–7 second boots, comfortable AAA library.", examples: ["2TB NVMe Gen 4 (DRAM)"] },
      { tier: "A", name: "High-end — 2–4TB+", note: "Gen 5, or split OS drive plus a large game/scratch drive.", examples: ["2TB Gen 5 + 4TB SATA SSD"] },
      { tier: "S", name: "Enthusiast / workstation", note: "4TB+ Gen 5 plus bulk HDD. 4K timelines, render caches, simultaneous recording.", examples: ["4TB Gen 5 + 8TB HDD"] },
    ],
  },
  {
    id: "psu",
    label: "Power supply",
    intro:
      "The one part that can destroy every other part. There is no build on this site with a Tier C or lower unit in it.",
    tiers: [
      { tier: "A", name: "Class-leading", note: "Full-bridge LLC, under 3% regulation, under 50 mV ripple, high-temp protections.", examples: ["Corsair RM1000x", "Seasonic Prime TX", "ASUS ROG Thor"] },
      { tier: "B", name: "Mid-range — best value", note: "Modern DC-DC secondary, ZVS/ACRF primary. The right call for standard builds.", examples: ["Seasonic Focus GX", "Corsair RM750x", "MSI MPG A750GF"] },
      { tier: "C", name: "Budget", note: "Relaxed tolerances. Light duty only — never with a high-draw GPU.", examples: ["Entry 80+ Bronze units"] },
      { tier: "D", name: "Office / iGPU only", note: "No dedicated graphics card. Not suitable for gaming builds.", examples: ["Bundled OEM units"] },
      { tier: "E", name: "Avoid", note: "Design flaws, missing protections, high failure rates.", examples: ["—"] },
      { tier: "F", name: "Unsafe", note: "Defective units. Replace immediately.", examples: ["Gigabyte P-GM (early revisions)"] },
    ],
  },
  {
    id: "cooling",
    label: "CPU cooling",
    intro:
      "Air is enough up to the mid range. Above that, radiator size and pump quality decide whether you keep your boost clocks.",
    tiers: [
      { tier: "S", name: "Flagship", note: "Thick radiators, high static pressure, LCD or VRM fans. No meaningful weakness.", examples: ["Arctic Liquid Freezer III Pro", "NZXT Kraken Elite V2 360", "Tryx Panorama 360", "Lian Li Galahad II Trinity Performance", "Noctua NL-LC1"] },
      { tier: "A", name: "High-end all-rounder", note: "Strong thermals, quieter than budget units, refined hardware.", examples: ["Corsair iCUE LINK TITAN RX", "Thermalright Grand Vision 360", "Lian Li HydroShift 2 LCD", "be quiet! Silent Loop 3"] },
      { tier: "B", name: "Smart value", note: "Great price-to-performance for enthusiast gaming CPUs.", examples: ["ID-Cooling FX360 INF", "Thermalright Aqua Elite V6", "Cooler Master ML240 Atmos"] },
      { tier: "C", name: "Entry / compact", note: "120mm or basic 240mm. Lower-TDP chips, or aesthetics over a dual-tower air cooler.", examples: ["Enermax LiqMaxFlo SR 120", "MSI MAG CoreLiquid A13"] },
    ],
  },
];
