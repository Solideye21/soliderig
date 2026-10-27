# Pricing model

Every price on the site is **calculated**, not typed in. The model lives in `site/assets/js/config.js` and is the same arithmetic as the open-book calculator on the page.

Source: the "PC Rig Price Sheet" research (24 October 2026), which sets the duty allowance, margin, fee and warranty reserve, and gives the per-tier allowances for freight, labour, consumables and packaging.

## The formula

```
landed parts = (parts + freight) × (1 + duty)
total cost   = landed parts + labour + consumables + packaging + (parts × warranty %)
list price   = total cost ÷ (1 − margin − payment fee)
```

## Current inputs

| Input | Value | Where it comes from |
| --- | ---: | --- |
| Exchange rate | ₦1,361.34 / $ | CBN reference, 23 Oct 2026 |
| Duty + VAT allowance | 15% of (parts + freight) | Provisional — confirm with a clearing agent |
| Target gross margin | 20% of list price | Business target |
| Payment fees | 3% of list price | Transfer / processor fees |
| Warranty reserve | 3% of parts | Set aside per build |
| Freight | $100 / $150 / $220 | Low / Mid / High |
| Labour | $50 / $70 / $100 | Low / Mid / High |
| Consumables | $15 / $20 / $30 | Low / Mid / High |
| Packaging | $20 / $25 / $40 | Low / Mid / High |

Change any of these in `config.js` → `ngnRate`, `pricing`, `tierAllowances`. Every build reprices on refresh — nothing else needs editing.

## What that produces

| Build | Cost tier | Parts | Total cost | List price (USD) | List price (NGN) |
| --- | --- | ---: | ---: | ---: | ---: |
| Solid One | Low | $800 | $1,144 | **$1,486** | ₦2,023,000 |
| Solid Strike | Mid | $1,150 | $1,645 | **$2,136** | ₦2,908,000 |
| Solid Core | Mid | $1,500 | $2,058 | **$2,672** | ₦3,638,000 |
| Solid Apex | High | $3,000 | $3,963 | **$5,147** | ₦7,007,000 |
| Solid Titan | High | $4,350 | $5,556 | **$7,216** | ₦9,823,000 |

Two of these parts budgets are researched ($800 / $1,500 / $3,000). Strike ($1,150) and Titan ($4,350) are interpolated and extrapolated — replace them with real quotes first.

## Sanity check: where the money goes on Solid Core

| Line | Amount | Share of price |
| --- | ---: | ---: |
| Parts | $1,500 | 56% |
| Freight | $150 | 6% |
| Duty + VAT | $248 | 9% |
| Labour, consumables, packaging | $115 | 4% |
| Warranty reserve | $45 | 2% |
| Payment fee | $80 | 3% |
| **Gross profit** | **$534** | **20%** |

That is the whole business case in one table. If a customer says "but it's $1,000 on Amazon", this is the answer — and it's on the website, so they can check it themselves.

## The one number that is not confirmed

**Duty + VAT of 15% is an allowance, not a customs assessment.** Real charges depend on tariff classification, customs valuation, applicable levies and shipping method. A clearing agent can tell you the true figure for a GPU versus a case versus a whole assembled PC. Until you have that, treat every price on the site as subject to revision — which the site says in the footer and the FAQ.

## Sourcing

Take the sourcing sheet (on the site under "Sourcing") to suppliers and ask for quotes against exact model numbers and declared values. Ask for both:

- **Option A** — all parts shipped separately
- **Option B** — complete assembled PC, with gross weight, carton dimensions, insurance and delivery

Quote both. The difference is usually the deciding factor.

## Cash flow rules

1. **70% deposit, 30% on delivery.** Non-negotiable above $800.
2. **Never order parts before the deposit clears.**
3. **Quote locks 7 days**, then reprice at the current rate.
4. **FX clause in writing:** *"Price valid 7 days. If the Naira-dollar rate moves more than 5%, the balance is recalculated at the rate on the day of order."*
5. **Separate accounts.** Parts money is not income.

## Next step

Replace the parts budgets with real supplier quotes for one build. The model does the rest — send me the quote and I will update `partsUsd` in `data.js` and every price, NGN conversion and margin line recalculates automatically.
