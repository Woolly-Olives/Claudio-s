/* =============================================================
   Sand Visualiser — the "pile-up skyline" of four modules' deadlines,
   drawn as fine sand that pours in from left to right through the
   term (assets/css/sand.css; the page is in index.html and is reached
   from the burger menu, see app.js's EXTRA_IDS).

   The picture: every assessment adds its weighting, spread evenly over
   the 21 days before its deadline (so a 30% task has three times the
   area of a 10% one), and the daily totals are stacked by module.
   BOTH of those are assumptions of ours, not School data: the 21-day
   lead-up is the same for a 5% test and a 46% report, and a task with
   no stated weighting counts as 15%. The page says so. The dates are
   the calendar's own approximate ones (assets/data/assessments.js).

   Cost, measured while building it (headless Chromium, software
   rendering): each module's layer is drawn ONCE onto its own hidden
   canvas (about a second in all, at 2x pixel density), then every frame
   only copies the finished layers across — revealed column by column
   behind a moving pouring point — and draws a few hundred loose grains.
   Redrawing every grain each frame measured about 5 frames a second;
   this measured about 60. Nothing runs once the animation has ended.

   Built on the first biosoc:page naming this section, and only then —
   same contract as every other section-scoped script here. The loop
   stops when the page closes. With prefers-reduced-motion the finished
   picture is drawn at once and there is no animation (and no Replay).

   The modules are fixed (CODES below); making them the student's own
   picks is a separate piece of work.
   ============================================================= */
