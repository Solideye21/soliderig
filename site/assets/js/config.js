/* ==========================================================================
   SolidRig — site configuration
   Edit this file to change contact details, pricing model, and business info.
   No build step: save the file, refresh the page.
   ========================================================================== */

window.SOLIDRIG = {
  brand: "SolidRig",
  tagline: "Custom PCs, built to spec.",

  /* --- Contact ---------------------------------------------------------
     phone: WhatsApp number in full international format, DIGITS ONLY.
            Nigeria example: 2348012345678  (no +, no spaces)
            Leave as "" to fall back to email for every call-to-action.
     email: where quote requests go if WhatsApp is not configured.
  ---------------------------------------------------------------------- */
  phone: "2349131744407",
  email: "hello@solidrig.ng",

  city: "Abuja, Nigeria",
  delivery: "Nationwide delivery across Nigeria",

  /* --- Pricing ---------------------------------------------------------
     Every price on the site is CALCULATED from the model below, not typed in.
     Change a number here and every build reprices.

     ngnRate: CBN reference rate used for conversion. Update when it moves.
     dutyPct: duty + VAT allowance on (parts + freight). Provisional — confirm
              with a customs broker before publishing final prices.
     marginPct: target gross margin, as a share of the list price.
     feePct: payment processing allowance, as a share of the list price.
     warrantyPct: warranty reserve, as a share of the parts subtotal.
  ---------------------------------------------------------------------- */
  ngnRate: 1361.34,
  rateUpdated: "23 October 2026 (CBN reference)",

  pricing: {
    dutyPct: 15,
    marginPct: 20,
    feePct: 3,
    warrantyPct: 3,
  },

  /* Per-tier allowances (USD). Low/High are the researched figures;
     mid sits between them by design. */
  tierAllowances: {
    low:  { freight: 100, labour: 50,  consumables: 15, packaging: 20 },
    mid:  { freight: 150, labour: 70,  consumables: 20, packaging: 25 },
    high: { freight: 220, labour: 100, consumables: 30, packaging: 40 },
  },

  /* --- Commercials -----------------------------------------------------
     Shown on the site. Keep these in sync with what you actually offer.
  ---------------------------------------------------------------------- */
  warrantyMonths: 24,
  leadTime: "5–10 working days",
  deposit: "70% deposit to order parts, balance on delivery",
  quoteValidityDays: 7,

  /* --- Socials (optional, leave "" to hide) ---------------------------- */
  socials: {
    instagram: "",
    x: "",
    tiktok: "",
    youtube: "",
  },
};
