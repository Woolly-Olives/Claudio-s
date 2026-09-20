/* =============================================================
   BioSoc Student Hub — radial menu + circular page reveals.

   Each section is one slice of the wheel. Clicking a slice sets
   the URL hash; the matching <section class="page"> is revealed
   by a circle that grows from that slice's outer tip, so the
   bubble always radiates at the slice's own angle.

   Essential Links is the exception: it carries reveal: "zoom", and
   opens by zooming into its own slice instead. The arc on that page
   is the same slice made huge, so assets/js/arc.js is handed the
   wheel's measurements and works the rest out (see wheelDisc below).

   To add, remove or rename a section:
     1. edit SECTIONS below,
     2. add/edit the matching <section class="page"> in index.html
        (id must be "page-" + the section id).
   The wheel re-divides itself evenly however many sections there are.
   ============================================================= */
(function () {
  "use strict";

  /*
   * `light` is each slice's lightness, and it is not a free choice. A
   * green at the same lightness as a blue is far brighter, so slices
   * picked by eye come out uneven and the labels stop reading on some
   * of them. These values were solved for instead: at 92% saturation
   * every slice lands within a hair of the same luminance (0.418 to
   * 0.421), which is bright enough to be cheerful and puts the dark
   * label ink at 8:1 on all seven. Change a hue and the lightness
   * beside it has to be re-solved, not guessed.
   */
  var SECTIONS = [
    { id: "essential-links",        label: "Essential Links",       hue: 140, light: 40.8, reveal: "zoom" },
    { id: "study-resources",        label: "Study Resources",       hue: 166, light: 40.0 },
    { id: "customise-your-degree",  label: "Customise Your Degree", hue: 192, light: 47.5 },
    { id: "opportunities",          label: "Opportunities",         hue: 218, light: 74.6 },
    { id: "connect",                label: "Connect",               hue: 254, light: 80.5 },
    { id: "events",                 label: "Events",                hue: 288, light: 76.3 },
    { id: "join-biosoc",            label: "Join BioSoc",           hue: 330, light: 75.8 }
  ];

  /* --- wheel geometry, in the SVG's 100x100 user units --- */
  var CENTRE   = 50;
  var R_OUTER  = 48;
  var R_INNER  = 19.5;
  var R_LABEL  = 34.2;
  var GAP_DEG  = 0;     // slices meet: a gap held at a constant ANGLE grows
                        // with the radius, so it is invisible at the hub and
                        // a wedge at the rim. The strokes do the dividing.
  var PUSH     = 1.7;   // how far a slice nudges outward on hover
  var START    = -90;   // first slice is centred at 12 o'clock
  var NS       = "http://www.w3.org/2000/svg";

  var svg     = document.getElementById("wheel-svg");
  var wheel   = document.getElementById("wheel");
  var labelsEl = document.getElementById("wheel-labels");
  var stage   = document.getElementById("stage");
  if (!svg || !wheel || !labelsEl) { return; }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var step = 360 / SECTIONS.length;
  var slices = {};     // id -> { link, path, label, mid }
  var openId = null;
  var hideTimer = null;
  var pushedHistory = false;

  /* ---------- geometry helpers ---------- */

  function polar(radius, deg) {
    var rad = deg * Math.PI / 180;
    return { x: CENTRE + radius * Math.cos(rad), y: CENTRE + radius * Math.sin(rad) };
  }

  /** Path for one annulus sector (a "pizza slice" with the middle removed). */
  function sectorPath(startDeg, endDeg) {
    var o1 = polar(R_OUTER, startDeg);
    var o2 = polar(R_OUTER, endDeg);
    var i1 = polar(R_INNER, startDeg);
    var i2 = polar(R_INNER, endDeg);
    var large = (endDeg - startDeg) > 180 ? 1 : 0;
    return [
      "M", i1.x, i1.y,
      "L", o1.x, o1.y,
      "A", R_OUTER, R_OUTER, 0, large, 1, o2.x, o2.y,
      "L", i2.x, i2.y,
      "A", R_INNER, R_INNER, 0, large, 0, i1.x, i1.y,
      "Z"
    ].join(" ");
  }

  /** Where the reveal bubble is born: the slice's outer tip, in viewport px. */
  function originFor(id) {
    var mid = slices[id].mid;
    var tip = polar(R_OUTER, mid);
    var box = svg.getBoundingClientRect();
    return {
      x: box.left + (tip.x / 100) * box.width,
      y: box.top + (tip.y / 100) * box.height
    };
  }

  /**
   * The wheel as a circle in viewport pixels, for the zooming section.
   * Measured before the stage shrinks behind the open page, which is
   * how openPage calls it.
   */
  function wheelDisc() {
    var box = svg.getBoundingClientRect();
    return {
      cx: box.left + box.width / 2,
      cy: box.top + box.height / 2,
      r: (box.width / 100) * R_OUTER
    };
  }

  /** Radius needed for a circle at (x, y) to cover the whole viewport. */
  function coveringRadius(x, y) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    return Math.ceil(Math.max(
      Math.hypot(x, y),
      Math.hypot(w - x, y),
      Math.hypot(x, h - y),
      Math.hypot(w - x, h - y)
    )) + 2;
  }

  /* ---------- build the wheel ---------- */

  SECTIONS.forEach(function (section, i) {
    var mid   = START + i * step;
    var start = mid - step / 2 + GAP_DEG / 2;
    var end   = mid + step / 2 - GAP_DEG / 2;
    var rad   = mid * Math.PI / 180;
    var dx    = Math.cos(rad);
    var dy    = Math.sin(rad);

    var link = document.createElementNS(NS, "a");
    link.setAttribute("href", "#" + section.id);
    link.setAttribute("class", "slice");
    link.setAttribute("aria-label", section.label);
    link.style.setProperty("--hue", section.hue);
    link.style.setProperty("--sl", section.light + "%");
    link.style.setProperty("--push-x", (dx * PUSH).toFixed(3) + "px");
    link.style.setProperty("--push-y", (dy * PUSH).toFixed(3) + "px");

    var path = document.createElementNS(NS, "path");
    path.setAttribute("class", "slice__path");
    path.setAttribute("d", sectorPath(start, end));
    link.appendChild(path);
    svg.appendChild(link);

    var pos = polar(R_LABEL, mid);
    var label = document.createElement("div");
    label.className = "slice-label";
    label.textContent = section.label;
    label.style.setProperty("--hue", section.hue);
    label.style.setProperty("--sl", section.light + "%");
    label.style.setProperty("--x", pos.x + "%");
    label.style.setProperty("--y", pos.y + "%");
    labelsEl.appendChild(label);

    slices[section.id] = {
      link: link, path: path, label: label,
      mid: mid, dx: dx, dy: dy, reveal: section.reveal
    };

    link.addEventListener("mouseenter", function () { label.classList.add("is-hot"); });
    link.addEventListener("mouseleave", function () { label.classList.remove("is-hot"); });
    link.addEventListener("click", function () { pushedHistory = true; });
    link.addEventListener("keydown", onSliceKey);
  });

  /** Label nudge is in px, so it tracks the wheel at any size. */
  function sizeLabelPush() {
    var px = wheel.getBoundingClientRect().width / 100 * PUSH;
    SECTIONS.forEach(function (section) {
      var s = slices[section.id];
      s.label.style.setProperty("--push-lx", (s.dx * px).toFixed(2) + "px");
      s.label.style.setProperty("--push-ly", (s.dy * px).toFixed(2) + "px");
    });
  }
  sizeLabelPush();
  if (window.ResizeObserver) { new ResizeObserver(sizeLabelPush).observe(wheel); }
  else { window.addEventListener("resize", sizeLabelPush); }

  /* ---------- keyboard: walk round the wheel ---------- */

  function onSliceKey(event) {
    var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    var move = keys[event.key];
    if (!move) { return; }
    event.preventDefault();
    var index = SECTIONS.findIndex(function (s) { return slices[s.id].link === event.currentTarget; });
    var next = (index + move + SECTIONS.length) % SECTIONS.length;
    slices[SECTIONS[next].id].link.focus();
  }

  /* ---------- opening and closing a page ---------- */

  function panelFor(id) { return document.getElementById("page-" + id); }

  function openPage(id, animate) {
    var panel = panelFor(id);
    if (!panel) { return; }
    if (openId && openId !== id) { hidePage(openId, false); }

    var slice = slices[id];
    var origin = originFor(id);
    panel.style.setProperty("--ox", Math.round(origin.x) + "px");
    panel.style.setProperty("--oy", Math.round(origin.y) + "px");
    panel.style.setProperty("--r", coveringRadius(origin.x, origin.y) + "px");

    /* a zooming section starts life laid over its own slice */
    if (slice && slice.reveal === "zoom" && window.BIOSOC_ARC) {
      window.BIOSOC_ARC.zoomFrom(wheelDisc());
    }

    window.clearTimeout(hideTimer);
    panel.removeAttribute("inert");

    /*
     * Taking inert off the panel also clears it from anything inside
     * that declared its own — Chromium recomputes the subtree and does
     * not put a descendant's back. Setting the attribute again does
     * take, so re-assert it. Without this the covered Opportunities
     * tiles are tabbable straight through their veil.
     */
    Array.prototype.forEach.call(panel.querySelectorAll("[inert]"), function (el) {
      el.removeAttribute("inert");
      el.setAttribute("inert", "");
    });

    panel.classList.add("is-mounted");
    if (slice) {
      slice.link.classList.add("is-active");
      slice.label.classList.add("is-active");
    }

    if (animate && !reduceMotion.matches) {
      panel.classList.remove("is-instant");
      void panel.offsetWidth;                 // commit the collapsed state first
      requestAnimationFrame(function () { panel.classList.add("is-open"); });
    } else {
      // deep link or reduced motion: no bubble to wait for, so no staged fade
      panel.classList.add("is-open", "is-settled", "is-instant");
    }

    document.body.classList.add("is-page-open");
    if (stage) { stage.setAttribute("inert", ""); }
    openId = id;

    /* a section's own script can wait for this rather than doing work,
       or fetching from anywhere, before anyone has asked to see it */
    document.dispatchEvent(new CustomEvent("biosoc:page", { detail: { id: id } }));

    var title = panel.querySelector(".page__title");
    if (title) { title.focus({ preventScroll: true }); }
  }

  function hidePage(id, animate) {
    var panel = panelFor(id);
    if (!panel) { return; }
    var slice = slices[id];

    if (slice) {
      slice.link.classList.remove("is-active");
      slice.label.classList.remove("is-active");
    }

    if (animate && !reduceMotion.matches) {
      var origin = originFor(id);             // re-measure: the viewport may have changed
      panel.style.setProperty("--ox", Math.round(origin.x) + "px");
      panel.style.setProperty("--oy", Math.round(origin.y) + "px");
      panel.classList.remove("is-settled");
      void panel.offsetWidth;
      panel.classList.remove("is-open");
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function () { settleClosed(panel); }, 900);
    } else {
      panel.classList.remove("is-open", "is-settled");
      settleClosed(panel);
    }

    panel.setAttribute("inert", "");
    panel.querySelector(".page__scroll").scrollTop = 0;
  }

  function settleClosed(panel) {
    panel.classList.remove("is-mounted", "is-instant");
  }

  function closeAll(animate) {
    if (openId) { hidePage(openId, animate); }
    var wasOpen = openId;
    openId = null;
    document.body.classList.remove("is-page-open");
    if (stage) { stage.removeAttribute("inert"); }

    /* the counterpart of the event openPage fires: a section's own
       script can stop whatever it started once nobody is looking */
    document.dispatchEvent(new CustomEvent("biosoc:page", { detail: { id: null } }));

    if (wasOpen && slices[wasOpen]) { slices[wasOpen].link.focus({ preventScroll: true }); }
  }

  /* settle as soon as the collapse finishes, rather than waiting out the timer */
  document.addEventListener("transitionend", function (event) {
    if (event.propertyName !== "clip-path") { return; }
    var panel = event.target;
    if (panel.classList && panel.classList.contains("page")) {
      if (panel.classList.contains("is-open")) { panel.classList.add("is-settled"); }
      else { window.clearTimeout(hideTimer); settleClosed(panel); }
    }
  });

  /* ---------- routing ---------- */

  function currentHashId() {
    var id = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    return slices[id] ? id : null;
  }

  function route(animate) {
    var id = currentHashId();
    if (id === openId) { return; }
    if (id) { openPage(id, animate); }
    else { closeAll(animate); }
  }

  window.addEventListener("hashchange", function () { route(true); });

  /*
   * hashchange only fires when a history entry differs from the last purely by
   * fragment. If a section ever writes a query string of its own, back-
   * navigation changes both parts, the browser fires popstate instead, and the
   * panel would never close. route() ignores a no-op, so listening for both
   * costs nothing and keeps that case working.
   */
  window.addEventListener("popstate", function () { route(true); });

  document.addEventListener("click", function (event) {
    var back = event.target.closest("[data-back]");
    if (!back) { return; }
    event.preventDefault();
    goToMenu();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && openId) {
      event.preventDefault();
      goToMenu();
    }
  });

  /** Back to the wheel, without leaving a trail of hashes in history. */
  function goToMenu() {
    if (pushedHistory) {
      pushedHistory = false;
      history.back();                          // hashchange does the rest
    } else {
      history.replaceState(null, "", location.pathname + location.search);
      route(true);
    }
  }

  /* a deep link lands on its page already open — nothing to animate from yet */
  route(false);
})();
