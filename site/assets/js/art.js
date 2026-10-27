/* ==========================================================================
   SolidRig — vector artwork
   Every part is drawn as flat, transparent-background SVG: no photos, no
   licensing, no background to remove. Colour is passed in from the part's
   tier, so the art matches the tier ladder everywhere it appears.

   Exposed as window.SOLIDRIG_ART:
     partIcon(category, option)  → 200×150 part illustration
     rig(selection, uid)         → 560×710 assembled build illustration
   ========================================================================== */
window.SOLIDRIG_ART = (function () {
  "use strict";

  var C = {
    body: "#151b24",
    body2: "#101720",
    panel: "#1b2430",
    ink: "#0b0f15",
    line: "#4d5a6d",
    line2: "#303c4b",
    text: "#c9d2df",
    muted: "#78838f",
    gold: "#f5b642",
  };

  var TIER = {
    "S+": "#f5b642",
    S: "#f5b642",
    A: "#3ddc97",
    B: "#4cb8f5",
    C: "#8b93a1",
    D: "#6b7280",
  };

  function accent(t) {
    return TIER[t] || C.line;
  }

  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function n(v) {
    return Math.round(v * 100) / 100;
  }

  function wrap(w, h, body) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" width="' +
      w +
      '" height="' +
      h +
      '" fill="none" role="img" aria-hidden="true">' +
      body +
      "</svg>"
    );
  }

  /* A three-blade fan. */
  function fan(cx, cy, r, col, op) {
    var o =
      '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r) +
      '" fill="' + C.ink + '" stroke="#3b4857" stroke-width="1.3"/>' +
      '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r * 0.8) +
      '" fill="none" stroke="#27313d" stroke-width="1"/>';

    for (var i = 0; i < 3; i++) {
      o +=
        '<ellipse cx="' + n(cx) + '" cy="' + n(cy - r * 0.42) + '" rx="' + n(r * 0.2) +
        '" ry="' + n(r * 0.4) + '" fill="' + col + '" opacity="' + op +
        '" transform="rotate(' + (i * 120 + 18) + " " + n(cx) + " " + n(cy) + ')"/>';
    }
    o +=
      '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r * 0.17) +
      '" fill="#2f3b4a"/>';
    return o;
  }

  /* -------------------------------------------------- part illustrations */

  function iconCPU(o) {
    var a = accent(o.tier);
    var s = "";
    s += '<rect x="58" y="30" width="84" height="84" rx="7" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.6"/>';
    s += '<rect x="70" y="42" width="60" height="60" rx="4" fill="#1a222d" stroke="#6b7889" stroke-width="1.3"/>';
    s += '<rect x="80" y="52" width="40" height="40" rx="2" fill="none" stroke="' + C.line2 + '"/>';
    s += '<path d="M70 42h10l-10 10z" fill="#3a4655"/>';
    s += '<path d="M84 98h46" stroke="' + a + '" stroke-width="2.4" stroke-linecap="round"/>';
    s += '<path d="M84 92h22" stroke="#5d6b7d" stroke-width="2" stroke-linecap="round"/>';
    /* pins */
    for (var i = 0; i < 9; i++) {
      var x = 66 + i * 9;
      s += '<path d="M' + x + ' 114v7" stroke="#3c4857" stroke-width="2.2" stroke-linecap="round"/>';
      s += '<path d="M' + x + ' 23v-7" stroke="#3c4857" stroke-width="2.2" stroke-linecap="round"/>';
    }
    return wrap(200, 150, s);
  }

  function iconGPU(o) {
    var a = accent(o.tier);
    var fans = o.fans || 2;
    var s = "";
    s += '<rect x="16" y="50" width="8" height="50" rx="2" fill="#242e3b" stroke="' + C.line + '" stroke-width="1.2"/>';
    s += '<rect x="24" y="43" width="152" height="54" rx="7" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.6"/>';
    s += '<path d="M32 47h136" stroke="' + a + '" stroke-width="2" stroke-linecap="round" opacity="0.9"/>';
    s += '<rect x="136" y="34" width="22" height="9" rx="2" fill="#242e3b" stroke="' + C.line2 + '"/>';
    s += '<path d="M118 97v6h26v-6" fill="' + C.body2 + '" stroke="' + C.line2 + '"/>';
    s += '<path d="M152 62v26M158 62v26M164 62v26" stroke="#26313f" stroke-width="3" stroke-linecap="round"/>';

    var r = 16;
    var gap = (152 - 12) / fans;
    for (var i = 0; i < fans; i++) {
      s += fan(24 + 6 + gap * i + gap / 2, 71, r, a, 0.34);
    }
    return wrap(200, 150, s);
  }

  function iconMotherboard(o) {
    var a = accent(o.tier);
    var s = "";
    s += '<rect x="36" y="24" width="128" height="102" rx="4" fill="' + C.body2 + '" stroke="' + C.line2 + '" stroke-width="1.3"/>';
    /* I/O shroud */
    s += '<rect x="42" y="30" width="30" height="16" rx="2" fill="' + C.panel + '" stroke="' + C.line + '" stroke-width="1.1"/>';
    /* socket */
    s += '<rect x="54" y="54" width="38" height="38" rx="3" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.3"/>';
    s += '<rect x="61" y="61" width="24" height="24" fill="none" stroke="' + C.line2 + '"/>';
    /* memory slots */
    for (var i = 0; i < 4; i++) {
      s += '<rect x="' + (116 + i * 10) + '" y="42" width="5" height="56" rx="2.5" fill="#1e2835" stroke="' + C.line2 + '"/>';
    }
    /* PCIe slots */
    s += '<rect x="54" y="104" width="72" height="6" rx="2" fill="#1e2835" stroke="' + C.line2 + '"/>';
    s += '<path d="M58 107h62" stroke="#8a6a2f" stroke-width="1.4"/>';
    s += '<rect x="54" y="115" width="52" height="5" rx="2" fill="#1e2835" stroke="' + C.line2 + '"/>';
    s += '<rect x="92" y="76" width="36" height="18" rx="2" fill="' + C.panel + '" stroke="' + C.line + '"/>';
    s += '<path d="M96 85h28" stroke="' + a + '" stroke-width="1.8" stroke-linecap="round"/>';
    /* VRM heatsinks */
    s += '<rect x="54" y="38" width="38" height="9" rx="2" fill="' + C.panel + '" stroke="' + C.line2 + '"/>';
    s += '<rect x="98" y="42" width="8" height="50" rx="2" fill="' + C.panel + '" stroke="' + C.line2 + '"/>';
    /* standoffs */
    [[44, 34], [154, 34], [44, 118], [154, 118]].forEach(function (p) {
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2" fill="#3c4857"/>';
    });
    return wrap(200, 150, s);
  }

  function iconMemory(o) {
    var a = accent(o.tier);
    var sticks = o.sticks === 4 ? 4 : 2;
    var w = 20, gap = 9;
    var total = sticks * w + (sticks - 1) * gap;
    var x = (200 - total) / 2;
    var s = "";
    for (var i = 0; i < sticks; i++) {
      var sx = x + i * (w + gap);
      s += '<rect x="' + n(sx) + '" y="30" width="' + w + '" height="90" rx="3" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.3"/>';
      s += '<rect x="' + n(sx) + '" y="30" width="' + w + '" height="14" rx="3" fill="' + C.panel + '"/>';
      s += '<path d="M' + n(sx + 3) + ' 37h' + (w - 6) + '" stroke="' + a + '" stroke-width="1.8" stroke-linecap="round"/>';
      s += '<path d="M' + n(sx + 5) + ' 50v58" stroke="' + C.line2 + '" stroke-width="1"/>';
      s += '<rect x="' + n(sx + w / 2 - 2.5) + '" y="101" width="5" height="11" fill="' + C.ink + '" stroke="' + C.line2 + '" stroke-width="0.8"/>';
      s += '<path d="M' + n(sx) + ' 113h' + w + '" stroke="#8a6a2f" stroke-width="2.6"/>';
    }
    return wrap(200, 150, s);
  }

  function iconStorage(o) {
    var a = accent(o.tier);
    var sink = (o.gen || 3) >= 5 || ((o.gen || 3) >= 4 && (o.tb || 0) >= 2);
    var s = "";
    s += '<rect x="26" y="62" width="148" height="28" rx="3" fill="' + C.body2 + '" stroke="' + C.line2 + '" stroke-width="1.2"/>';
    s += '<path d="M26 66h148" stroke="#6d7787" stroke-width="1"/>';
    for (var i = 0; i < 7; i++) {
      s += '<path d="M' + (30 + i * 3.4) + ' 62v28" stroke="#8a6a2f" stroke-width="1.6"/>';
    }
    s += '<rect x="62" y="68" width="26" height="16" rx="1.5" fill="' + C.panel + '" stroke="' + C.line2 + '"/>';
    s += '<rect x="94" y="68" width="26" height="16" rx="1.5" fill="' + C.panel + '" stroke="' + C.line2 + '"/>';
    s += '<rect x="128" y="70" width="18" height="12" rx="1.5" fill="#22303f" stroke="' + a + '" stroke-width="1.1"/>';
    if (sink) {
      s += '<rect x="48" y="40" width="104" height="24" rx="4" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.4"/>';
      for (var k = 0; k < 6; k++) {
        s += '<path d="M' + (56 + k * 16) + ' 44v16" stroke="' + C.line2 + '" stroke-width="2"/>';
      }
      s += '<path d="M48 46h104" stroke="' + a + '" stroke-width="1.6" stroke-linecap="round" opacity="0.9"/>';
    }
    return wrap(200, 150, s);
  }

  function iconCooler(o) {
    var a = accent(o.tier);
    var type = o.type || "air1";
    var s = "";

    if (type === "air1" || type === "air2") {
      var towers = type === "air2" ? 2 : 1;
      var tw = towers === 2 ? 26 : 34;
      var firstX = towers === 2 ? 68 : 78;
      s += '<rect x="52" y="104" width="' + (towers === 2 ? 96 : 60) + '" height="6" rx="2" fill="#2b3644"/>';
      for (var t = 0; t < towers; t++) {
        var tx = firstX + t * 40;
        s += '<rect x="' + tx + '" y="36" width="' + tw + '" height="70" rx="3" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.4"/>';
        for (var f = 0; f < 7; f++) {
          s += '<path d="M' + (tx + 3) + ' ' + (42 + f * 9) + 'h' + (tw - 6) + '" stroke="' + C.line2 + '" stroke-width="1.6"/>';
        }
        s += '<path d="M' + tx + ' 39h' + tw + '" stroke="' + a + '" stroke-width="1.6" stroke-linecap="round"/>';
      }
      s += fan(towers === 2 ? 52 : 58, 72, 22, a, 0.3);
      if (towers === 2) s += fan(148, 72, 22, a, 0.3);
      return wrap(200, 150, s);
    }

    /* liquid: radiator + pump */
    var radFans = type === "aio240" ? 2 : 3;
    s += '<rect x="28" y="26" width="144" height="22" rx="3" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.4"/>';
    for (var i = 0; i < 14; i++) {
      s += '<path d="M' + (32 + i * 10) + ' 30v14" stroke="' + C.line2 + '" stroke-width="1.4"/>';
    }
    for (var j = 0; j < radFans; j++) {
      s += '<circle cx="' + (56 + j * 44) + '" cy="37" r="9" fill="none" stroke="' + a + '" stroke-width="1.2" opacity="0.55"/>';
    }
    /* tubes */
    s += '<path d="M88 52c-10 8-26 14-30 26" stroke="#3c4a5b" stroke-width="7" stroke-linecap="round"/>';
    s += '<path d="M112 52c10 8 26 14 30 26" stroke="#3c4a5b" stroke-width="7" stroke-linecap="round"/>';
    /* pump block */
    s += '<circle cx="100" cy="96" r="26" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.6"/>';
    if (type === "aio360lcd") {
      s += '<rect x="86" y="82" width="28" height="28" rx="4" fill="#0d1219" stroke="' + a + '" stroke-width="1.4"/>';
      s += '<path d="M92 96h16" stroke="' + a + '" stroke-width="1.6" stroke-linecap="round"/>';
    } else {
      s += '<circle cx="100" cy="96" r="19" fill="none" stroke="' + C.line2 + '" stroke-width="1.2"/>';
      s += '<circle cx="100" cy="96" r="13" fill="none" stroke="' + a + '" stroke-width="1.6" opacity="0.7"/>';
      s += '<circle cx="100" cy="96" r="4" fill="' + a + '" opacity="0.5"/>';
    }
    return wrap(200, 150, s);
  }

  function iconPSU(o) {
    var a = accent(o.tier);
    var s = "";
    s += '<rect x="30" y="40" width="140" height="72" rx="5" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.6"/>';
    s += '<circle cx="102" cy="76" r="26" fill="' + C.ink + '" stroke="' + C.line2 + '" stroke-width="1.2"/>';
    for (var i = 0; i < 8; i++) {
      var ang = (i * 45 * Math.PI) / 180;
      s += '<path d="M' + n(102 + Math.cos(ang) * 7) + ' ' + n(76 + Math.sin(ang) * 7) + 'L' +
        n(102 + Math.cos(ang) * 23) + ' ' + n(76 + Math.sin(ang) * 23) +
        '" stroke="#2c3745" stroke-width="1.2"/>';
    }
    s += '<circle cx="102" cy="76" r="6" fill="' + C.panel + '" stroke="' + C.line2 + '"/>';
    s += '<rect x="38" y="48" width="38" height="18" rx="2" fill="' + C.panel + '" stroke="' + C.line2 + '"/>';
    s += '<path d="M42 54h30" stroke="' + a + '" stroke-width="1.8" stroke-linecap="round"/>';
    s += '<path d="M42 60h18" stroke="#5d6b7d" stroke-width="1.6" stroke-linecap="round"/>';
    /* cables */
    s += '<path d="M30 88c-10 4-8 18 4 18h6" stroke="#3d4a5b" stroke-width="4" stroke-linecap="round"/>';
    s += '<path d="M30 96c-6 6-2 14 6 14" stroke="#33404f" stroke-width="3" stroke-linecap="round"/>';
    return wrap(200, 150, s);
  }

  function iconCase(o) {
    var a = accent(o.tier);
    var ff = o.formFactor || "mid";
    var w = ff === "full" ? 92 : ff === "matx" ? 74 : 84;
    var h = ff === "full" ? 112 : ff === "matx" ? 96 : 106;
    var x = (200 - w) / 2, y = (150 - h) / 2 - 4;
    var s = "";
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="' + C.body + '" stroke="' + C.line + '" stroke-width="1.6"/>';
    /* front mesh strip */
    s += '<rect x="' + (x + 3) + '" y="' + (y + 7) + '" width="11" height="' + (h - 14) + '" rx="3" fill="#1a2431" stroke="' + C.line2 + '"/>';
    for (var i = 0; i < 9; i++) {
      s += '<circle cx="' + (x + 8.5) + '" cy="' + (y + 14 + i * ((h - 28) / 8)) + '" r="1" fill="#3a4759"/>';
    }
    /* glass */
    s += '<rect x="' + (x + 19) + '" y="' + (y + 9) + '" width="' + (w - 27) + '" height="' + (h - 18) + '" rx="3" fill="rgba(140,180,255,0.045)" stroke="rgba(255,255,255,0.12)"/>';
    /* internals seen through the glass */
    s += '<rect x="' + (x + 27) + '" y="' + (y + 17) + '" width="' + (w - 38) + '" height="' + Math.round(h * 0.46) +
      '" rx="2" fill="#0d141d" stroke="#2c3846"/>';
    s += '<rect x="' + (x + 30) + '" y="' + (y + 17 + Math.round(h * 0.5)) + '" width="' + (w - 46) + '" height="12" rx="2" fill="#1b2430" stroke="#3c4a5e"/>';
    s += '<path d="M' + (x + 33) + ' ' + (y + 21 + Math.round(h * 0.5)) + 'h' + (w - 52) + '" stroke="' + a + '" stroke-width="1.5" stroke-linecap="round"/>';
    s += '<rect x="' + (x + 27) + '" y="' + (y + h - 26) + '" width="' + (w - 38) + '" height="13" rx="2" fill="#121a24" stroke="#303c4b"/>';
    /* top accent + feet */
    s += '<path d="M' + (x + 19) + ' ' + (y + 6) + 'h' + (w - 27) + '" stroke="' + a + '" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>';
    s += '<rect x="' + (x + 8) + '" y="' + (y + h + 2) + '" width="16" height="5" rx="2" fill="#242e3b"/>';
    s += '<rect x="' + (x + w - 24) + '" y="' + (y + h + 2) + '" width="16" height="5" rx="2" fill="#242e3b"/>';
    return wrap(200, 150, s);
  }

  function partIcon(category, option) {
    switch (category) {
      case "cpu": return iconCPU(option);
      case "gpu": return iconGPU(option);
      case "motherboard": return iconMotherboard(option);
      case "memory": return iconMemory(option);
      case "storage": return iconStorage(option);
      case "cooler": return iconCooler(option);
      case "power": return iconPSU(option);
      case "case": return iconCase(option);
      default: return wrap(200, 150, "");
    }
  }

  /* ------------------------------------------------------ assembled rig */

  /**
   * Draws the finished machine side-on, behind a glass panel.
   * What changes with the selection: case size, fan count, GPU length and
   * fan count, air vs liquid cooling (and radiator size), RAM stick count,
   * PSU wattage, and the accent colour taken from the GPU tier.
   */
  function rig(sel, uid) {
    sel = sel || {};
    var g = sel.gpu, cs = sel.case, mb = sel.motherboard, mem = sel.memory;
    var cool = sel.cooler, psu = sel.power;
    var id = "rig" + (uid || "0");

    var form = (cs && cs.formFactor) || "mid";
    var dims = { matx: { w: 330, h: 500 }, mid: { w: 370, h: 550 }, full: { w: 404, h: 596 } }[form] ||
      { w: 370, h: 550 };
    var W = dims.w, H = dims.h;
    var x0 = (560 - W) / 2;
    var y0 = 34 + (596 - H) / 2;
    var s = W / 370;

    var pad = 14 * s;
    var gx = x0 + pad, gy = y0 + pad;
    var gw = W - pad * 2, gh = H - pad * 2;

    var a = accent(g ? g.tier : (cool ? cool.tier : "A"));
    var steam = [];

    /* floor shadow + cabinet */
    steam.push('<ellipse cx="280" cy="' + n(y0 + H + 26) + '" rx="' + n(W * 0.46) + '" ry="' + n(15 * s) +
      '" fill="url(#' + id + 'shadow)"/>');
    steam.push('<rect x="' + n(x0) + '" y="' + n(y0) + '" width="' + n(W) + '" height="' + n(H) +
      '" rx="12" fill="url(#' + id + 'body)" stroke="#3b4655" stroke-width="1.6"/>');
    /* front mesh strip */
    steam.push('<rect x="' + n(x0 + 3) + '" y="' + n(y0 + 10) + '" width="' + n(11 * s) + '" height="' + n(H - 20) +
      '" rx="4" fill="url(#' + id + 'mesh)" stroke="#2b3644"/>');
    /* glass */
    steam.push('<rect x="' + n(gx) + '" y="' + n(gy) + '" width="' + n(gw) + '" height="' + n(gh) +
      '" rx="8" fill="url(#' + id + 'glass)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>');
    steam.push('<path d="M' + n(gx + gw * 0.44) + ' ' + n(gy) + 'L' + n(gx + gw * 0.64) + ' ' + n(gy) +
      'L' + n(gx) + ' ' + n(gy + gh * 0.52) + 'L' + n(gx) + ' ' + n(gy + gh * 0.26) +
      'Z" fill="rgba(255,255,255,0.018)"/>');

    /* motherboard */
    var mx = gx + 54 * s, my = gy + 58 * s;
    var mw = gw - 98 * s, mh = gh - 170 * s;
    steam.push('<rect x="' + n(mx) + '" y="' + n(my) + '" width="' + n(mw) + '" height="' + n(mh) +
      '" rx="4" fill="#0d141d" stroke="#35435a" stroke-width="1.2"/>');
    /* I/O shroud, VRM heatsinks */
    steam.push('<rect x="' + n(mx + 6 * s) + '" y="' + n(my + 8 * s) + '" width="' + n(46 * s) + '" height="' + n(20 * s) +
      '" rx="2" fill="#1b2430" stroke="#39465a"/>');
    steam.push('<rect x="' + n(mx + 60 * s) + '" y="' + n(my + 10 * s) + '" width="' + n((mw - 148 * s)) + '" height="' + n(11 * s) +
      '" rx="2" fill="#18212c" stroke="#333f52"/>');
    steam.push('<rect x="' + n(mx + 8 * s) + '" y="' + n(my + 42 * s) + '" width="' + n(11 * s) + '" height="' + n(70 * s) +
      '" rx="2" fill="#18212c" stroke="#333f52"/>');

    /* chipset, PCIe slots, M.2 */
    steam.push('<rect x="' + n(mx + mw - 94 * s) + '" y="' + n(my + mh - 58 * s) + '" width="' + n(62 * s) + '" height="' + n(30 * s) +
      '" rx="3" fill="#18212c" stroke="#3c4a5e"/>');
    steam.push('<path d="M' + n(mx + mw - 88 * s) + ' ' + n(my + mh - 50 * s) + 'h' + n(50 * s) +
      '" stroke="' + a + '" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>');
    steam.push('<rect x="' + n(mx + 16 * s) + '" y="' + n(my + mh - 44 * s) + '" width="' + n(96 * s) + '" height="' + n(13 * s) +
      '" rx="2" fill="#1b2430" stroke="#3c4a5e"/>');
    steam.push('<circle cx="' + n(mx + 108 * s) + '" cy="' + n(my + mh - 37 * s) + '" r="' + n(2.2 * s) + '" fill="#5b6879"/>');
    steam.push('<rect x="' + n(mx + 16 * s) + '" y="' + n(my + mh - 24 * s) + '" width="' + n(76 * s) + '" height="' + n(6 * s) +
      '" rx="2" fill="#1a2430" stroke="#333f52"/>');

    /* standoffs */
    [[mx + 8, my + 8], [mx + mw - 8, my + 8], [mx + 8, my + mh - 8], [mx + mw - 8, my + mh - 8]].forEach(function (p) {
      steam.push('<circle cx="' + n(p[0]) + '" cy="' + n(p[1]) + '" r="' + n(2.4 * s) + '" fill="#3c4857"/>');
    });

    /* CPU + cooler */
    var scx = mx + 96 * s, scy = my + 92 * s;
    steam.push('<rect x="' + n(scx - 27 * s) + '" y="' + n(scy - 27 * s) + '" width="' + n(54 * s) + '" height="' + n(54 * s) +
      '" rx="3" fill="#141c26" stroke="#3d4a5c" stroke-width="1.2"/>');

    var ctype = (cool && cool.type) || "air1";
    if (ctype === "air1" || ctype === "air2") {
      var towers = ctype === "air2" ? 2 : 1;
      var tw = 46 * s;
      var step = 52 * s;
      var baseX = scx - (towers === 2 ? 58 : 23) * s;
      var topY = scy - 74 * s;
      var towerH = 124 * s;

      steam.push('<rect x="' + n(scx - 30 * s) + '" y="' + n(scy + 32 * s) + '" width="' + n(60 * s) + '" height="' + n(9 * s) +
        '" rx="2" fill="#2b3644"/>');

      for (var t = 0; t < towers; t++) {
        var tx = baseX + t * step;
        steam.push('<rect x="' + n(tx) + '" y="' + n(topY) + '" width="' + n(tw) + '" height="' + n(towerH) +
          '" rx="4" fill="#18212c" stroke="#46536a" stroke-width="1.2"/>');
        for (var f = 0; f < 9; f++) {
          steam.push('<path d="M' + n(tx + 4 * s) + ' ' + n(topY + 10 * s + f * 12.5 * s) + 'h' + n(tw - 8 * s) +
            '" stroke="#2b3745" stroke-width="1.5"/>');
        }
        steam.push('<path d="M' + n(tx) + ' ' + n(topY + 2 * s) + 'h' + n(tw) +
          '" stroke="' + a + '" stroke-width="1.6" stroke-linecap="round" opacity="0.75"/>');
      }
      steam.push(fan(scx - (towers === 2 ? 70 : 48) * s, scy - 4 * s, (towers === 2 ? 22 : 28) * s, a, 0.32));
      if (towers === 2) steam.push(fan(scx + 52 * s, scy - 4 * s, 22 * s, a, 0.32));
    } else {
      /* radiator across the roof */
      var radFans = ctype === "aio240" ? 2 : 3;
      var radW = (radFans === 2 ? 138 : 206) * s;
      var rx = gx + (gw - radW) / 2;
      var ry = gy + 5 * s;
      var radH = 22 * s;

      /* tubes, drawn first so the pump and radiator sit on top */
      steam.push('<path d="M' + n(rx + 26 * s) + ' ' + n(ry + radH) + 'C' + n(rx + 30 * s) + ' ' + n(gy + 130 * s) + ' ' +
        n(scx - 74 * s) + ' ' + n(scy - 96 * s) + ' ' + n(scx - 22 * s) + ' ' + n(scy - 24 * s) +
        '" stroke="#3d4a5c" stroke-width="' + n(7 * s) + '" stroke-linecap="round" fill="none"/>');
      steam.push('<path d="M' + n(rx + radW - 26 * s) + ' ' + n(ry + radH) + 'C' + n(rx + radW - 32 * s) + ' ' + n(gy + 140 * s) + ' ' +
        n(scx + 74 * s) + ' ' + n(scy - 96 * s) + ' ' + n(scx + 22 * s) + ' ' + n(scy - 24 * s) +
        '" stroke="#3d4a5c" stroke-width="' + n(7 * s) + '" stroke-linecap="round" fill="none"/>');

      steam.push('<rect x="' + n(rx) + '" y="' + n(ry) + '" width="' + n(radW) + '" height="' + n(radH) +
        '" rx="3" fill="#1a2431" stroke="#46536a" stroke-width="1.2"/>');
      for (var rf2 = 0; rf2 < 18; rf2++) {
        steam.push('<path d="M' + n(rx + 5 * s + rf2 * 11 * s) + ' ' + n(ry + 4 * s) + 'v' + n(radH - 8 * s) +
          '" stroke="#2b3745" stroke-width="1.2"/>');
      }
      steam.push('<path d="M' + n(rx + 4 * s) + ' ' + n(ry + 2 * s) + 'h' + n(radW - 8 * s) +
        '" stroke="' + a + '" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>');
      for (var rf = 0; rf < radFans; rf++) {
        steam.push(fan(rx + (radW / radFans) * (rf + 0.5), ry + radH + 11 * s, 12 * s, a, 0.3));
      }

      /* pump block over the socket */
      steam.push('<circle cx="' + n(scx) + '" cy="' + n(scy) + '" r="' + n(28 * s) +
        '" fill="#18212c" stroke="#46536a" stroke-width="1.2"/>');
      if (ctype === "aio360lcd") {
        steam.push('<rect x="' + n(scx - 17 * s) + '" y="' + n(scy - 17 * s) + '" width="' + n(34 * s) + '" height="' + n(34 * s) +
          '" rx="4" fill="#0c1118" stroke="' + a + '" stroke-width="1.4"/>');
        steam.push('<path d="M' + n(scx - 9 * s) + ' ' + n(scy) + 'h' + n(18 * s) + '" stroke="' + a +
          '" stroke-width="1.6" stroke-linecap="round"/>');
      } else {
        steam.push('<circle cx="' + n(scx) + '" cy="' + n(scy) + '" r="' + n(19 * s) +
          '" fill="none" stroke="' + a + '" stroke-width="1.6" opacity="0.65"/>');
        steam.push('<circle cx="' + n(scx) + '" cy="' + n(scy) + '" r="' + n(5 * s) +
          '" fill="' + a + '" opacity="0.5"/>');
      }
    }

    /* memory */
    var sticks = (mem && mem.sticks) || 2;
    for (var m = 0; m < 4; m++) {
      var ramX = mx + mw - (56 - m * 11) * s;
      var on = m < sticks;
      steam.push('<rect x="' + n(ramX) + '" y="' + n(my + 54 * s) + '" width="' + n(7 * s) + '" height="' + n(108 * s) +
        '" rx="2" fill="' + (on ? "#22303f" : "#161d27") + '" stroke="' + (on ? "#4a5a70" : "#2a3441") + '" stroke-width="1"/>');
      if (on) {
        steam.push('<path d="M' + n(ramX) + ' ' + n(my + 58 * s) + 'v' + n(14 * s) + '" stroke="' + a +
          '" stroke-width="1.6" opacity="0.8"/>');
      }
    }

    /* graphics card */
    var ratio = g ? Math.max(0.05, Math.min(1, (g.len - 180) / 160)) : 0.45;
    var gpuLen = mw * (0.6 + 0.4 * ratio);
    var gpuX = mx + 8 * s;
    var gpuTop = my + mh - 126 * s;
    var gpuH = 58 * s;
    var gpuFans = (g && g.fans) || 2;

    /* PCIe bracket */
    steam.push('<rect x="' + n(gpuX - 8 * s) + '" y="' + n(gpuTop + 5 * s) + '" width="' + n(8 * s) + '" height="' + n(gpuH - 12 * s) +
      '" rx="2" fill="#242e3b" stroke="#48566a" stroke-width="1"/>');
    /* backplate + shroud */
    steam.push('<rect x="' + n(gpuX) + '" y="' + n(gpuTop) + '" width="' + n(gpuLen) + '" height="' + n(gpuH) +
      '" rx="5" fill="url(#' + id + 'gpu)" stroke="#4b5a6e" stroke-width="1.3"/>');
    steam.push('<path d="M' + n(gpuX + 6 * s) + ' ' + n(gpuTop + 5 * s) + 'h' + n(gpuLen - 12 * s) +
      '" stroke="' + a + '" stroke-width="2" stroke-linecap="round"/>');
    steam.push('<path d="M' + n(gpuX + 6 * s) + ' ' + n(gpuTop + gpuH - 7 * s) + 'h' + n(gpuLen - 12 * s) +
      '" stroke="#2c3849" stroke-width="1.2"/>');
    for (var vf = 0; vf < 4; vf++) {
      steam.push('<path d="M' + n(gpuX + gpuLen - (22 - vf * 5) * s) + ' ' + n(gpuTop + 16 * s) + 'v' + n(gpuH - 28 * s) +
        '" stroke="#26313f" stroke-width="' + n(3 * s) + '" stroke-linecap="round"/>');
    }
    for (var gf = 0; gf < gpuFans; gf++) {
      var gstep = (gpuLen - 14 * s) / gpuFans;
      steam.push(fan(gpuX + 7 * s + gstep * (gf + 0.5), gpuTop + gpuH * 0.55, gpuH * 0.3, a, 0.32));
    }

    /* PSU shroud */
    var shroudY = gy + gh - 92 * s;
    steam.push('<rect x="' + n(mx - 8 * s) + '" y="' + n(shroudY) + '" width="' + n(mw + 16 * s) + '" height="' + n(78 * s) +
      '" rx="4" fill="#121a24" stroke="#303c4b" stroke-width="1.2"/>');
    steam.push('<path d="M' + n(mx) + ' ' + n(shroudY + 12 * s) + 'h' + n(mw) + '" stroke="' + C.line2 + '" stroke-width="1"/>');
    steam.push('<text x="' + n(mx + 10 * s) + '" y="' + n(shroudY + 48 * s) + '" fill="#79859a" font-family="Inter, Segoe UI, sans-serif" font-size="' +
      n(11 * s) + '" letter-spacing="1.6">' + esc((psu && psu.name) || "POWER") + "</text>");
    /* vent slots */
    for (var v = 0; v < 5; v++) {
      steam.push('<path d="M' + n(mx + mw - 62 * s + v * 10 * s) + ' ' + n(shroudY + 38 * s) + 'v' + n(26 * s) +
        '" stroke="#26313f" stroke-width="3" stroke-linecap="round"/>');
    }

    /* front intake fans */
    var caseFans = (cs && cs.fans) || 4;
    var frontN = Math.min(3, Math.max(2, caseFans - 1));
    for (var ff = 0; ff < frontN; ff++) {
      var fcy = gy + 118 * s + ff * 106 * s;
      steam.push(fan(gx + 25 * s, fcy, 26 * s, a, 0.28));
    }
    /* rear exhaust */
    steam.push(fan(gx + gw - 24 * s, gy + 48 * s, 21 * s, a, 0.28));

    /* feet */
    steam.push('<rect x="' + n(x0 + 26 * s) + '" y="' + n(y0 + H + 4) + '" width="' + n(34 * s) + '" height="' + n(9 * s) +
      '" rx="3" fill="#1b2430" stroke="#2f3a49"/>');
    steam.push('<rect x="' + n(x0 + W - 60 * s) + '" y="' + n(y0 + H + 4) + '" width="' + n(34 * s) + '" height="' + n(9 * s) +
      '" rx="3" fill="#1b2430" stroke="#2f3a49"/>');

    /* caption */
    var dividerY = Math.max(646, y0 + H + 30);
    var line1 = dividerY + 20;
    var line2 = dividerY + 38;
    var title = (sel._title || "CUSTOM BUILD").toUpperCase();
    var target = sel._target || "";
    var specLine = [g && g.name, mem && mem.name].filter(Boolean).join("  ·  ");

    var defs =
      '<defs>' +
      '<linearGradient id="' + id + 'body" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#1a212b"/><stop offset="1" stop-color="#0d1218"/>' +
      "</linearGradient>" +
      '<linearGradient id="' + id + 'gpu" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#222c3a"/><stop offset="1" stop-color="#131a23"/>' +
      "</linearGradient>" +
      '<linearGradient id="' + id + 'glass" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="rgba(150,190,255,0.07)"/>' +
      '<stop offset="0.6" stop-color="rgba(150,190,255,0.02)"/>' +
      '<stop offset="1" stop-color="rgba(255,255,255,0.05)"/>' +
      "</linearGradient>" +
      '<pattern id="' + id + 'mesh" width="6" height="6" patternUnits="userSpaceOnUse">' +
      '<rect width="6" height="6" fill="#121a24"/>' +
      '<circle cx="3" cy="3" r="1.1" fill="#2b3746"/>' +
      "</pattern>" +
      '<radialGradient id="' + id + 'glow" cx="0.5" cy="0.42" r="0.62">' +
      '<stop offset="0" stop-color="' + a + '" stop-opacity="0.15"/>' +
      '<stop offset="1" stop-color="' + a + '" stop-opacity="0"/>' +
      "</radialGradient>" +
      '<radialGradient id="' + id + 'shadow" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0" stop-color="#000000" stop-opacity="0.55"/>' +
      '<stop offset="1" stop-color="#000000" stop-opacity="0"/>' +
      "</radialGradient>" +
      "</defs>";

    var head = '<rect x="0" y="0" width="560" height="720" fill="url(#' + id + 'glow)"/>';
    var caption =
      '<path d="M' + n(x0) + ' ' + n(dividerY) + 'h' + n(W) + '" stroke="rgba(255,255,255,0.09)"/>' +
      '<text x="' + n(x0) + '" y="' + n(line1) + '" fill="#c9d2df" font-family="Inter, Segoe UI, sans-serif" font-size="12" font-weight="600" letter-spacing="1.7">' +
      esc(title + (target ? "  ·  " + target : "")) + "</text>" +
      '<text x="' + n(x0) + '" y="' + n(line2) + '" fill="#6f7b8b" font-family="Inter, Segoe UI, sans-serif" font-size="10.5" letter-spacing="1.1">' +
      esc(specLine) + "</text>" +
      '<text x="' + n(x0 + W) + '" y="' + n(line2) + '" text-anchor="end" fill="' + C.gold +
      '" font-family="Inter, Segoe UI, sans-serif" font-size="10.5" font-weight="600" letter-spacing="2.2">SOLIDRIG</text>';

    return wrap(560, 720, defs + head + steam.join("") + caption);
  }

  return { partIcon: partIcon, rig: rig, color: accent, tokens: C };
})();
