/* =============================================================
   Mini calendar — zoom to full screen (assets/js/minizoom.js).

   Pressing the little expand button above the mini calendar, or
   clicking anywhere on it that is not an event day (those keep their
   own box), zooms the calendar itself up — a plain scale, so the
   squares keep their shape and the calendar keeps its proportions —
   until its width fills the window, centred on THIS WEEK (today's row
   goes to the top, under a Mon-Sun header). As it grows, each day gets
   its date and its event names. At the end every week that does not
   fully fit on screen is hidden, so what is left is the current week
   and as many whole weeks after it as there is room for.

   Once it is open the calendar can be grabbed and dragged up and down
   (mouse, finger or pen; the wheel and the arrow / Page keys too). It
   then holds PRE months before and POST months after the mini calendar's
   four (built with the same markup by minical.js), and every week is
   shown, not only the ones that fitted. They are hidden again, and the
   position reset, when it closes.

   Closing (the button, Escape, or a click on the empty space) plays
   the zoom backwards. With reduced motion it simply appears and goes.
   The overlay is a dialog: focus goes to its close button and stays
   there, and goes back to the expand button when it closes.

   The copy is made from the mini calendar's own markup (already built
   by minical.js from assets/data/events.js), laid out at its final size
   and scaled DOWN to the mini calendar's place for the start, so the
   text is sharp at the end. Nothing is fetched and nothing runs on a
   timer; it reads the DOM once per opening.
   ============================================================= */
