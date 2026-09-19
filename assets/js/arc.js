/* =============================================================
   Essential Links — the wheel's own slice, zoomed to fill the page.

   The Essential Links slice of the menu wheel spans 360/7 degrees and
   runs between two radii. Here that exact slice is scaled until its
   outer edge spans the width of the page, so the curvature is the
   wheel's, only much larger. It is then cut into one segment per link.

   The band is drawn shallower than a true zoom would make it: at full
   scale the slice would be about 0.68 of the page wide in depth, which
   on a laptop runs well past the fold and leaves nine very narrow
   slivers. The angle, the width and the curvature are exact; only the
   depth is trimmed.

   Everything comes from assets/data/links.js. Below about 820px the
   arc is hidden and the plain list in index.html takes over.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_LINKS;
  var root = document.getElementById("links-arc");
  if (!root || !DATA) { return; }

  var SPAN  = 360 / 7;        // the wheel's slice angle, exactly
  var RATIO = 19.5 / 48;      // the wheel's inner/outer radius ratio
  var GAP   = 0.5;            // degrees of air between segments
  var NS    = "http://www.w3.org/2000/svg";
  var links = DATA.links;
  var N = links.length;

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

  function rad(deg) { return deg * Math.PI / 180; }

  root.innerHTML =
    '<svg class="arc__svg" role="navigation" aria-label="Essential links"></svg>' +
    '<div class="arc__labels"></div>' +
    '<a class="arc__hub" href="' + esc(DATA.hub.href) + '">' +
      '<span class="arc__hub__name">' + esc(DATA.hub.name) + '</span>' +
    '</a>' +
    '<p class="arc__readout" role="status"></p>';

  var svg      = root.querySelector(".arc__svg");
  var labels   = root.querySelector(".arc__labels");
  var hub      = root.querySelector(".arc__hub");
  var readout  = root.querySelector(".arc__readout");

  function setReadout(text) { readout.textContent = text; }
  setReadout(DATA.hub.note);

  function draw() {
    var W = root.clientWidth;
    if (!W) { return; }

    var pad  = 10;
    var half = rad(SPAN / 2);
    var Ro   = (W - pad * 2) / (2 * Math.sin(half));       // outer edge spans the page
    var deep = Ro * (1 - RATIO);                            // depth of a true zoom
    var T    = Math.min(deep, Math.max(230, Math.min(W * 0.31, 440)));
    var Ri   = Ro - T;

    var cx = W / 2;
    var cy = pad + Ro;
    var bottom = cy - Ri * Math.cos(half);                  // the band's lowest point
    var hubY = pad + T + 54;
    var H = Math.max(bottom, hubY + 34) + 58;

    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    root.style.height = H + "px";
    svg.innerHTML = "";
    labels.innerHTML = "";

    function polar(r, deg) {
      return { x: cx + r * Math.cos(rad(deg)), y: cy + r * Math.sin(rad(deg)) };
    }

    var step  = SPAN / N;
    var first = -90 - SPAN / 2;
    var Rlab  = Ro - T * 0.46;
    var labW  = Math.max(96, 2 * Rlab * Math.sin(rad(step / 2)) * 0.84);

    placed.forEach(function (link, i) {
      var a0 = first + i * step + GAP / 2;
      var a1 = first + (i + 1) * step - GAP / 2;
      var mid = (a0 + a1) / 2;

      var o1 = polar(Ro, a0), o2 = polar(Ro, a1);
      var i1 = polar(Ri, a0), i2 = polar(Ri, a1);

      var a = document.createElementNS(NS, "a");
      a.setAttribute("href", link.href);
      a.setAttribute("class", "seg");
      a.setAttribute("aria-label", link.name);
      a.dataset.note = link.note;
      /* 0 in the middle of the arc, 1 at its edges — the middle carries the
         most-used links, so it is drawn a shade stronger */
      var k = Math.abs(i - (N - 1) / 2) / ((N - 1) / 2);
      a.style.setProperty("--k", k.toFixed(3));

      var path = document.createElementNS(NS, "path");
      path.setAttribute("class", "seg__path");
      path.setAttribute("d", [
        "M", i1.x, i1.y, "L", o1.x, o1.y,
        "A", Ro, Ro, 0, 0, 1, o2.x, o2.y,
        "L", i2.x, i2.y,
        "A", Ri, Ri, 0, 0, 0, i1.x, i1.y, "Z"
      ].join(" "));
      a.appendChild(path);
      svg.appendChild(a);

      var at = polar(Rlab, mid);
      var label = document.createElement("div");
      label.className = "seg-label" + (link.more ? " seg-label--more" : "");
      label.style.left = at.x + "px";
      label.style.top = at.y + "px";
      label.style.width = labW + "px";
      label.style.setProperty("--tilt", (mid + 90) + "deg");
      label.style.setProperty("--k", (Math.abs(i - (N - 1) / 2) / ((N - 1) / 2)).toFixed(3));
      label.innerHTML =
        '<span class="seg-label__n">' + link.n + '</span>' +
        '<span class="seg-label__name">' + esc(link.name) + '</span>' +
        (link.more
          ? '<span class="seg-label__more">' + link.more.map(function (m) {
              return '<a href="' + esc(m.href) + '" data-note="' + esc(m.note) + '">' +
                     esc(m.name) + '</a>';
            }).join("") + '</span>'
          : "");
      labels.appendChild(label);
    });

    hub.style.left = cx + "px";
    hub.style.top = hubY + "px";
  }

  /* the readout under the arc names whatever the pointer is on */
  root.addEventListener("pointerover", function (event) {
    var seg = event.target.closest(".seg, .seg-label__more a");
    setReadout(seg ? (seg.dataset.note || "") : DATA.hub.note);
  });
  root.addEventListener("pointerleave", function () { setReadout(DATA.hub.note); });
  root.addEventListener("focusin", function (event) {
    var seg = event.target.closest(".seg, .seg-label__more a");
    if (seg) { setReadout(seg.dataset.note || ""); }
  });

  /* a label sits over its segment, so route its hover and clicks there */
  labels.addEventListener("pointerover", function (event) {
    var label = event.target.closest(".seg-label");
    if (!label || event.target.closest(".seg-label__more a")) { return; }
    var seg = svg.querySelectorAll(".seg")[[].indexOf.call(labels.children, label)];
    if (seg) { seg.classList.add("is-hot"); setReadout(seg.dataset.note); }
  });
  labels.addEventListener("pointerout", function () {
    Array.prototype.forEach.call(svg.querySelectorAll(".seg.is-hot"),
      function (s) { s.classList.remove("is-hot"); });
  });
  labels.addEventListener("click", function (event) {
    if (event.target.closest("a")) { return; }
    var label = event.target.closest(".seg-label");
    if (!label) { return; }
    var seg = svg.querySelectorAll(".seg")[[].indexOf.call(labels.children, label)];
    if (seg) { window.location.href = seg.getAttribute("href"); }
  });

  draw();
  if (window.ResizeObserver) { new ResizeObserver(draw).observe(root); }
  else { window.addEventListener("resize", draw); }
})();
