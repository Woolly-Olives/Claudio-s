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
                                                // "Programme Director", "Head of School" and
                                                // "Director of Education" -> Leadership
         roleNotes: { "Programme Director": "Degree contact for: ..." },   // hover text on a role chip
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
       Emails for people who already have a card are left as the handbooks give them; the contacts list differs
       for four of them (see docs/HANDOVER.md) and nothing has been changed until someone says which is right. */
    "alison snape":   { name: "Alison Snape", title: "Professor", emails: ["ams131@le.ac.uk"], roles: ["Head of School"] },
    "sue shackleton": { roles: ["Director of Education"] },
    "nina storey":    { roles: ["Senior Tutor", "AccessAbility Tutor"] },
    "emily allen":    { roles: ["Senior Tutor"] },
    "alix blockley":  { roles: ["Careers Lead"], years: ["FY"] },
    "saba imanzadeh": { roles: ["BIOsEDI"] },
    "kath clark":     { name: "Kath Clark", title: "Dr", emails: ["kc57@le.ac.uk"], roles: ["EDI Lead", "Programme Director"], years: ["4"],
                        roleNotes: { "Programme Director": "Degree contact for: Year 4 (MBiolSci)" } },
    "swidbert ott":   { roles: ["Programme Director"],
                        roleNotes: { "Programme Director": "Degree contact for: Biological Sciences; Biological Sciences (Genetics); Biological Sciences (Zoology); Medical Genetics" } },
    "olga makarova":  { roles: ["Programme Director"],
                        roleNotes: { "Programme Director": "Degree contact for: Biological Sciences (Biochemistry); Medical Biochemistry" } },
    "jo purves":      { roles: ["Programme Director"],
                        roleNotes: { "Programme Director": "Degree contact for: Biological Sciences (Microbiology); Medical Microbiology" } },
    "volko straub":   { roles: ["Programme Director"],
                        roleNotes: { "Programme Director": "Degree contact for: Biological Sciences (Neuroscience); Biological Sciences (Physiology & Pharmacology); Medical Physiology" } }
  }
};
