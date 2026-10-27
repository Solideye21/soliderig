/* ==========================================================================
   SolidRig — build-your-own section
   Pick a part by clicking its picture. The panel on the right keeps a running
   bill, flags incompatible pairs, and draws the finished machine as you go.
   Prices run through the same cost model as the rest of the site (config.js).
   ========================================================================== */
(function () {
  "use strict";

  var CFG = window.SOLIDRIG || {};
  var CATALOG = window.SOLIDRIG_PARTS || { categories: [], presets: [] };
  var ART = window.SOLIDRIG_ART;
  var PRICING = window.SOLIDRIG_PRICING;
  if (!ART || !CATALOG.categories.length) return;

  var TIERS = window.SOLIDRIG_TIERS || [];
  var CATS = CATALOG.categories;
  var PRESETS = CATALOG.presets || [];
  var STORE_KEY = "solidrig.builder.v1";

  var state = {
    active: CATS[0].id,
    sel: {},
    preset: null,
  };

  /* --------------------------------------------------------------- utils */
  function $(id) {
    return document.getElementById(id);
  }

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html !== undefined) node.innerHTML = html;
    return node;
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

  function tierColor(t) {
    var map = { "S+": "#f5b642", S: "#f5b642", A: "#3ddc97", B: "#4cb8f5", C: "#8b93a1", D: "#6b7280" };
    return map[t] || "#8b93a1";
  }

  function optionById(catId, optId) {
    var cat = find(CATS, catId);
    if (!cat) return null;
    return find(cat.options, optId);
  }

  function find(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function selected() {
    var out = {};
    CATS.forEach(function (cat) {
      if (state.sel[cat.id]) {
        var o = optionById(cat.id, state.sel[cat.id]);
        if (o) out[cat.id] = o;
      }
    });
    return out;
  }

  function partsTotal(sel) {
    var sum = 0;
    Object.keys(sel).forEach(function (k) {
      sum += Number(sel[k].usd) || 0;
    });
    return sum;
  }

  /* ------------------------------------------------------------- pricing */
  var FALLBACK = {
    dutyPct: 15,
    marginPct: 20,
    feePct: 3,
    warrantyPct: 3,
  };

  function pricing() {
    var p = CFG.pricing || FALLBACK;
    return {
      dutyPct: p.dutyPct,
      marginPct: p.marginPct,
      feePct: p.feePct,
      warrantyPct: p.warrantyPct,
    };
  }

  function allowanceFor(parts) {
    var tier = parts < 1000 ? "low" : parts < 2300 ? "mid" : "high";
    if (PRICING && PRICING.allowanceFor) return PRICING.allowanceFor(tier);
    var a = (CFG.tierAllowances || {})[tier] || { freight: 150, labour: 70, consumables: 20, packaging: 25 };
    return a;
  }

  /* Same arithmetic as app.js — kept here so the builder never silently
     disagrees with the calculator if it is dropped into another page. */
  function computeCost(input) {
    if (PRICING && PRICING.computeCost) return PRICING.computeCost(input);
    var parts = Number(input.parts) || 0;
    var base = parts + (Number(input.freight) || 0);
    var duty = (base * (Number(input.dutyPct) || 0)) / 100;
    var landed = base + duty;
    var addons = (Number(input.labour) || 0) + (Number(input.consumables) || 0) + (Number(input.packaging) || 0);
    var warranty = (parts * (Number(input.warrantyPct) || 0)) / 100;
    var cost = landed + addons + warranty;
    var denom = 1 - (Number(input.marginPct) || 0) / 100 - (Number(input.feePct) || 0) / 100;
    var price = denom > 0 ? cost / denom : null;
    return {
      parts: parts,
      freight: Number(input.freight) || 0,
      duty: duty,
      landed: landed,
      addons: addons,
      warranty: warranty,
      cost: cost,
      price: price,
    };
  }

  function quoteFor(sel) {
    var parts = partsTotal(sel);
    var a = allowanceFor(parts);
    var p = pricing();
    var out = computeCost({
      parts: parts,
      freight: a.freight,
      labour: a.labour,
      consumables: a.consumables,
      packaging: a.packaging,
      dutyPct: p.dutyPct,
      marginPct: p.marginPct,
      feePct: p.feePct,
      warrantyPct: p.warrantyPct,
    });
    out.partsSum = parts;
    out.count = Object.keys(sel).length;
    return out;
  }

  /* ------------------------------------------------------- compatibility */
  function checks(sel) {
    var out = [];
    var cpu = sel.cpu, mb = sel.motherboard, mem = sel.memory;
    var psu = sel.power, gpu = sel.gpu, cs = sel.case, cool = sel.cooler;

    if (cpu && mb && cpu.socket !== mb.socket) {
      out.push({ level: "error", text: cpu.name + " is " + cpu.socket + "; " + mb.name + " is an " + mb.socket + " board. Those don't fit together." });
    }
    if (mem && mb && mem.type !== mb.ram) {
      out.push({ level: "error", text: mem.name + " is " + mem.type + " memory, and " + mb.name + " takes " + mb.ram + "." });
    }
    if (mb && cs && mb.formFactor === "ATX" && cs.formFactor === "matx") {
      out.push({ level: "error", text: mb.name + " is a full ATX board — it needs a mid or full tower, not the compact case." });
    }
    if (gpu && cs && gpu.len > cs.maxGpu) {
      out.push({ level: "error", text: gpu.name + " is about " + gpu.len + "mm long; that case lists " + cs.maxGpu + "mm of clearance." });
    }
    if (cool && cool.rad && cs && cs.rad && cs.rad.indexOf(cool.rad) === -1) {
      out.push({ level: "error", text: cs.name + " doesn't list " + cool.rad + "mm radiator support. Pick a larger case or a smaller cooler." });
    }

    if (cpu && gpu && psu) {
      var draw = cpu.tdp + gpu.watts + 80;
      var rec = Math.ceil(((cpu.tdp + gpu.watts + 100) * 1.3) / 50) * 50;
      if (psu.watts < draw) {
        out.push({ level: "error", text: "Peak draw is roughly " + draw + "W; a " + psu.watts + "W unit is below it. Step up to at least " + rec + "W." });
      } else if (psu.watts < rec) {
        out.push({ level: "warn", text: "Peak draw is roughly " + draw + "W. A " + psu.watts + "W unit works, but " + rec + "W leaves room for transients and a GPU upgrade." });
      }
    }
    if (cpu && cool && cool.tdp < cpu.tdp + 20) {
      out.push({ level: "warn", text: cool.name + " is rated around " + cool.tdp + "W; the " + cpu.name + " sustains " + cpu.tdp + "W. Expect a noisy fan under long loads." });
    }
    if (mem && mem.sticks === 4) {
      out.push({ level: "warn", text: "Four DIMMs can force a lower EXPO speed on AM5. Two larger sticks are usually the faster choice." });
    }

    return out;
  }

  /* --------------------------------------------------------------- render */
  function renderPresets() {
    var wrap = $("builder-presets");
    if (!wrap) return;
    wrap.innerHTML = "";
    var label = el("span", "presets__label", "Start from");
    wrap.appendChild(label);

    PRESETS.forEach(function (p) {
      var btn = el(
        "button",
        "preset",
        '<span class="preset__tier" style="color:' + tierColor(p.tier) + ";border-color:" + tierColor(p.tier) +
          '">' + escapeHtml(p.tier) + "</span><span>" + escapeHtml(p.name) + "</span>"
      );
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(state.preset === p.id));
      btn.addEventListener("click", function () {
        applyPreset(p.id);
      });
      wrap.appendChild(btn);
    });
  }

  function renderCats() {
    var wrap = $("builder-cats");
    if (!wrap) return;
    wrap.innerHTML = "";
    CATS.forEach(function (cat) {
      var chosen = state.sel[cat.id] ? optionById(cat.id, state.sel[cat.id]) : null;
      var btn = el(
        "button",
        "bcat" + (state.active === cat.id ? " bcat--on" : ""),
        '<span class="bcat__label">' + escapeHtml(cat.label) + "</span>" +
          '<span class="bcat__pick">' + (chosen ? escapeHtml(chosen.name) : "Not picked") + "</span>" +
          (chosen
            ? '<span class="bcat__tier" style="color:' + tierColor(chosen.tier) + '">' + escapeHtml(chosen.tier) + "</span>"
            : "")
      );
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", String(state.active === cat.id));
      btn.addEventListener("click", function () {
        state.active = cat.id;
        renderCats();
        renderOptions();
      });
      wrap.appendChild(btn);
    });
  }

  function renderOptions() {
    var wrap = $("builder-options");
    if (!wrap) return;
    var cat = find(CATS, state.active);
    if (!cat) return;

    var hint = $("builder-hint");
    if (hint) hint.textContent = cat.hint || "";

    wrap.innerHTML = "";
    var grid = el("div", "parts");
    cat.options.forEach(function (opt) {
      var on = state.sel[cat.id] === opt.id;
      var btn = el("button", "part" + (on ? " part--on" : ""));
      btn.type = "button";
      btn.setAttribute("aria-pressed", String(on));
      btn.setAttribute("title", "Select " + opt.name);
      btn.innerHTML =
        '<span class="part__art">' + ART.partIcon(cat.id, opt) + "</span>" +
        '<span class="part__meta">' +
        '<span class="part__row"><span class="part__name">' + escapeHtml(opt.name) + "</span>" +
        '<span class="part__tier" style="color:' + tierColor(opt.tier) + ";background:" + tierColor(opt.tier) +
        '1f">' + escapeHtml(opt.tier) + "</span></span>" +
        '<span class="part__spec">' + escapeHtml(opt.spec) + "</span>" +
        '<span class="part__price">' + usd(opt.usd) + (on ? " · selected" : "") + "</span>" +
        "</span>";

      btn.addEventListener("click", function () {
        if (state.sel[cat.id] === opt.id) delete state.sel[cat.id];
        else state.sel[cat.id] = opt.id;
        state.preset = null;
        save();
        renderAll();
      });
      grid.appendChild(btn);
    });
    wrap.appendChild(grid);
  }

  function renderRig(sel) {
    var box = $("rig-preview");
    if (!box) return;
    var preset = state.preset ? find(PRESETS, state.preset) : null;
    var data = {};
    Object.keys(sel).forEach(function (k) {
      data[k] = sel[k];
    });
    data._title = preset ? "Solid " + preset.name.replace(/^Solid /, "") : "Custom build";
    data._target = preset ? preset.target : "";

    box.innerHTML = ART.rig(data, "live");
    box.classList.toggle("rigbox--empty", !Object.keys(sel).length);
  }

  function renderList(sel) {
    var list = $("build-list");
    if (!list) return;
    list.innerHTML = "";

    if (!Object.keys(sel).length) {
      list.appendChild(el("p", "bill__empty", "Nothing picked yet. Start with a preset above, or click any part picture."));
      return;
    }

    CATS.forEach(function (cat) {
      var opt = sel[cat.id];
      if (!opt) return;
      var row = el("div", "brow");
      row.innerHTML =
        '<span class="brow__art">' + ART.partIcon(cat.id, opt) + "</span>" +
        '<span class="brow__body"><span class="brow__cat">' + escapeHtml(cat.label) +
        '</span><span class="brow__name">' + escapeHtml(opt.name) + "</span></span>" +
        '<span class="brow__price">' + usd(opt.usd) + "</span>";

      var rm = el("button", "brow__rm", "&times;");
      rm.type = "button";
      rm.setAttribute("aria-label", "Remove " + opt.name);
      rm.addEventListener("click", function () {
        delete state.sel[cat.id];
        state.preset = null;
        save();
        renderAll();
      });
      row.appendChild(rm);
      list.appendChild(row);
    });
  }

  function renderBill(sel) {
    var box = $("build-totals");
    if (!box) return;
    var q = quoteFor(sel);
    var p = pricing();
    var totalNgn = q.price ? ngn(q.price * rate()) : "—";

    box.innerHTML =
      '<div class="bill__row"><span>Parts (' + q.count + " of " + CATS.length + ")</span><b>" + usd(q.partsSum) + "</b></div>" +
      '<div class="bill__row"><span>Freight</span><b>' + usd(q.freight) + "</b></div>" +
      '<div class="bill__row"><span>Duty + VAT allowance (' + p.dutyPct + '%)</span><b>' + usd(q.duty) + "</b></div>" +
      '<div class="bill__row"><span>Assembly, burn-in, Windows 11</span><b>' + usd(q.addons) + "</b></div>" +
      '<div class="bill__row"><span>Warranty reserve</span><b>' + usd(q.warranty) + "</b></div>" +
      '<div class="bill__total"><span>Your build, delivered</span>' +
      "<b>" + (q.price ? usd(q.price) : "—") + "</b>" +
      '<em>' + totalNgn + " at ₦" + rate().toLocaleString("en-NG", { minimumFractionDigits: 2 }) + "/$</em></div>";

    var quote = $("builder-quote");
    if (quote) {
      var link = contactLink(message(sel, q));
      if (link) {
        quote.href = link;
        quote.style.display = "";
        quote.textContent = waNumber() ? "Send this build on WhatsApp" : "Send this build by email";
      } else {
        quote.removeAttribute("href");
        quote.style.display = "none";
      }
    }

    var dl = $("builder-download");
    if (dl) dl.disabled = !Object.keys(sel).length;
  }

  function renderCompat(sel) {
    var box = $("build-compat");
    if (!box) return;
    var issues = checks(sel);
    box.innerHTML = "";

    if (!Object.keys(sel).length) {
      box.innerHTML = '<p class="compat__ok">Pick parts and we\u2019ll check socket, memory, clearance and power as you go.</p>';
      return;
    }
    if (!issues.length) {
      box.innerHTML = '<p class="compat__ok">Compatibility checked: socket, memory type, case clearance and PSU headroom all line up.</p>';
      return;
    }
    issues.slice(0, 4).forEach(function (issue) {
      box.appendChild(el("p", "compat__item compat__item--" + issue.level, escapeHtml(issue.text)));
    });
  }

  function renderAll() {
    var sel = selected();
    renderPresets();
    renderCats();
    renderOptions();
    renderRig(sel);
    renderList(sel);
    renderBill(sel);
    renderCompat(sel);
  }

  /* -------------------------------------------------------------- actions */
  function applyPreset(id) {
    var p = find(PRESETS, id);
    if (!p) return;
    state.sel = {};
    Object.keys(p.parts).forEach(function (k) {
      if (optionById(k, p.parts[k])) state.sel[k] = p.parts[k];
    });
    state.preset = id;
    save();
    renderAll();
  }

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({ sel: state.sel, preset: state.preset, active: state.active }));
    } catch (e) {
      /* private mode, ignore */
    }
  }

  function restore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (!data || !data.sel) return false;
      var valid = {};
      Object.keys(data.sel).forEach(function (k) {
        if (optionById(k, data.sel[k])) valid[k] = data.sel[k];
      });
      state.sel = valid;
      state.preset = data.preset || null;
      if (data.active && find(CATS, data.active)) state.active = data.active;
      return true;
    } catch (e) {
      return false;
    }
  }

  function waNumber() {
    return String(CFG.phone || "").replace(/\D/g, "");
  }

  function contactLink(text) {
    var digits = waNumber();
    if (digits) return "https://wa.me/" + digits + "?text=" + encodeURIComponent(text);
    if (CFG.email) {
      return "mailto:" + CFG.email + "?subject=" + encodeURIComponent("Custom build — SolidRig") +
        "&body=" + encodeURIComponent(text);
    }
    return null;
  }

  function message(sel, q) {
    var lines = ["Hi " + (CFG.brand || "SolidRig") + " — here's the build I put together on the site:", ""];
    CATS.forEach(function (cat) {
      var opt = sel[cat.id];
      if (opt) lines.push("• " + cat.label + ": " + opt.name + " (" + opt.spec + ") — " + usd(opt.usd));
    });
    lines.push("");
    lines.push("Parts subtotal: " + usd(q.partsSum));
    lines.push("Build total (landed, assembled, tested): " + (q.price ? usd(q.price) : "—"));
    lines.push("In Naira: " + (q.price ? ngn(q.price * rate()) : "—"));
    lines.push("");
    lines.push("Can you confirm stock and lead time?");
    return lines.join("\n");
  }

  function slug(s) {
    return String(s || "build").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function downloadPicture() {
    var host = $("rig-preview");
    var svg = host ? host.querySelector("svg") : null;
    var status = $("builder-status");
    if (!svg) return;

    if (status) status.textContent = "Rendering your build picture…";

    var clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "1120");
    clone.setAttribute("height", "1440");
    var source = new XMLSerializer().serializeToString(clone);

    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = 1120;
      canvas.height = 1440;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 1120, 1440);

      var preset = state.preset ? find(PRESETS, state.preset) : null;
      var name = "SolidRig-" + slug(preset ? preset.name : "custom-build") + "-" + new Date().toISOString().slice(0, 10) + ".png";

      function save(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 3000);
        if (status) status.textContent = "Saved " + name + " to your Downloads folder.";
      }

      if (canvas.toBlob) canvas.toBlob(save, "image/png");
      else {
        var href = canvas.toDataURL("image/png");
        var a2 = document.createElement("a");
        a2.href = href;
        a2.download = name;
        a2.click();
        if (status) status.textContent = "Saved " + name + " to your Downloads folder.";
      }
    };
    img.onerror = function () {
      if (status) status.textContent = "Couldn't render the picture — try a different browser.";
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  }

  /* ----------------------------------------------------------------- init */
  var started = false;

  function init() {
    if (started) return;
    started = true;

    var note = $("builder-note");
    if (note && CATALOG.note) note.textContent = CATALOG.note;

    if (!restore()) applyPreset("solid-core");
    else renderAll();

    var reset = $("builder-reset");
    if (reset) {
      reset.addEventListener("click", function () {
        state.sel = {};
        state.preset = null;
        save();
        renderAll();
      });
    }

    var dl = $("builder-download");
    if (dl) dl.addEventListener("click", downloadPicture);

    /* "Build this spec your way" on a build card opens the builder on that preset. */
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-customise-build]");
      if (!trigger) return;
      var id = trigger.getAttribute("data-customise-build");
      if (!find(PRESETS, id)) return;
      applyPreset(id);
      var section = $("builder");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
