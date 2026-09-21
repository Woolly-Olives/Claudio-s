/* =============================================================
   Join BioSoc — the newsletter, on Microsoft Sway.

   Builds an action card that opens the newsletter directly, plus a
   best-effort frame of it. A cross-origin frame that the other site
   refuses tells us nothing we can read — the browser blocks it silently
   as far as script is concerned — so the frame is never the only way
   through: the action card above it always opens the real page, and a
   line under it says what to do if the frame stays empty. The frame's
   src is not set until someone opens this section, so Sway is not
   fetched for visitors who never come here.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_SWAY;
  var root = document.getElementById("sway");
  if (!root || !DATA) { return; }

  var armed = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  root.innerHTML =
    '<a class="sw-action" href="' + esc(DATA.url) + '" target="_blank" rel="noopener">' +
      '<span class="sw-action__text">' +
        '<strong class="sw-action__name">' + esc(DATA.name) + '</strong>' +
        '<span class="sw-action__blurb">' + esc(DATA.blurb) + '</span>' +
        '<span class="sw-action__host">' + esc(DATA.site) + '</span>' +
      '</span>' +
      '<span class="sw-action__go">' + esc(DATA.action) +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M5 12h13M13 6l6 6-6 6"></path>' +
        '</svg>' +
      '</span>' +
    '</a>' +

    '<div class="sw-frame">' +
      '<iframe class="sw-frame__win" title="' + esc(DATA.name) + '"' +
        ' loading="lazy" referrerpolicy="no-referrer-when-downgrade"' +
        ' sandbox="' + esc(DATA.sandbox) + '" allowfullscreen></iframe>' +
    '</div>' +
    '<p class="sw-foot">Shown from ' + esc(DATA.site) + '. Most likely, your organisation’s ' +
      'network will not allow it to appear here — if the panel above stays empty, ' +
      '<a href="' + esc(DATA.url) + '" target="_blank" rel="noopener">open the newsletter directly</a>.</p>';

  /* Sway is not fetched until someone opens Join BioSoc */
  var frame = root.querySelector(".sw-frame__win");
  if (!frame) { return; }

  document.addEventListener("biosoc:page", function (event) {
    if (event.detail.id !== "join-biosoc" || armed) { return; }
    armed = true;
    frame.src = DATA.embedUrl;
  });
})();
