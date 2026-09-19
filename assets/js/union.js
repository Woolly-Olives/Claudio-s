/* =============================================================
   Join BioSoc — the Students' Union society page.

   Builds the hand-off to leicesterunion.com from assets/data/union.js:
   the action card, the steps, the facts strip and the related links.

   If `embed` is on it also frames the Union's page. A cross-origin
   frame that the other site refuses tells us nothing we can read — the
   browser blocks it silently as far as script is concerned — so the
   frame is never the only way through: the action card above it always
   opens the real page, and a line under it says what to do if the
   frame stays empty. The frame's src is not set until someone opens
   this section, so the Union is not fetched for visitors who never
   come here.
   ============================================================= */
(function () {
  "use strict";

  var DATA = window.BIOSOC_UNION;
  var root = document.getElementById("union");
  if (!root || !DATA) { return; }

  var steps = DATA.steps || [];
  var facts = DATA.facts || [];
  var extra = DATA.extra || [];
  var armed = false;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function step(item, i) {
    return '' +
      '<li class="su-step">' +
        '<span class="su-step__n" aria-hidden="true">' + (i + 1) + '</span>' +
        '<span class="su-step__text">' + esc(item.text) +
          (item.check ? ' <span class="su-tag">confirm</span>' : '') +
        '</span>' +
      '</li>';
  }

  function fact(item) {
    return '' +
      '<div class="su-fact">' +
        '<dt>' + esc(item.label) + '</dt>' +
        '<dd>' + esc(item.value) + '</dd>' +
      '</div>';
  }

  function link(item) {
    return '<li><a href="' + esc(item.href) + '" target="_blank" rel="noopener">' +
           esc(item.name) + '</a></li>';
  }

  root.innerHTML =
    '<a class="su-action" href="' + esc(DATA.url) + '" target="_blank" rel="noopener">' +
      '<span class="su-action__text">' +
        '<strong class="su-action__name">' + esc(DATA.name) + '</strong>' +
        '<span class="su-action__blurb">' + esc(DATA.blurb) + '</span>' +
        '<span class="su-action__host">' + esc(DATA.site) + '</span>' +
      '</span>' +
      '<span class="su-action__go">' + esc(DATA.action) +
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          '<path d="M5 12h13M13 6l6 6-6 6"></path>' +
        '</svg>' +
      '</span>' +
    '</a>' +

    (steps.length
      ? '<h2 class="su-h">How joining works</h2>' +
        '<ol class="su-steps">' + steps.map(step).join("") + '</ol>'
      : '') +

    (facts.length ? '<dl class="su-facts">' + facts.map(fact).join("") + '</dl>' : '') +

    (DATA.embed
      ? '<div class="su-frame">' +
          '<iframe class="su-frame__win" title="' + esc(DATA.name) + '"' +
            ' loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '</div>' +
        '<p class="su-foot">Shown from ' + esc(DATA.site) + '. If the panel above stays ' +
          'empty, the Union does not allow its pages to be shown inside another site &mdash; ' +
          '<a href="' + esc(DATA.url) + '" target="_blank" rel="noopener">open it directly</a>.</p>'
      : '') +

    (extra.length
      ? '<h2 class="su-h">Elsewhere on the Union site</h2>' +
        '<ul class="su-extra">' + extra.map(link).join("") + '</ul>'
      : '');

  /* the Union is not fetched until someone opens Join BioSoc */
  var frame = root.querySelector(".su-frame__win");
  if (!frame) { return; }

  document.addEventListener("biosoc:page", function (event) {
    if (event.detail.id !== "join-biosoc" || armed) { return; }
    armed = true;
    frame.src = DATA.url;
  });
})();
