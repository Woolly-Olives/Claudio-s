/* =============================================================
   Staff cards (Connect) — the parts that are not already in the
   module handbooks. Hand-edited.

   Each staff card's name, email addresses and module codes come from
   the module convenor lists in assets/data/curriculum.js (see
   assets/js/staff.js for how people are matched up). What that list
   cannot supply goes here, keyed by the person's name lower-cased with
   no title: "celia may", "swidbert ott" — the same key staff.js builds.

       "celia may": {
         research: "Plant genomics",            // "My research area:"
         passion:  "Teaching lab skills",       // "I am passionate about:"
         photo:    "assets/img/staff/celia-may.jpg"
       }

   Every field is optional; a missing one leaves its place on the card
   blank. Get the person's agreement before adding a photo or a line in
   their name — nothing here has been asked of anyone yet.
   ============================================================= */
window.BIOSOC_STAFF = {
  profiles: {}
};
