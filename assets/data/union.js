/* =============================================================
   Join BioSoc — the Students' Union society page.

   Membership is the Union's, not ours: BioSoc's page on
   leicesterunion.com is where people actually join, and it is the
   source of truth for the price and the terms. This file holds what
   the Join BioSoc section says about it.

   ON EMBEDDING IT: `embed` below puts the Union's page in a frame on
   ours. Most Students' Union sites refuse to be framed by another
   domain — the browser then shows an empty box and says why only in
   the console — so it ships off, and the page works as a proper
   hand-off instead. Turn it on, open Join BioSoc, and look: if the
   Union's page appears, keep it; if the box is blank, the Union blocks
   framing and there is nothing to be done about it from this side.

   Anything here marked `check: true` carries a small "confirm" tag on
   the page, because it was written without sight of the Union's page.
   Read it against leicesterunion.com, correct it, and drop the flag —
   the tag is there so nothing unverified is put to students as fact.
   ============================================================= */
window.BIOSOC_UNION = {
  url: "https://www.leicesterunion.com/sportsandsocs/societies/biosoc/",
  site: "leicesterunion.com",
  name: "BioSoc on the Students’ Union site",
  blurb: "Membership runs through the Students’ Union rather than through us. " +
         "Their page is where you join, and where the official details live.",
  action: "Join on the Union site",

  /* false hands over to the Union's page; true tries to frame it here.
     See the note above before switching it on. */
  embed: false,

  /* How joining works, in order. Correct these against the Union's page
     and remove `check` from each line you have confirmed. */
  steps: [
    { text: "Open BioSoc's page on the Students’ Union site." },
    { text: "Sign in with your university account.", check: true },
    { text: "Add the membership to your basket and check out.", check: true }
  ],

  /* Short facts, shown as a strip. Add only what you have checked:
       { label: "Membership", value: "£5 for the year" }
       { label: "Open to",    value: "Any Leicester student" }
     Leave it empty and the strip is simply not drawn. */
  facts: [
  ],

  /* Related Union pages. These two came from the committee's own list
     of essential links, so they are known good. */
  extra: [
    { name: "Every society at Leicester",
      href: "https://www.leicesterunion.com/opportunities/societies/findasociety/" },
    { name: "Union Advice Service and support",
      href: "https://www.leicesterunion.com/support/" }
  ]
};
