/* =============================================================
   The light/dark toggle, top right.

   Dark is the site's default (see :root in styles.css); this lets
   someone override that, either direction, regardless of what their
   system prefers. The choice survives a reload via localStorage — read
   back out in index.html's own inline <script>, before first paint, so
   the page never flashes the wrong theme and then corrects itself.

   The toggle only ever sets the html element's [data-theme] attribute;
   every actual colour swap is CSS (styles.css), keyed off that
   attribute and off prefers-color-scheme when it is absent. This file
   just tracks which of the two is currently in effect, for the icon and
   the button's accessible name.
   ============================================================= */
(function () {
  "use strict";

  var root = document.documentElement;
  var KEY = "biosoc-theme";
  var btn = document.getElementById("theme-toggle");
  if (!btn) { return; }

  var systemLight = window.matchMedia("(prefers-color-scheme: light)");

  function effective() {
    var forced = root.getAttribute("data-theme");
    if (forced === "light" || forced === "dark") { return forced; }
    return systemLight.matches ? "light" : "dark";
  }

  function sync() {
    var now = effective();
    btn.setAttribute("aria-label", now === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  btn.addEventListener("click", function () {
    var next = effective() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem(KEY, next); } catch (e) {}
    sync();
  });

  /* the system can change theme without a click — an evening switch to
     dark mode, say — and the label should track it for as long as
     nothing here has been explicitly forced */
  systemLight.addEventListener("change", function () {
    if (!root.getAttribute("data-theme")) { sync(); }
  });

  sync();
})();
