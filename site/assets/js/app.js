/* ==========================================================================
   SolidRig — app.js
   Renders the build catalog, the pricing calculator, component tiers and the
   quote flow. No dependencies, no build step. Works from file:// too.
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.SOLIDRIG || {};
  var BUILDS = window.SOLIDRIG_BUILDS || [];
  var INCLUDED = window.SOLIDRIG_INCLUDED || [];
  var TIERS = window.SOLIDRIG_TIERS || [];

  var PRICING = CFG.pricing || { dutyPct: 15, marginPct: 20, feePct: 3, warrantyPct: 3 };
  var ALLOW = CFG.tierAllowances || {};
  var DEFAULT_ALLOW = { freight: 150, labour: 70, consumables: 20, packaging: 25 };

  var state = {
    currency: "USD",
    tierTab: TIERS.length ? TIERS[0].id : null,
  };

  /* ---------------------------------------------------------------- utils */
  var TIER_COLORS = {
    "S+": "#f5b642",
    S: "#f5b642",
    A: "#3ddc97",
    B: "#4cb8f5",
    C: "#8b93a1",
    D: "#6b7280",
    E: "#f97362",
    F: "#ef4444",
  };

  function tierColor(t) {
    return TIER_COLORS[t] || "#8b93a1";
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function findBy(data, key, value) {
    for (var i = 0; i < data.length; i++) if (data[i][key] === value) return data[i];
    return null;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function usd(n) {
    return "$" + Math.round(n).toLocaleString("en-US");
  }

  function ngn(n) {
    var v = Math.round(n / 1000) * 1000;
    return "₦" + v.toLocaleString("en-NG");
  }

  function rate() {
    return Number(CFG.ngnRate) || 1;
  }

  /* ---------------------------------------------------------- price model */
  var DEFAULTS = {
    dutyPct: 15,
    marginPct: 20,
    feePct: 3,
    warrantyPct: 3,
  };

  function allowanceFor(tier) {
    return ALLOW[tier] || ALLOW.mid || DEFAULT_ALLOW;
  }

  /**
   * The whole business model in one function.
   * landed = (parts + freight) + duty on that
   * cost   = landed + labour + consumables + packaging + warranty reserve
   * price  = cost / (1 - margin - payment fee)
   */
  function computeCost(i) {
    var parts = Number(i.parts) || 0;
    var freight = Number(i.freight) || 0;
    var dutyPct = Number(i.dutyPct) || 0;
    var marginPct = Number(i.marginPct) || 0;
    var feePct = Number(i.feePct) || 0;
    var warrantyPct = Number(i.warrantyPct) || 0;

    var base = parts + freight;
    var duty = base * dutyPct / 100;
    var landed = base + duty;
    var addons = (Number(i.labour) || 0) + (Number(i.consumables) || 0) + (Number(i.packaging) || 0);
    var warranty = parts * warrantyPct / 100;
    var cost = landed + addons + warranty;
    var denom = 1 - marginPct / 100 - feePct / 100;
    var price = denom > 0 ? cost / denom : null;

    return {
      parts: parts,
      freight: freight,
      duty: duty,
      landed: landed,
      addons: addons,
      warranty: warranty,
      cost: cost,
      price: price,
      fee: price ? (price * feePct) / 100 : 0,
      profit: price ? price - cost - (price * feePct) / 100 : 0,
      denom: denom,
    };
  }

  function modelFor(build) {
    var a = allowanceFor(build.costTier);
    return {
      parts: build.partsUsd,
      freight: a.freight,
      labour: a.labour,
      consumables: a.consumables,
      packaging: a.packaging,
      dutyPct: PRICING.dutyPct,
      marginPct: PRICING.marginPct,
      feePct: PRICING.feePct,
      warrantyPct: PRICING.warrantyPct,
    };
  }

  function priceOf(build) {
    var out = computeCost(modelFor(build));
    return out.price || 0;
  }

  /* Exposed so the build-your-own section prices with the exact same model. */
  window.SOLIDRIG_PRICING = {
    computeCost: computeCost,
    allowanceFor: allowanceFor,
    priceOf: priceOf,
    tierColor: tierColor,
  };

  /* ------------------------------------------------------------- contact */
  function waNumber() {
    return String(CFG.phone || "").replace(/\D/g, "");
  }

  function contactLink(message) {
    var digits = waNumber();
    if (digits) {
      return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message);
    }
    if (CFG.email) {
      return (
        "mailto:" +
        CFG.email +
        "?subject=" +
        encodeURIComponent("Quote request — SolidRig") +
        "&body=" +
        encodeURIComponent(message)
      );
    }
    return null;
  }

  function ctaLabel() {
    return waNumber() ? "Send on WhatsApp" : "Send by email";
  }

  /* --------------------------------------------------------- static text */
  function applyConfig() {
    document.querySelectorAll('[data-config="leadTime"]').forEach(function (n) {
      if (CFG.leadTime) n.textContent = CFG.leadTime.replace("working days", "").trim() + " days";
    });
    document.querySelectorAll('[data-config="warranty"]').forEach(function (n) {
      if (CFG.warrantyMonths) n.textContent = CFG.warrantyMonths + " months";
    });
    document.querySelectorAll('[data-config="rate"]').forEach(function (n) {
      n.textContent = "₦" + rate().toLocaleString("en-NG", { minimumFractionDigits: 2 }) + "/$";
    });
    document.querySelectorAll('[data-config="rateShort"]').forEach(function (n) {
      n.textContent = "₦" + Math.round(rate()).toLocaleString("en-NG");
    });

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    var meta = document.getElementById("footer-meta");
    if (meta) {
      meta.textContent =
        "Prices calculated, not guessed · ₦" +
        rate().toLocaleString("en-NG", { minimumFractionDigits: 2 }) +
        "/$ · " +
        (CFG.rateUpdated || "");
    }
  }

  function rateNoteText() {
    return (
      "₦" + rate().toLocaleString("en-NG", { minimumFractionDigits: 2 }) +
      "/$ · " + (CFG.rateUpdated || "")
    );
  }

  function shortRate() {
    return "₦" + rate().toLocaleString("en-NG", { minimumFractionDigits: 2 }) + "/$";
  }

  /* -------------------------------------------------------------- builds */
  function renderBuilds() {
    var grid = document.getElementById("builds-grid");
    if (!grid) return;
    grid.innerHTML = "";

    BUILDS.forEach(function (b) {
      var card = el("article", "build reveal" + (b.featured ? " build--featured" : ""));
      var price = priceOf(b);

      var top = el("div", "build__top");
      top.appendChild(
        el(
          "div",
          null,
          '<div class="build__kicker">' +
            escapeHtml(b.kicker) +
            " · Tier " +
            escapeHtml(b.tier) +
            "</div>" +
            '<h3 class="build__name">' +
            escapeHtml(b.name) +
            "</h3>"
        )
      );
      var chip = el("div", "tier-chip", escapeHtml(b.tier));
      chip.style.color = tierColor(b.tier);
      top.appendChild(chip);
      card.appendChild(top);

      card.appendChild(
        el(
          "div",
          "build__price",
          "<b>" + (state.currency === "NGN" ? ngn(price * rate()) : usd(price)) + "</b><em>" +
            (state.currency === "NGN" ? "NGN" : "USD") + "</em>"
        )
      );
      card.appendChild(
        el(
          "div",
          "build__alt",
          state.currency === "NGN"
            ? usd(price) + " at " + shortRate()
            : "≈ " + ngn(price * rate()) + " at " + shortRate()
        )
      );
      card.appendChild(
        el(
          "div",
          "build__budget",
          "Parts budget " + usd(b.partsUsd) + " · freight, duty &amp; assembly included"
        )
      );

      card.appendChild(el("span", "build__target", escapeHtml(b.target)));
      card.appendChild(el("p", "build__summary", escapeHtml(b.summary)));

      var spec = el("div", "spec");
      b.parts.forEach(function (p) {
        var row = el("div", "spec__row");
        row.appendChild(el("span", "spec__k", escapeHtml(p.k)));
        row.appendChild(el("span", "spec__v", escapeHtml(p.v)));
        var tag = el("span", "spec__t", escapeHtml(p.tier));
        tag.style.color = tierColor(p.tier);
        tag.style.background = tierColor(p.tier) + "1f";
        row.appendChild(tag);
        spec.appendChild(row);
      });
      card.appendChild(spec);

      var actions = el("div", "build__actions");
      var quoteBtn = el("button", "btn btn--primary btn--sm", "Quote this build");
      quoteBtn.type = "button";
      quoteBtn.setAttribute("data-quote-build", b.id);
      actions.appendChild(quoteBtn);
      var msg =
        "Hi " +
        (CFG.brand || "SolidRig") +
        " — I'm interested in the " +
        b.name +
        " (" +
        b.target +
        "), listed at " +
        usd(price) +
        " / " +
        ngn(price * rate()) +
        ". Can we talk?";
      var link = contactLink(msg);
      if (link) {
        var wa = el(
          "a",
          "btn btn--ghost btn--sm",
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.94.56 3.74 1.52 5.26L2 22l5.04-1.68a9.8 9.8 0 0 0 5 1.36c5.44 0 9.84-4.4 9.84-9.84C21.88 6.4 17.48 2 12.04 2Zm5.7 13.9c-.24.68-1.4 1.3-1.94 1.36-.54.06-1.1.1-1.86-.16-.76-.26-2.5-.98-4.22-2.68-1.72-1.7-2.44-3.42-2.7-4.18-.26-.76-.22-1.32-.16-1.86.06-.54.68-1.7 1.36-1.94.34-.12.7-.06.94.02.24.08.36.14.52.5.16.36.62 1.5.68 1.62.06.12.1.26.02.42-.08.16-.14.26-.28.42-.14.16-.3.36-.42.5-.12.14-.26.28-.12.56.14.28.62 1.02 1.32 1.66.9.8 1.66 1.06 1.94 1.18.28.12.44.1.6-.06.16-.16.7-.82.88-1.1.18-.28.36-.22.6-.14.24.08 1.52.72 1.78.85.26.13.44.2.5.32.06.12.06.7-.18 1.38Z"/></svg>',
          ""
        );
        wa.href = link;
        wa.target = "_blank";
        wa.rel = "noopener";
        wa.setAttribute("aria-label", "Message us about the " + b.name);
        actions.appendChild(wa);
      }
      card.appendChild(actions);

      var customise = el("button", "build__customise", "Build this spec your way \u2192");
      customise.type = "button";
      customise.setAttribute("data-customise-build", b.id);
      card.appendChild(customise);

      grid.appendChild(card);
    });

    observeReveals();
  }

  function renderIncluded() {
    var grid = document.getElementById("included-grid");
    if (!grid) return;
    grid.innerHTML = "";
    INCLUDED.forEach(function (item) {
      var box = el("div", "inc reveal");
      box.appendChild(
        el(
          "div",
          "inc__mark",
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>'
        )
      );
      box.appendChild(el("h3", null, escapeHtml(item.title)));
      box.appendChild(el("p", null, escapeHtml(item.body)));
      grid.appendChild(box);
    });
    observeReveals();
  }

  /* --------------------------------------------------------------- calc */
  var CALC_FIELDS = [
    ["c-parts", "parts"],
    ["c-freight", "freight"],
    ["c-duty", "dutyPct"],
    ["c-labour", "labour"],
    ["c-consum", "consumables"],
    ["c-pack", "packaging"],
    ["c-warranty", "warrantyPct"],
    ["c-fee", "feePct"],
    ["c-margin", "marginPct"],
    ["c-rate", "rate"],
  ];

  function readCalc() {
    var out = {};
    CALC_FIELDS.forEach(function (pair) {
      var node = document.getElementById(pair[0]);
      out[pair[1]] = node ? node.value : 0;
    });
    return out;
  }

  function setCalc(values) {
    CALC_FIELDS.forEach(function (pair) {
      var node = document.getElementById(pair[0]);
      if (node && values[pair[1]] !== undefined) node.value = values[pair[1]];
    });
  }

  function renderCalc() {
    var outBox = document.getElementById("calc-out");
    if (!outBox) return;

    var v = readCalc();
    var r = computeCost(v);
    var fx = Number(v.rate) || 0;

    var rows = [
      ["Parts subtotal", usd(r.parts)],
      ["Freight", usd(r.freight)],
      ["Duty + VAT allowance", usd(r.duty)],
      ["Landed parts", usd(r.landed), true],
      ["Labour + consumables + packaging", usd(r.addons)],
      ["Warranty reserve", usd(r.warranty)],
      ["Total cost before payment fees", usd(r.cost), true],
    ];

    var html = rows
      .map(function (row) {
        return (
          '<div class="calc__row' +
          (row[2] ? " calc__row--strong" : "") +
          '"><span>' +
          row[0] +
          "</span><b>" +
          row[1] +
          "</b></div>"
        );
      })
      .join("");

    if (r.price) {
      html +=
        '<div class="calc__result">' +
        '<div class="calc__result-label">Recommended list price</div>' +
        '<div class="calc__result-price">' + usd(r.price) + "</div>" +
        '<div class="calc__result-ngn">' + ngn(r.price * fx) + "</div>" +
        '<div class="calc__result-meta">Payment fee ' + usd(r.fee) + " · gross profit " + usd(r.profit) + "</div>" +
        "</div>";
    } else {
      html +=
        '<div class="calc__error">Margin plus payment fee must be below 100%.</div>';
    }

    outBox.innerHTML = html;
  }

  function applyPreset(id) {
    var b = findBy(BUILDS, "id", id);
    if (!b) return;
    var a = allowanceFor(b.costTier);
    setCalc({
      parts: b.partsUsd,
      freight: a.freight,
      labour: a.labour,
      consumables: a.consumables,
      packaging: a.packaging,
      dutyPct: PRICING.dutyPct,
      marginPct: PRICING.marginPct,
      feePct: PRICING.feePct,
      warrantyPct: PRICING.warrantyPct,
      rate: CFG.ngnRate,
    });
    renderCalc();
  }

  function costSheetText() {
    var v = readCalc();
    var r = computeCost(v);
    var fx = Number(v.rate) || 0;
    var sel = document.getElementById("c-build");
    var b = sel ? findBy(BUILDS, "id", sel.value) : null;
    var lines = [
      "PC Rig Cost Sheet — " + (b ? b.name : "Custom") + " (" + (CFG.brand || "SolidRig") + ")",
      "Date: " + new Date().toISOString().slice(0, 10),
      "",
      "Parts subtotal: " + usd(r.parts),
      "Freight: " + usd(r.freight),
      "Duty + VAT allowance (" + v.dutyPct + "%): " + usd(r.duty),
      "Landed parts: " + usd(r.landed),
      "Labour + consumables + packaging: " + usd(r.addons),
      "Warranty reserve (" + v.warrantyPct + "%): " + usd(r.warranty),
      "Total cost before payment fees: " + usd(r.cost),
      "",
      "Payment fees: " + v.feePct + "%",
      "Target gross margin: " + v.marginPct + "%",
      "List price (USD): " + (r.price ? usd(r.price) : "—"),
      "Exchange rate: ₦" + fx.toFixed(2) + "/$",
      "List price (NGN): " + (r.price ? ngn(r.price * fx) : "—"),
    ];
    return lines.join("\n");
  }

  function copyText(text, statusEl) {
    function done(ok) {
      if (!statusEl) return;
      statusEl.textContent = ok ? "Cost sheet copied." : "Copy failed — select the numbers manually.";
      statusEl.style.color = ok ? "var(--ok)" : "#f97362";
      setTimeout(function () {
        statusEl.textContent = "";
      }, 4000);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      return;
    }
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      done(ok);
    } catch (e) {
      done(false);
    }
  }

  /* ---------------------------------------------------------- tier lists */
  function renderTabs() {
    var wrap = document.getElementById("tier-tabs");
    if (!wrap) return;
    wrap.innerHTML = "";
    TIERS.forEach(function (t) {
      var btn = el("button", "tab", escapeHtml(t.label));
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("data-tier-tab", t.id);
      btn.setAttribute("aria-selected", String(t.id === state.tierTab));
      btn.addEventListener("click", function () {
        state.tierTab = t.id;
        wrap.querySelectorAll(".tab").forEach(function (b) {
          b.setAttribute("aria-selected", String(b.getAttribute("data-tier-tab") === t.id));
        });
        renderTierPanel();
      });
      wrap.appendChild(btn);
    });
  }

  function renderTierPanel() {
    var panel = document.getElementById("tier-panel");
    if (!panel) return;
    var data = findBy(TIERS, "id", state.tierTab);
    if (!data) return;

    var html = "";
    if (data.draft) {
      html += '<span class="draft-flag">Draft · verify before quoting</span>';
    }
    html += '<p class="tier-panel__intro">' + escapeHtml(data.intro) + "</p>" + '<div class="tier-rows">';

    data.tiers.forEach(function (row) {
      html +=
        '<div class="tier-row">' +
        '<div class="tier-badge" style="color:' +
        tierColor(row.tier) +
        '">' +
        escapeHtml(row.tier) +
        "</div>" +
        "<div><h4>" +
        escapeHtml(row.name) +
        '</h4><p class="note">' +
        escapeHtml(row.note) +
        "</p></div>" +
        '<div class="chips">' +
        row.examples
          .map(function (x) {
            return '<span class="chip">' + escapeHtml(x) + "</span>";
          })
          .join("") +
        "</div>" +
        "</div>";
    });

    html += "</div>";
    panel.innerHTML = html;
  }

  /* -------------------------------------------------------------- quote */
  function renderBuildOptions() {
    var sel = document.getElementById("q-build");
    if (!sel) return;
    sel.innerHTML =
      '<option value="advise">Help me choose</option>' +
      BUILDS.map(function (b) {
        return '<option value="' + b.id + '">' + escapeHtml(b.name + " — " + b.target) + "</option>";
      }).join("") +
      '<option value="custom">Custom spec</option>';
    sel.value = "solid-core";
  }

  function renderSummary() {
    var list = document.getElementById("summary-list");
    var total = document.getElementById("summary-total");
    var note = document.getElementById("summary-note");
    var alt = document.getElementById("summary-alt");
    if (!list || !total) return;

    var buildSel = document.getElementById("q-build");
    var useSel = document.getElementById("q-use");
    var budgetSel = document.getElementById("q-budget");
    if (!buildSel) return;

    var build = findBy(BUILDS, "id", buildSel.value);
    var rows = [];

    rows.push(["Build", build ? build.name : buildSel.value === "custom" ? "Custom spec" : "Advised on call"]);
    if (build) rows.push(["Target", build.target]);
    rows.push(["Use", useSel ? useSel.value : "—"]);
    rows.push(["Budget", budgetSel ? budgetSel.value : "—"]);

    list.innerHTML = rows
      .map(function (r) {
        return (
          '<div class="summary__item"><span>' +
          escapeHtml(r[0]) +
          "</span><span>" +
          escapeHtml(r[1]) +
          "</span></div>"
        );
      })
      .join("");

    if (build) {
      var price = priceOf(build);
      total.textContent = state.currency === "NGN" ? ngn(price * rate()) : usd(price);
      if (note) {
        note.textContent =
          "Includes parts, freight, duty, assembly, Windows 11 and burn-in testing. Final price confirmed in writing at the rate on the day of order.";
      }
    } else {
      total.textContent = "On request";
      if (note) note.textContent = "We'll come back with two or three options at different price points.";
    }

    if (alt) {
      alt.innerHTML = waNumber()
        ? 'Prefer to talk? <a href="' + contactLink("Hi " + (CFG.brand || "") + " — I'd like to ask about a custom build.") + '" target="_blank" rel="noopener">Message us directly</a>'
        : "Or email us at <a href='mailto:" + (CFG.email || "") + "'>" + (CFG.email || "") + "</a>";
    }
  }

  function collectForm() {
    return {
      name: (document.getElementById("q-name") || {}).value || "",
      phone: (document.getElementById("q-phone") || {}).value || "",
      city: (document.getElementById("q-city") || {}).value || "",
      build: (document.getElementById("q-build") || {}).value || "",
      use: (document.getElementById("q-use") || {}).value || "",
      budget: (document.getElementById("q-budget") || {}).value || "",
      notes: (document.getElementById("q-notes") || {}).value || "",
    };
  }

  function buildMessage(d) {
    var build = findBy(BUILDS, "id", d.build);
    var lines = [
      "New quote request — " + (CFG.brand || "SolidRig"),
      "",
      "Name: " + (d.name || "—"),
      "WhatsApp: " + (d.phone || "—"),
      "City: " + (d.city || "—"),
      "Build: " + (build ? build.name + " (" + usd(priceOf(build)) + " / " + ngn(priceOf(build) * rate()) + ")" : d.build === "custom" ? "Custom spec" : "Help me choose"),
      "Main use: " + (d.use || "—"),
      "Budget: " + (d.budget || "—"),
    ];
    if (d.notes.trim()) {
      lines.push("", "Notes: " + d.notes.trim());
    }
    return lines.join("\n");
  }

  function handleSubmit(e) {
    e.preventDefault();

    var d = collectForm();
    var nameField = document.getElementById("q-name");
    var phoneField = document.getElementById("q-phone");
    var hint = document.getElementById("form-hint");
    var ok = true;

    [nameField, phoneField].forEach(function (field) {
      if (!field) return;
      var empty = !field.value.trim();
      field.setAttribute("aria-invalid", String(empty));
      field.style.borderColor = empty ? "#ef4444" : "";
      if (empty && ok) {
        field.focus();
        ok = false;
      }
    });

    if (!ok) {
      if (hint) {
        hint.textContent = "Please add your name and a WhatsApp number so we can reply.";
        hint.style.color = "#f97362";
      }
      return;
    }

    var link = contactLink(buildMessage(d));
    if (!link) {
      if (hint) {
        hint.textContent = "No contact channel is configured yet — set config.phone or config.email.";
        hint.style.color = "#f97362";
      }
      return;
    }

    if (hint) {
      hint.textContent = waNumber()
        ? "Opening WhatsApp — hit send and we'll take it from there."
        : "Opening your email app — hit send and we'll reply within a day.";
      hint.style.color = "var(--ok)";
    }

    window.open(link, "_blank", "noopener");
  }

  /* ------------------------------------------------------------ currency */
  function renderCurrencyUI() {
    document.querySelectorAll("[data-currency]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-currency") === state.currency));
    });

    var note = document.getElementById("rate-note");
    if (note) note.textContent = rateNoteText();
  }

  function setCurrency(code) {
    if (code === state.currency) return;
    state.currency = code;
    renderCurrencyUI();
    renderBuilds();
    renderSummary();
  }

  /* ------------------------------------------------------------- reveals */
  var revealObserver = null;

  function observeReveals() {
    var nodes = document.querySelectorAll(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("in"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
    }
    nodes.forEach(function (n) { revealObserver.observe(n); });
  }

  /* ---------------------------------------------------------------- init */
  var started = false;

  function init() {
    if (started) return;
    started = true;
    applyConfig();
    renderCurrencyUI();
    renderBuilds();
    renderIncluded();
    renderTabs();
    renderTierPanel();
    renderBuildOptions();
    renderSummary();

    /* currency toggle */
    document.querySelectorAll("[data-currency]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setCurrency(btn.getAttribute("data-currency"));
      });
    });

    /* calculator */
    var calcBuild = document.getElementById("c-build");
    if (calcBuild) {
      calcBuild.innerHTML = BUILDS.map(function (b) {
        return '<option value="' + b.id + '">' + escapeHtml(b.name + " — " + usd(b.partsUsd) + " of parts") + "</option>";
      }).join("");
      calcBuild.value = "solid-core";
      calcBuild.addEventListener("change", function () {
        applyPreset(calcBuild.value);
      });
    }

    CALC_FIELDS.forEach(function (pair) {
      var node = document.getElementById(pair[0]);
      if (node) node.addEventListener("input", renderCalc);
    });
    applyPreset(calcBuild ? calcBuild.value : "solid-core");

    var copyBtn = document.getElementById("calc-copy");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        copyText(costSheetText(), document.getElementById("calc-status"));
      });
    }

    /* per-build quote buttons */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-quote-build]");
      if (!btn) return;
      var sel = document.getElementById("q-build");
      if (sel) sel.value = btn.getAttribute("data-quote-build");
      renderSummary();
      var target = document.getElementById("quote");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      var name = document.getElementById("q-name");
      if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, 600);
    });

    /* live summary */
    ["q-build", "q-use", "q-budget"].forEach(function (id) {
      var node = document.getElementById(id);
      if (node) node.addEventListener("change", renderSummary);
    });

    /* form */
    var form = document.getElementById("quote-form");
    if (form) form.addEventListener("submit", handleSubmit);

    var submitBtn = document.getElementById("submit-btn");
    if (submitBtn) submitBtn.textContent = ctaLabel();

    var hint = document.getElementById("form-hint");
    if (hint && !waNumber()) {
      hint.textContent = CFG.email
        ? "We reply by email, usually within one working day."
        : "Contact details are not configured yet.";
    }

    /* nav */
    var toggle = document.getElementById("nav-toggle");
    var links = document.getElementById("nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          links.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    observeReveals();

    if (!waNumber()) {
      console.info(
        "[SolidRig] No WhatsApp number set. Edit site/assets/js/config.js → phone (digits only, e.g. 2348012345678) to enable WhatsApp CTAs."
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