(function () {
  "use strict";

  var root = document.getElementById("minical");
  var mc = root && root.querySelector(".mc");
  if (!mc) { return; }

  var MARGIN = 40, TOP = 44, BOTTOM = 40, OPEN_MS = 900, CLOSE_MS = 650, PRE = 2, POST = 6;
  var state = null;            // the open overlay, or null

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "mc__open";
  btn.setAttribute("aria-label", "Open the calendar full screen");
  btn.setAttribute("aria-haspopup", "dialog");
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';
  root.appendChild(btn);

  function reduced() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(x) { return Math.max(0, Math.min(1, x)); }
  function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }

  /* ---------- build the copy ---------- */

  function build() {
    var ov = document.createElement("div");
    ov.className = "mz";
    ov.setAttribute("role", "dialog");
    ov.setAttribute("aria-modal", "true");
    ov.setAttribute("aria-label", "Calendar: this week and the weeks after it. Drag, or use the arrow keys, to move through the months");

    var bg = document.createElement("div"); bg.className = "mz__bg"; ov.appendChild(bg);
    var cal = document.createElement("div"); cal.className = "mz__cal"; ov.appendChild(cal);
    var clone = document.createElement("div"); clone.className = "mc"; cal.appendChild(clone);

    var cells = [], isExtra = [];                     // everything that can be hidden: days, gaps, month names; isExtra = from a month beyond the mini calendar's four
    var secs = [], api = window.BIOSOC_MINICAL;
    function pull(from, to) {
      if (!api) { return; }
      for (var o = from; o <= to; o++) { var t = document.createElement("div"); t.innerHTML = api.month(o); secs.push({ sec: t.firstChild, extra: true }); }
    }
    pull(-PRE, -1);
    [].forEach.call(mc.querySelectorAll(".mc__month"), function (sec) { secs.push({ sec: sec, extra: false }); });
    pull(4, 3 + POST);
    secs.forEach(function (it) {
      var sec = it.sec;
      function add(el) { cells.push(el); isExtra.push(it.extra); }
      var copy = document.createElement("section"); copy.className = "mc__month";
      var name = sec.querySelector(".mc__name").cloneNode(true); copy.appendChild(name); add(name);
      var grid = document.createElement("div"); grid.className = "mc__grid"; copy.appendChild(grid);
      var n = 0;
      [].forEach.call(sec.querySelector(".mc__grid").children, function (el) {
        var c = document.createElement("span");
        c.className = el.className;
        if (!el.classList.contains("mc__gap")) {
          n++;
          var label = el.getAttribute("aria-label") || "";
          var titles = label.indexOf(": ") !== -1 ? label.split(": ").slice(1).join(": ").split("; ") : [];
          var num = document.createElement("span"); num.className = "mz__n"; num.textContent = n; c.appendChild(num);
          if (titles.length) {
            var t = document.createElement("span"); t.className = "mz__t"; t.textContent = titles.join(" · "); c.appendChild(t);
          }
        }
        grid.appendChild(c); add(c);
      });
      clone.appendChild(copy);
    });

    var head = document.createElement("div"); head.className = "mz__head";
    head.innerHTML = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(function (d) { return "<span>" + d + "</span>"; }).join("");
    ov.appendChild(head);

    var close = document.createElement("button");
    close.type = "button"; close.className = "mz__close"; close.setAttribute("aria-label", "Close the calendar");
    close.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    ov.appendChild(close);

    document.body.appendChild(ov);
    return { ov: ov, bg: bg, cal: cal, clone: clone, cells: cells, isExtra: isExtra, head: head, close: close, dy: 0, free: false };
  }

  /* where everything goes at the end, for the window's size now */
  function measure(s) {
    var W = window.innerWidth, H = window.innerHeight;
    var r0 = mc.getBoundingClientRect();
    s.clone.style.setProperty("--s", ((W - 2 * MARGIN) / 8.08) + "px");      // 7 days + 6 gaps = 8.08 squares across
    s.clone.style.setProperty("--g", "calc(var(--s) * 0.18)");              // minical.css defines this on .minical, which the copy is not inside
    s.cal.style.transform = "none"; s.cal.style.left = "0"; s.cal.style.top = "0";
    var cw = s.clone.getBoundingClientRect();
    var today = s.clone.querySelector(".is-today") || s.clone.querySelector(".mc__day");
    var tr = today.getBoundingClientRect();
    s.k0 = r0.width / cw.width;
    s.P = { x: cw.width / 2, y: tr.top + tr.height / 2 };
    s.P0 = { x: r0.left + s.k0 * s.P.x, y: r0.top + s.k0 * s.P.y };          // where that point is on the page now
    s.P1 = { x: MARGIN + s.P.x, y: TOP + (s.P.y - tr.top) };                  // and where it ends up: this week's row at the top
    var dy = TOP - tr.top, ty0 = s.P1.y - s.P.y;
    s.maxDy = TOP - (cw.top + ty0);                                           // how far it may be dragged down: the first month's name at the top
    s.minDy = (H - BOTTOM) - (cw.bottom + ty0);                               // and up: the last row at the bottom
    s.step = tr.height * 1.18;                                                // one row, for the arrow keys
    s.dy = Math.max(s.minDy, Math.min(s.maxDy, s.dy));
    s.fit = s.cells.map(function (el) {
      var q = el.getBoundingClientRect();
      return q.top + dy >= TOP - 1 && q.bottom + dy <= H - BOTTOM + 1;
    });
  }

  function paint(s, p) {
    var e = ease(p), k = Math.pow(s.k0, 1 - e);
    var tx = lerp(s.P0.x, s.P1.x, e) - k * s.P.x, ty = lerp(s.P0.y, s.P1.y, e) - k * s.P.y;
    s.cal.style.transform = "translate(" + tx + "px, " + (ty + s.dy * e) + "px) scale(" + k + ")";
    s.bg.style.opacity = e >= 0.92 ? 1 : clamp(e / 0.6) * 0.97;
    s.ov.style.setProperty("--zo", clamp((e - 0.6) / 0.3));
    var hide = clamp((e - 0.88) / 0.12);
    s.cells.forEach(function (el, i) {
      if (s.free) { el.style.opacity = ""; }                       // dragged: every week is shown
      else if (s.isExtra[i]) { el.style.opacity = "0"; }           // the extra months only exist for dragging
      else { el.style.opacity = s.fit[i] ? "" : String(1 - hide); }
    });
    s.head.style.opacity = clamp((e - 0.7) / 0.25);
    s.close.style.opacity = clamp((e - 0.7) / 0.25);
  }

  function run(s, from, to, ms, done) {
    if (reduced() || ms === 0) { s.p = to; paint(s, to); if (done) { done(); } return; }
    var t0 = 0;
    function step(now) {
      if (!t0) { t0 = now; }
      var k = clamp((now - t0) / ms);
      s.p = lerp(from, to, k); paint(s, s.p);
      if (k < 1) { s.raf = requestAnimationFrame(step); } else { s.raf = 0; if (done) { done(); } }
    }
    s.raf = requestAnimationFrame(step);
  }

  /* ---------- open / close ---------- */

  function show() {
    if (state) { return; }
    var s = build(); state = s; s.p = 0; s.raf = 0;
    measure(s); paint(s, 0);
    root.style.visibility = "hidden";                  // the real one is under the copy
    s.ov.classList.add("is-open");
    s.close.focus({ preventScroll: true });
    run(s, 0, 1, OPEN_MS);
    s.close.addEventListener("click", hide);
    s.bg.addEventListener("click", function () { if (!s.dragged) { hide(); } });
    s.ov.addEventListener("pointerdown", function (e) { grab(s, e); });
    s.ov.addEventListener("wheel", function (e) { e.preventDefault(); nudge(s, -e.deltaY); }, { passive: false });
  }

  /* ---------- moving through the months ---------- */

  function nudge(s, by) {
    if (!s || s.closing || s.p < 1) { return; }
    s.free = true; s.ov.classList.add("is-free");
    s.dy = Math.max(s.minDy, Math.min(s.maxDy, s.dy + by));
    paint(s, 1);
  }

  /* a flick carries on and slows to a stop, so months far away are a few flicks, not a long drag */
  function fling(s, v) {
    var t0 = 0;
    function step(now) {
      if (!t0) { t0 = now; s.fling = requestAnimationFrame(step); return; }
      var dt = Math.min(48, now - t0); t0 = now;
      var before = s.dy;
      nudge(s, v * dt);
      v *= Math.pow(0.94, dt / 16);
      if (Math.abs(v) > 0.03 && s.dy !== before && !s.closing) { s.fling = requestAnimationFrame(step); } else { s.fling = 0; }
    }
    s.fling = requestAnimationFrame(step);
  }

  function grab(s, e) {
    if ((e.pointerType === "mouse" && e.button !== 0) || s.closing || s.p < 1 || e.target.closest(".mz__close")) { return; }
    var y0 = e.clientY, dy0 = s.dy, moved = false, id = e.pointerId, vy = 0, tPrev = e.timeStamp, yPrev = e.clientY;
    if (s.fling) { cancelAnimationFrame(s.fling); s.fling = 0; }
    function move(ev) {
      if (ev.pointerId !== id) { return; }
      var d = ev.clientY - y0;
      if (!moved) { if (Math.abs(d) < 5) { return; } moved = true; s.ov.classList.add("is-drag"); }
      var dt = Math.max(1, ev.timeStamp - tPrev);
      vy = 0.8 * vy + 0.2 * ((ev.clientY - yPrev) / dt);            // px per ms, smoothed
      tPrev = ev.timeStamp; yPrev = ev.clientY;
      nudge(s, dy0 + d - s.dy);
    }
    function up(ev) {
      if (ev.pointerId !== id) { return; }
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
      s.ov.classList.remove("is-drag");
      if (moved) { s.dragged = true; window.setTimeout(function () { s.dragged = false; }, 0); if (!reduced() && Math.abs(vy) > 0.3 && ev.timeStamp - tPrev < 80) { fling(s, vy); } }      // a drag that ends on the backdrop is not a click on it
    }
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
  }

  function hide() {
    var s = state;
    if (!s || s.closing) { return; }
    if (s.fling) { cancelAnimationFrame(s.fling); s.fling = 0; }
    s.closing = true; s.free = false; s.ov.classList.remove("is-free");
    if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; }
    run(s, s.p, 0, CLOSE_MS, function () {
      s.ov.remove(); root.style.visibility = ""; state = null;
      btn.focus({ preventScroll: true });
    });
  }

  btn.addEventListener("click", show);
  root.addEventListener("click", function (e) {
    if (e.target === btn || btn.contains(e.target) || e.target.closest(".mc__day--ev")) { return; }
    if (e.target.closest(".mc")) { show(); }
  });

  document.addEventListener("keydown", function (e) {
    if (!state) { return; }
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); hide(); }
    else if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "PageDown" || e.key === "PageUp" || e.key === "Home" || e.key === "End") {
      e.preventDefault();
      var s = state, dir = e.key === "ArrowDown" || e.key === "PageDown" || e.key === "End" ? -1 : 1;
      nudge(s, e.key === "Home" ? 1e6 : e.key === "End" ? -1e6 : dir * (e.key.indexOf("Page") === 0 ? window.innerHeight * 0.8 : s.step));
    }
    else if (e.key === "Tab") { e.preventDefault(); state.close.focus(); }          // the close button is the only stop
  }, true);

  var resizeTimer = 0;
  window.addEventListener("resize", function () {
    if (!state) { return; }
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (state && !state.closing) { measure(state); paint(state, state.p); }
    }, 100);
  });
})();