(function () {
  "use strict";

  var ID = "sand-visualiser";
  var root = document.getElementById("sand-viz");
  var D = window.BIOSOC_ASSESS, CUR = window.BIOSOC_CURRICULUM;
  if (!root || !D) { return; }

  var CODES = ["BS2200", "BS2009", "BS2059", "BS2093"];
  var DAY = 864e5, LEAD = 21, N = (D.weeks || 11) * 7;
  var W = 1440, H = 345, BASE = 266, PLOT_H = 230;      // logical canvas size, baseline, tallest pile
  var X0 = 10, X1 = W - 10;
  var SWEEP_MS = 5500, RAMP = 170, STRIP = 3;
  var DPR = Math.min(2, window.devicePixelRatio || 1);

  function ms(s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  var S0 = ms(D.start);
  function dayIndex(iso) { return Math.round((ms(iso) - S0) / DAY); }
  function weightOf(e) { var m = /(\d+)%/.exec(e.weight || ""); return m ? +m[1] : 15; }
  function isBig(e) {
    return (/report|essay|summary|portfolio|presentation|article|project/i.test(e.title) && !/tutorial/i.test(e.kind || "")) ||
      /^(2|3|4|5|6)\d%/.test(e.weight || "");
  }
  function colourOf(code) { return typeof window.BIOSOC_SWATCH === "function" ? window.BIOSOC_SWATCH(code) : "#bfbfbf"; }
  function rgb(hex) { return [1, 3, 5].map(function (i) { return parseInt(hex.substr(i, 2), 16); }); }
  function titleOf(code) {
    var m = CUR && CUR.modules.filter(function (x) { return x.code === code; })[0];
    return m ? m.title : "";
  }

  /* the assessments drawn: Year 2/3, the "big" ones, MCQ tests left out, inside the term */
  var EVENTS = D.events.filter(function (e) {
    return CODES.indexOf(e.mod) !== -1 && e.year >= 2 && isBig(e) && !/mcq/i.test(e.title) &&
      dayIndex(e.date) >= 0 && dayIndex(e.date) < N;
  }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });

  var by = CODES.map(function (code) {
    var r = []; for (var d = 0; d < N; d++) { r.push(0); }
    EVENTS.forEach(function (e) {
      if (e.mod !== code) { return; }
      var i = dayIndex(e.date);
      for (var d2 = Math.max(0, i - LEAD); d2 < i; d2++) { r[d2] += weightOf(e) / LEAD; }
    });
    return r;
  });
  var total = []; for (var d = 0; d < N; d++) { total.push(by.reduce(function (n, r) { return n + r[d]; }, 0)); }
  var peak = Math.max.apply(null, total);
  var SC = peak > 0 ? PLOT_H / peak : 0;
  var cum = CODES.map(function (c, k) {
    return total.map(function (_, d) { var s = 0; for (var q = 0; q <= k; q++) { s += by[q][d]; } return s * SC; });
  });

  /* ---------- the page's own markup ---------- */
  var weekdayDate = function (iso) {
    return new Date(ms(iso)).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  };
  root.innerHTML =
    '<div class="sv__legend">' + CODES.map(function (c) {
      return '<span class="sv__key"><i style="background:' + colourOf(c) + '"></i><b>' + c + '</b> ' + titleOf(c) + '</span>';
    }).join("") + '</div>' +
    '<div class="sv__wrap"><canvas class="sv__canvas" role="img" aria-label="Fine sand piled up over the term, one colour per module (' + CODES.join(", ") +
      '): the pile builds from week 3, peaks in weeks 6 to 8 and is gone after week 9. The deadlines are listed below the picture."></canvas></div>' +
    '<div class="sv__bar"><button type="button" class="sv__replay">Replay</button><span class="sv__status"></span></div>' +
    '<h2 class="sv__h">Deadlines in the picture</h2>' +
    '<ul class="sv__list">' + EVENTS.map(function (e) {
      return '<li><i style="background:' + colourOf(e.mod) + '"></i><b>' + e.mod + '</b> ' + e.title.replace(e.mod, "").trim() +
        ' <span>' + weekdayDate(e.date) + (e.weight ? " · " + e.weight : "") + '</span></li>';
    }).join("") + '</ul>' +
    '<p class="sv__note"><strong>Approximate.</strong> ' + (D.approxNote || "") + ' Each assessment is shown as its weighting spread evenly over the 21 days before it ' +
      '(15% where none is stated), so a taller pile means more weighting building up at once. The 21 days is our assumption, not the School\'s, and is the same for a small task as for a big one. MCQ tests are left out.</p>';

  var canvas = root.querySelector(".sv__canvas"), g = canvas.getContext("2d");
  var statusEl = root.querySelector(".sv__status"), replayBtn = root.querySelector(".sv__replay");
  canvas.width = W * DPR; canvas.height = H * DPR;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  var built = false, building = false, raf = 0, running = false;
  var layers = [], pile = null, bg = null, tNow = 0, lastTs = 0, fall = [];
  var seed = 11;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

  function XS(day) { return X0 + day / N * (X1 - X0); }
  function Hc(k, x) {
    if (k < 0) { return 0; }
    var f = (x - X0) / (X1 - X0) * N - 0.5, i = Math.floor(f), t = f - i;
    var a = cum[k][Math.max(0, Math.min(N - 1, i))], c = cum[k][Math.max(0, Math.min(N - 1, i + 1))];
    return a + (c - a) * (t * t * (3 - 2 * t));
  }
  function topH(x) { return Hc(CODES.length - 1, x); }
  function smooth(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }
  function fillAt(x, head) { return smooth((head - x) / RAMP); }

  function mkCanvas() {
    var c = document.createElement("canvas"); c.width = W * DPR; c.height = H * DPR;
    var x = c.getContext("2d"); x.scale(DPR, DPR); return [c, x];
  }
  function tokens() {
    var cs = getComputedStyle(document.documentElement);
    return { fg: cs.getPropertyValue("--fg").trim() || "#e8f3ec", soft: cs.getPropertyValue("--fg-soft").trim() || "#8fa89b",
             line: cs.getPropertyValue("--line").trim() || "#3b5448", faint: cs.getPropertyValue("--line-soft").trim() || "#1c2e25" };
  }
  var todayIdx = (function () {
    var n = new Date(); return Math.floor((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - S0) / DAY);
  })();

  function drawBackground() {
    var tk = tokens(), pair = mkCanvas(), c = pair[0], x = pair[1];
    x.lineWidth = 1; x.font = "10px system-ui, sans-serif";
    for (var k = 0; k <= D.weeks; k++) {
      x.strokeStyle = tk.faint; x.beginPath(); x.moveTo(XS(k * 7), 4); x.lineTo(XS(k * 7), BASE); x.stroke();
      if (k < D.weeks) { x.fillStyle = tk.soft; x.fillText("W" + (k + 1), XS(k * 7) + 3, BASE + 14); }
    }
    x.strokeStyle = tk.line; x.beginPath(); x.moveTo(X0, BASE); x.lineTo(X1, BASE); x.stroke();
    if (todayIdx >= 0 && todayIdx < N) {
      x.strokeStyle = "#ff6b5e"; x.setLineDash([4, 3]); x.beginPath(); x.moveTo(XS(todayIdx), 4); x.lineTo(XS(todayIdx), BASE); x.stroke(); x.setLineDash([]);
      x.fillStyle = "#ff6b5e"; x.fillText("today", XS(todayIdx) + 4, BASE + 28);
    }
    bg = c;
  }

  /* one hidden canvas per module, drawn once; built a layer per timer tick so the page never freezes */
  function drawLayer(k) {
    var pair = mkCanvas(), c = pair[0], x = pair[1], col = rgb(colourOf(CODES[k]));
    for (var xx = X0; xx < X1; xx += 0.7) {
      var lo = Hc(k - 1, xx), hi = Hc(k, xx);
      if (hi - lo < 0.3) { continue; }
      var dim = (todayIdx > 0 && Math.floor((xx - X0) / (X1 - X0) * N) < todayIdx) ? 0.45 : 1;
      for (var y = Math.max(0, lo - 2); y < hi + 1.2; y += 1.15) {
        var yy = y + (rnd() - 0.5) * 4;
        if (yy < lo - 1 || yy > hi + 1) { continue; }
        if (y > hi && rnd() > 0.35) { continue; }
        var sh = 0.82 + rnd() * 0.3, r = 0.55 + rnd() * 0.5;
        x.fillStyle = "rgba(" + Math.min(255, col[0] * sh | 0) + "," + Math.min(255, col[1] * sh | 0) + "," + Math.min(255, col[2] * sh | 0) + "," + dim + ")";
        x.beginPath(); x.arc(xx + (rnd() - 0.5) * 0.8, BASE - y - r + (rnd() - 0.5) * 0.6, r, 0, 6.283); x.fill();
      }
    }
    return { cn: c, col: col };
  }
  function build(done) {
    if (built || building) { return; }
    building = true; seed = 11; layers = [];
    statusEl.textContent = "Preparing the sand…";
    drawBackground();
    var k = 0;
    (function next() {
      if (k < CODES.length) { layers.push(drawLayer(k)); k++; window.setTimeout(next, 0); return; }
      var pair = mkCanvas(); pile = pair[0];
      layers.forEach(function (L) { pair[1].drawImage(L.cn, 0, 0, W, H); });
      built = true; building = false; statusEl.textContent = ""; done();
    })();
  }

  function paint(t) {
    var head = X0 + (X1 + RAMP - X0) * Math.min(1, t / SWEEP_MS), pouring = t < SWEEP_MS;
    var tk = tokens();
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, canvas.width, canvas.height); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.drawImage(bg, 0, 0, W, H);
    for (var x = X0; x < X1; x += STRIP) {
      var f = fillAt(x, head); if (f <= 0) { continue; }
      var h = topH(x + STRIP / 2) * f; if (h < 0.2) { continue; }
      var y0 = BASE - h - 3, hh = h + 4;
      g.drawImage(pile, x * DPR, y0 * DPR, STRIP * DPR, hh * DPR, x, y0, STRIP, hh);
    }
    if (pouring) {
      for (var i = 0; i < 80; i++) {
        var gx = head + (Math.random() + Math.random() + Math.random() - 1.5) * 26;
        if (gx < X0 || gx > X1 || topH(gx) < 0.5) { continue; }
        var k = Math.min(CODES.length - 1, Math.floor(Math.random() * CODES.length));
        if (Hc(k, gx) - Hc(k - 1, gx) < 0.3) { continue; }
        fall.push({ x: gx, y: 12, vy: 2 + Math.random() * 3, c: layers[k].col });
      }
    }
    for (var j = fall.length - 1; j >= 0; j--) {
      var p = fall[j]; p.vy += 0.8; p.y += p.vy;
      if (p.y >= BASE - topH(p.x) * fillAt(p.x, head) - 1) { fall.splice(j, 1); continue; }
      g.fillStyle = "rgb(" + (p.c[0] | 0) + "," + (p.c[1] | 0) + "," + (p.c[2] | 0) + ")"; g.fillRect(p.x, p.y, 1.4, 1.8);
    }
    /* the deadline markers drop in as the pouring point passes each date */
    g.font = "bold 8px system-ui, sans-serif"; g.textAlign = "center";
    EVENTS.forEach(function (e) {
      var mx = XS(dayIndex(e.date)); if (mx > head) { return; }
      g.strokeStyle = "#ff4d4d"; g.fillStyle = "#ff4d4d"; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(mx, BASE - 6); g.lineTo(mx, BASE + 40); g.stroke();
      g.beginPath(); g.arc(mx, BASE + 40, 3.2, 0, 6.283); g.fill(); g.fillText(e.mod, mx, BASE + 53); g.lineWidth = 1;
    });
    var wk = Math.min(D.weeks, Math.max(1, Math.floor((head - X0) / (X1 - X0) * N / 7) + 1));
    g.fillStyle = tk.fg; g.font = "bold 13px system-ui, sans-serif"; g.textAlign = "left";
    g.fillText(pouring ? "Week " + wk : "Term complete", 16, 24);
    return pouring;
  }

  function loop(ts) {
    if (!running) { return; }
    var dt = lastTs ? Math.min(100, ts - lastTs) : 16; lastTs = ts; tNow += dt;
    var more = paint(tNow);
    if (more) { raf = window.requestAnimationFrame(loop); } else { running = false; fall = []; }
  }
  function play() {
    stop(); if (!built) { return; }
    if (peak <= 0) { return; }
    if (reduce && reduce.matches) { paint(SWEEP_MS + 1); return; }
    tNow = 0; lastTs = 0; fall = []; running = true; raf = window.requestAnimationFrame(loop);
  }
  function stop() { running = false; if (raf) { window.cancelAnimationFrame(raf); raf = 0; } }
  function showFinal() { if (built) { paint(SWEEP_MS + 1); } }

  replayBtn.addEventListener("click", play);
  if (reduce && reduce.matches) { replayBtn.hidden = true; }

  /* the picture's axes use the theme's colours: redraw them if the theme changes */
  function onTheme() { if (!built) { return; } drawBackground(); if (!running) { showFinal(); } }
  new MutationObserver(onTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) { mq.addEventListener("change", onTheme); }
  }

  document.addEventListener("biosoc:page", function (event) {
    if (event.detail.id !== ID) { stop(); return; }
    if (peak <= 0) { statusEl.textContent = "No deadlines to show."; return; }
    if (built) { play(); } else { build(play); }
  });
})();
