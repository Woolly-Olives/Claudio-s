/* =============================================================
   Essential Links — the wheel's own slice, zoomed to fill the screen.

   The Essential Links slice of the menu wheel spans 360/7 degrees.
   Here that exact slice is scaled until the two ends of its outer edge
   sit on the left and right edges of the screen, low down, so the curve
   arches across the page with the wheel's own curvature — only far
   larger. The band below the curve is cut into one section per link,
   separated by plain radial dividers.

   The section is not revealed by the bubble the other pages use: it
   zooms. zoomFrom() is handed the wheel's disc by assets/js/app.js and
   works out the transform that lays this arc exactly over the wheel's
   Essential Links slice; the page then animates from there to nothing,
   which is a true zoom into the curve.

   Everything comes from assets/data/links.js. On small or short screens
   the arc is hidden and the plain list in index.html takes over.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_LINKS;
  var root = document.getElementById("links-arc");
  if (!root || !DATA) { return; }

  var SPAN     = 360 / 7;     // the wheel's slice angle, exactly
  var FLOOR    = 14;          // px kept clear below the band's lowest point
  var BAND_MIN = 168;         // a band thinner than this can't hold a label
  var BAND_MAX = 470;
  var NS       = "http://www.w3.org/2000/svg";

  var links = DATA.links;
  var N = links.length;
  /* was the hub's own hover note (links.js); moved here to be the arc's
     default resting text instead, at explicit instruction (2026-09-22) */
  var HINT = "Here are the most useful links for university in one place!";

  function rad(deg) { return deg * Math.PI / 180; }
  var HALF = rad(SPAN / 2);

  /** Slots from the middle outwards: 4, 3, 5, 2, 6 … for nine. */
  function centreOut(n) {
    var mid = Math.floor((n - 1) / 2), out = [mid], d = 1;
    while (out.length < n) {
      if (mid - d >= 0) { out.push(mid - d); }
      if (out.length < n && mid + d < n) { out.push(mid + d); }
      d++;
    }
    return out;
  }

  /* rank 1 takes the middle, and the rest fan out either side of it */
  var placed = [];
  var order = centreOut(N);
  links.slice().sort(function (a, b) { return a.rank - b.rank; })
    .forEach(function (link, i) { placed[order[i]] = link; });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  root.innerHTML =
    '<svg class="arc__svg" role="navigation" aria-label="Essential links">' +
      '<defs>' +
        '<radialGradient id="arc-ink" class="arc-grad" gradientUnits="userSpaceOnUse">' +
          '<stop class="arc-ink-stop arc-ink-stop--in" offset="0"></stop>' +
          '<stop class="arc-ink-stop arc-ink-stop--out" offset="1"></stop>' +
        '</radialGradient>' +
        '<radialGradient id="arc-wash" class="arc-grad" gradientUnits="userSpaceOnUse">' +
          '<stop class="arc-wash-stop arc-wash-stop--in" offset="0"></stop>' +
          '<stop class="arc-wash-stop arc-wash-stop--out" offset="1"></stop>' +
        '</radialGradient>' +
      '</defs>' +
      '<g class="arc__hits"></g>' +
      '<g class="arc__dividers" aria-hidden="true"></g>' +
      '<path class="arc__edge" aria-hidden="true"></path>' +
    '</svg>' +
    '<div class="arc__labels"></div>' +
    '<a class="arc__hub" href="' + esc(DATA.hub.href) + '">' +
      '<span class="arc__hub__name">' + esc(DATA.hub.name) + '</span>' +
    '</a>' +
    '<p class="arc__readout" role="status">' +
      '<span class="arc__readout__name"></span>' +
      '<span class="arc__readout__note">' + esc(HINT) + '</span>' +
    '</p>';

  var svg      = root.querySelector(".arc__svg");
  var hits     = root.querySelector(".arc__hits");
  var dividers = root.querySelector(".arc__dividers");
  var edge     = root.querySelector(".arc__edge");
  var labels   = root.querySelector(".arc__labels");
  var hub      = root.querySelector(".arc__hub");
  var inkIn    = root.querySelector(".arc-ink-stop--in");
  var washIn   = root.querySelector(".arc-wash-stop--in");
  var rName    = root.querySelector(".arc__readout__name");
  var rNote    = root.querySelector(".arc__readout__note");
  var grads    = root.querySelectorAll(".arc-grad");

  /** The curve's centre and outer radius, kept for the zoom maths. */
  var geo = { cx: 0, cy: 0, Ro: 0 };
  var segs = [];
  var hot = null;

  /** The Union's sub-links sit above their sector, so light it by hand. */
  function markHot(seg) {
    if (hot === seg) { return; }
    if (hot) { hot.classList.remove("is-hot"); }
    hot = seg || null;
    if (hot) { hot.classList.add("is-hot"); }
  }

  function say(name, note) {
    rName.textContent = name || "";
    rNote.textContent = note || "";
  }

  function draw() {
    var W = root.clientWidth;
    var H = root.clientHeight;
    if (!W || !H) { return; }

    /* the outer edge's two ends land exactly on the left and right
       edges of the screen, which fixes the radius outright */
    var Ro  = W / (2 * Math.sin(HALF));
    var sag = Ro * (1 - Math.cos(HALF));        // how far the apex rises above them

    /* …and they sit low: two thirds of the way down, unless the screen is
       too short to leave room above the curve or a band below it */
    var yEnd = Math.min(Math.max(H * 0.66, sag + 150),
                        H - FLOOR - BAND_MIN * Math.cos(HALF));
    var T    = Math.max(BAND_MIN,
                 Math.min(BAND_MAX, (H - FLOOR - yEnd) / Math.cos(HALF)));
    var Ri   = Ro - T;
    var apex = yEnd - sag;
    var cx   = W / 2;
    var cy   = yEnd + Ro * Math.cos(HALF);      // far below the screen
    var hubY = (cy - Ri + H) / 2;               // between the band and the bottom

    geo.cx = cx; geo.cy = cy; geo.Ro = Ro;

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    root.style.setProperty("--apex", apex.toFixed(1) + "px");
    hits.innerHTML = "";
    segs.length = 0;
    hot = null;
    dividers.innerHTML = "";
    labels.innerHTML = "";

    /* both paints run along the radius: strongest at the curve, gone by
       the inner edge, so the band needs no bottom line to close it */
    Array.prototype.forEach.call(grads, function (g) {
      g.setAttribute("cx", cx);
      g.setAttribute("cy", cy);
      g.setAttribute("r", Ro);
    });
    inkIn.setAttribute("offset", (Ri / Ro).toFixed(4));
    washIn.setAttribute("offset", (Ri / Ro).toFixed(4));

    function polar(r, deg) {
      return { x: cx + r * Math.cos(rad(deg)), y: cy + r * Math.sin(rad(deg)) };
    }

    var step  = SPAN / N;
    var first = -90 - SPAN / 2;
    var Rlab  = Ro - T * 0.46;
    var labW  = Math.max(104, 2 * Rlab * Math.sin(rad(step / 2)) * 0.88);

    var e1 = polar(Ro, first), e2 = polar(Ro, first + SPAN);
    edge.setAttribute("d", ["M", e1.x, e1.y, "A", Ro, Ro, 0, 0, 1, e2.x, e2.y].join(" "));

    var labelEls = [];

    placed.forEach(function (link, i) {
      var a0 = first + i * step;
      var a1 = a0 + step;
      var mid = (a0 + a1) / 2;
      /* 0 in the middle of the arc, 1 at its ends — used to stagger the
         dividers outwards as they come in, and to weight the labels */
      var k = Math.abs(i - (N - 1) / 2) / ((N - 1) / 2);

      var o1 = polar(Ro, a0), o2 = polar(Ro, a1);
      var i1 = polar(Ri, a0), i2 = polar(Ri, a1);

      /* the whole sector is the link: hit area first, so the lines and
         labels above it never intercept the click. A link with no `href`
         (a group heading, like "Research resources" — see the GROUPS
         note in links.js) gets no href attribute at all, which makes it
         not a real link (no navigation, out of tab order) — only its
         `more` list underneath is actually clickable. */
      var a = document.createElementNS(NS, "a");
      if (link.href) { a.setAttribute("href", link.href); }
      a.setAttribute("class", "seg" + (link.href ? "" : " seg--group"));
      a.setAttribute("aria-label", link.name);
      a.dataset.name = link.name;
      a.dataset.note = link.note || "";

      var path = document.createElementNS(NS, "path");
      path.setAttribute("class", "seg__path");
      path.setAttribute("d", [
        "M", i1.x, i1.y, "L", o1.x, o1.y,
        "A", Ro, Ro, 0, 0, 1, o2.x, o2.y,
        "L", i2.x, i2.y,
        "A", Ri, Ri, 0, 0, 0, i1.x, i1.y, "Z"
      ].join(" "));
      a.appendChild(path);
      hits.appendChild(a);
      segs.push(a);

      if (i > 0) {
        var line = document.createElementNS(NS, "line");
        line.setAttribute("class", "arc__divider");
        line.setAttribute("x1", i1.x); line.setAttribute("y1", i1.y);
        line.setAttribute("x2", o1.x); line.setAttribute("y2", o1.y);
        line.style.setProperty("--k", k.toFixed(3));
        dividers.appendChild(line);
      }

      var at = polar(Rlab, mid);
      var label = document.createElement("div");
      label.className = "seg-label" + (link.more ? " seg-label--more" : "");
      label.style.left = at.x + "px";
      label.style.top = at.y + "px";
      label.style.width = labW + "px";
      label.style.setProperty("--tilt", (mid + 90) + "deg");
      label.style.setProperty("--k", k.toFixed(3));
      /*
       * A logo replaces the numbered circle when the data gives one.
       * The number is still in the markup underneath, revealed if the
       * image never loads (wrong path, missing file) — the badge is
       * never just blank.
       */
      var badge = link.logo
        ? '<span class="seg-label__n seg-label__n--logo">' +
            '<img src="' + esc(link.logo) + '" alt="" ' +
              'onerror="this.closest(\'.seg-label__n\').classList.add(\'is-broken\')">' +
            '<b>' + link.n + '</b>' +
          '</span>'
        : '<span class="seg-label__n">' + link.n + '</span>';

      label.innerHTML =
        '<span class="seg-label__head" aria-hidden="true">' +
          badge +
          '<span class="seg-label__name">' + esc(link.name) + '</span>' +
        '</span>' +
        (link.more
          ? '<span class="seg-label__more">' + link.more.map(function (m) {
              return '<a href="' + esc(m.href) + '" data-seg="' + i +
                     '" data-name="' + esc(m.name) + '" data-note="' + esc(m.note || "") +
                     '">' + esc(m.name) + '</a>';
            }).join("") + '</span>'
          : "");
      labels.appendChild(label);
      labelEls.push({ el: label, link: link, mid: mid });
    });

    /* Every label sits centred (both ways) on the same radius, Rlab — but
       a segment with a `more` list, or just a longer name that wraps,
       is a taller box than one without, so its badge (always the first
       thing in it) lands further out from that shared centre than a
       short segment's does. There is no `more` count that makes them
       all match, so instead: measure where each badge actually ended up
       after real layout (text wrap and the `more` list both affect this,
       so it can't be worked out ahead of render — same reasoning as
       runIntro()'s levelPx in modulemap.js), then nudge every label's
       own anchor so its badge lands on Library's radius specifically, at
       explicit instruction (2026-09-22). offsetTop/offsetHeight are used
       rather than getBoundingClientRect() because they are pre-transform
       — the rotation each label carries never has to be un-done. */
    var targetD = null;
    labelEls.forEach(function (item) {
      var badge = item.el.querySelector(".seg-label__n");
      item.d = item.el.offsetHeight / 2 - (badge.offsetTop + badge.offsetHeight / 2);
      if (item.link.name === "Library") { targetD = item.d; }
    });
    if (targetD !== null) {
      labelEls.forEach(function (item) {
        var at2 = polar(Rlab + (targetD - item.d), item.mid);
        item.el.style.left = at2.x + "px";
        item.el.style.top = at2.y + "px";
      });
    }

    hub.style.left = cx + "px";
    hub.style.top = hubY + "px";
  }

  /* ---------- the zoom the page opens with ---------- */

  /**
   * Lay this arc over the wheel's Essential Links slice.
   * `disc` is the wheel as a circle in viewport pixels: { cx, cy, r },
   * r being the radius of the slices' outer edge. Scaling the arc about
   * its own centre of curvature until Ro matches that radius, then
   * moving that centre onto the wheel's centre, puts the curve exactly
   * on the slice's outer edge — both span the same angle about the same
   * point, so the page can simply animate back to no transform.
   */
  function zoomFrom(disc) {
    if (!disc || !geo.Ro || !root.clientWidth) { return; }
    /* measure through the offset parent: root itself carries the
       transform we are about to replace, so its own box is no use */
    var host = root.offsetParent;
    var box = host ? host.getBoundingClientRect() : { left: 0, top: 0 };
    var left = box.left + root.offsetLeft;
    var top = box.top + root.offsetTop;

    root.style.transformOrigin = geo.cx + "px " + geo.cy + "px";
    root.style.setProperty("--zoom-x", (disc.cx - (left + geo.cx)).toFixed(1) + "px");
    root.style.setProperty("--zoom-y", (disc.cy - (top + geo.cy)).toFixed(1) + "px");
    root.style.setProperty("--zoom-s", (disc.r / geo.Ro).toFixed(5));
    /* commit it now, while the panel is still unmounted and the
       transition switched off, so the page opens from here rather than
       animating towards here */
    void root.offsetWidth;
  }

  window.BIOSOC_ARC = { zoomFrom: zoomFrom, redraw: draw };

  /* ---------- the line above the curve ---------- */

  function target(node) { return node.closest(".seg, .seg-label__more a, .arc__hub"); }

  function reactTo(hit) {
    if (!hit) { rest(); return; }
    if (hit === hub) { markHot(null); say(DATA.hub.name, DATA.hub.note); return; }
    markHot(hit.dataset.seg ? segs[+hit.dataset.seg] : null);
    say(hit.dataset.name, hit.dataset.note);
  }

  function rest() { markHot(null); say("", HINT); }

  /* pointerover fires on the way out of a section too, so moving into the
     empty space around the band puts the hint back by itself */
  root.addEventListener("pointerover", function (event) { reactTo(target(event.target)); });
  root.addEventListener("pointerleave", rest);
  root.addEventListener("focusin", function (event) { reactTo(target(event.target)); });
  /* only when focus leaves the arc altogether: stepping from one section
     to the next must not blank the line in between */
  root.addEventListener("focusout", function (event) {
    if (!event.relatedTarget || !root.contains(event.relatedTarget)) { rest(); }
  });

  draw();
  if (window.ResizeObserver) { new ResizeObserver(draw).observe(root); }
  else { window.addEventListener("resize", draw); }
})();
