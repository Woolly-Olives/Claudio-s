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
         roles:    ["Senior Tutor"],              // shown as red chips before the codes;
                                                // filter groups: any "...Tutor" -> Tutor,
                                                // "Careers..." -> Careers, "BIOsEDI", "EDI Lead...",
                                                // "...Programme Director", "Head of School" and
                                                // "Director of Education" -> Leadership
         convenes: ["BS1030"],                  // modules they convene that the handbooks' lists do not
                                                // carry (Year 1): shown as "BS1030 Convenor"
         prefix:   "(Retired)",                 // a grey note before the name
         emails:   ["ss115@le.ac.uk"],          // a second mailbox, added to the handbooks' one; an
                                                // address that differs only in the domain
                                                // (le.ac.uk / leicester.ac.uk) is shown once
         name:     "Alison Snape", title: "Professor", emails: ["ams131@le.ac.uk"],
                                                // ONLY for someone who convenes no module (so is not
                                                // in the handbooks' lists): these three make a card
                                                // for them. Everyone else gets name and emails there.
         years:    ["FY"],                      // extra year filters ("1","2","3","FY");
                                                // 1-3 come from the modules already
         teaches:  ["BS3031", "BS2009"],        // modules they teach on but do
                                                // not convene (convened ones
                                                // are added automatically)
         research: "Plant genomics",            // "My research area:"
         passion:  "Teaching lab skills",       // "I am passionate about:" (back of the card)
         advice:   "Start the report early",    // "My advice to students:" (back of the card)
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
    /* Roles and degree contacts: from the School's contacts list the user supplied (screenshot, 2026-10-13).
       Year 1 teaching teams: the user's own list (2026-10-13). Nobody has given an email for the four people
       added from it (Schwabe, Chaplin, Mahen, Holmes), so their cards have none. */
    "alison snape":   { name: "Alison Snape", title: "Professor", emails: ["ams131@le.ac.uk"], roles: ["Head of School"], teaches: ["BS1030"] },
    "sue shackleton": { roles: ["Director of Education"], emails: ["ss115@le.ac.uk"], teaches: ["BS1030", "ADBS001"] },
    "nina storey":    { roles: ["Senior Tutor", "AccessAbility Tutor"], emails: ["nina.storey@leicester.ac.uk"] },
    "emily allen":    { roles: ["Senior Tutor"] },
    "alix blockley":  { roles: ["Careers Lead"], years: ["FY"] },
    "saba imanzadeh": { roles: ["BIOsEDI"] },
    "kath clark":     { name: "Kath Clark", title: "Dr", emails: ["kc57@le.ac.uk"], years: ["4"],
                        roles: ["EDI Lead", "Year 4 (MBiolSci) Programme Director"] },
    "swidbert ott":   { roles: ["Genetics + Zoology + Biological Sciences Programme Director"] },
    "olga makarova":  { roles: ["Biochemistry Programme Director"], teaches: ["BS1030"] },
    "jo purves":      { roles: ["Microbiology Programme Director"], teaches: ["BS1040"] },
    "volko straub":   { roles: ["Physiology + Neuroscience Programme Director"], teaches: ["BS1040"] },

    /* Year 1: BS1030 and BS1040 each have one convenor; everyone else listed teaches on the module */
    "mark leyland":   { prefix: "(Retired)", convenes: ["BS1030"] },
    "helen o\u2019hare": { convenes: ["BS1040"] },
    "john schwabe":   { name: "John Schwabe", title: "Dr", teaches: ["BS1030"] },
    "amanda chaplin": { name: "Amanda Chaplin", title: "Dr", teaches: ["BS1030"] },
    "eamonn mallon":  { teaches: ["BS1040"] },
    "rob mahen":      { name: "Rob Mahen", title: "Dr", teaches: ["BS1040"] },
    "sarah gretton":  { teaches: ["BS1040"] },
    "chris holmes":   { name: "Chris Holmes", title: "Dr", teaches: ["BS1040"] },
    "martha clokie":  { teaches: ["BS1040"] },
    "primrose freestone": { teaches: ["BS1040"] }
  }
};
