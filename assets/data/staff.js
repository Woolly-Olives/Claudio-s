/* =============================================================
   Staff cards (Connect) — the parts that are not already in the
   module handbooks. Hand-edited.

   Each staff card's name, email addresses and the modules they CONVENE
   come from the module convenor lists in assets/data/curriculum.js
   (see assets/js/staff.js for how people are matched up). What that
   list cannot supply goes here, keyed by the person's name lower-cased
   with no title: "celia may", "swidbert ott" — the same key staff.js
   builds.

       "celia may": {
         roles:    ["Head Tutor"],              // shown as red chips before the codes;
                                                // filter groups: any "...Tutor" -> Tutor,
                                                // "Careers..." -> Careers, "BIOsEDI"
         years:    ["FY"],                      // extra year filters ("1","2","3","FY");
                                                // 1-3 come from the modules already
         teaches:  ["BS3031", "BS2009"],        // modules they teach on but do
                                                // not convene (convened ones
                                                // are added automatically)
         research: "Plant genomics",            // "My research area:"
         passion:  "Teaching lab skills",       // "I am passionate about:"
         photo:    "assets/img/staff/celia-may.jpg"
       }

   Every field is optional; a missing one leaves its place on the card
   blank. The handbooks name convenors only, not the other lecturers on
   a module, so `teaches` is empty for everyone until someone supplies
   it. Get the person's agreement before adding a photo or a line in
   their name — nothing here has been asked of anyone yet.
   ============================================================= */
window.BIOSOC_STAFF = {
  profiles: {
    "alix blockley": { roles: ["Careers Lead"], years: ["FY"] },
    "saba imanzadeh": { roles: ["BIOsEDI"] },
    "nina storey":   { roles: ["Head Tutor"] },
    "emily allen":   { roles: ["Head Tutor"] }
  }
};
