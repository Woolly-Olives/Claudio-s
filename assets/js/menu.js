/* =============================================================
   The burger menu, top left — a slide-in drawer, independent of the
   wheel and its sections. Five dummy options for now (index.html);
   wire them up to something real when there is something real to wire
   them up to.

   Hidden whenever a section page is open (styles.css) — the open
   page already owns that corner with its own "Menu" back button, and
   two controls stacked in one corner is one too many.
   ============================================================= */
(function () {
  "use strict";

  var btn    = document.getElementById("menu-toggle");
  var drawer = document.getElementById("menu-drawer");
  var panel  = document.getElementById("menu-drawer-panel");
  if (!btn || !drawer || !panel) { return; }

  var stage = document.getElementById("stage");
  var open = false;

  function firstLink() { return panel.querySelector(".menu-drawer__link, .menu-drawer__close"); }

  function openDrawer() {
    if (open) { return; }
    open = true;
    drawer.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    if (stage) { stage.setAttribute("inert", ""); }
    var target = firstLink();
    if (target) { target.focus(); }
    document.addEventListener("keydown", onKeydown);
  }

  function closeDrawer() {
    if (!open) { return; }
    open = false;
    drawer.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    if (stage) { stage.removeAttribute("inert"); }
    btn.focus();
    document.removeEventListener("keydown", onKeydown);
  }

  function onKeydown(event) {
    if (event.key === "Escape") { closeDrawer(); return; }
    /* a minimal focus trap: the panel only ever holds the close button
       and the five dummy links, so wrapping between the first and last
       is enough — no need for a general-purpose tabbable-element walk */
    if (event.key !== "Tab") { return; }
    var focusable = panel.querySelectorAll(".menu-drawer__close, .menu-drawer__link");
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }

  btn.addEventListener("click", function () { open ? closeDrawer() : openDrawer(); });
  Array.prototype.forEach.call(drawer.querySelectorAll("[data-menu-close]"), function (el) {
    el.addEventListener("click", closeDrawer);
  });
})();
