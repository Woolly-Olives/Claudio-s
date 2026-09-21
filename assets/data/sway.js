/* =============================================================
   Join BioSoc — the newsletter, on Microsoft Sway.

   This replaced the Students' Union hand-off (2026-09-21, at explicit
   instruction) — see docs/HANDOVER.md before restoring it or adding
   membership steps back to this page.

   ON EMBEDDING IT: sway.cloud.microsoft is blocked at this container's
   egress proxy (the same class of block as instagram.com,
   leicesterunion.com and outlook.*), so whether Sway allows itself to be
   framed cannot be tested here. The action card above the frame always
   opens the real page regardless, and a line under the frame says what
   to do if it stays empty — most likely, on this network, it will.
   ============================================================= */
window.BIOSOC_SWAY = {
  url: "https://sway.cloud.microsoft/aXDghXvO80G1eDwD",
  embedUrl: "https://sway.cloud.microsoft/s/aXDghXvO80G1eDwD/embed",
  site: "sway.cloud.microsoft",
  name: "BioSoc newsletter",
  blurb: "The Society's newsletter, hosted on Microsoft Sway.",
  action: "Open the newsletter",

  /* Sway's own embed code sandboxes the frame to exactly this set —
     carried over unchanged rather than widened or narrowed. */
  sandbox: "allow-forms allow-modals allow-orientation-lock allow-popups " +
           "allow-same-origin allow-scripts"
};
