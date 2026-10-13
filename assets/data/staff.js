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
       Year 1 teaching teams (BS1030, BS1040, BS1050, BS1060, BS1070, MB1080, ADBS001): the user's own lists
       (2026-10-13); `convenes` = the convenors, `teaches` = everyone else listed. Nobody has given an email for
       the people added from them, so those cards have none; "Rosato" has no first name in the list. The list's
       "Jon Willets", "Robert Hammond" and "Jonathon McDearmid" are taken to be the cards already here under
       Jonathan Willets, Rob Hammond and Jonathan McDearmid. */
    "alison snape": { name: "Alison Snape", title: "Professor", emails: ["ams131@le.ac.uk"], roles: ["Head of School"], teaches: ["BS1030"] },
    "sue shackleton": { emails: ["ss115@le.ac.uk"], roles: ["Director of Education"], teaches: ["BS1030", "ADBS001"] },
    "nina storey": { emails: ["nina.storey@leicester.ac.uk"], roles: ["Senior Tutor", "AccessAbility Tutor"], teaches: ["BS1060"] },
    "emily allen": { roles: ["Senior Tutor"], teaches: ["BS1060"] },
    "alix blockley": { roles: ["Careers Lead"], years: ["FY"], convenes: ["BS1060"] },
    "saba imanzadeh": { roles: ["BIOsEDI"] },
    "kath clark": { name: "Kath Clark", title: "Dr", emails: ["kc57@le.ac.uk"], roles: ["EDI Lead", "Year 4 (MBiolSci) Programme Director"], years: ["4"] },
    "swidbert ott": { roles: ["Genetics + Zoology + Biological Sciences Programme Director"] },
    "olga makarova": { roles: ["Biochemistry Programme Director"], teaches: ["BS1030"] },
    "jo purves": { roles: ["Microbiology Programme Director"], teaches: ["BS1040"] },
    "volko straub": { roles: ["Physiology + Neuroscience Programme Director"], convenes: ["BS1060"], teaches: ["BS1040"] },
    "mark leyland": { prefix: "(Retired)", convenes: ["BS1030"] },
    "helen o’hare": { convenes: ["BS1040"] },
    "john schwabe": { name: "John Schwabe", title: "Dr", teaches: ["BS1030"] },
    "amanda chaplin": { name: "Amanda Chaplin", title: "Dr", teaches: ["BS1030"] },
    "eamonn mallon": { teaches: ["BS1040", "BS1070"] },
    "rob mahen": { name: "Rob Mahen", title: "Dr", teaches: ["BS1040"] },
    "sarah gretton": { teaches: ["BS1040"] },
    "chris holmes": { name: "Chris Holmes", title: "Dr", teaches: ["BS1040"] },
    "martha clokie": { teaches: ["BS1040"] },
    "primrose freestone": { teaches: ["BS1040"] },
    "rosato": { name: "Rosato", title: "Professor", convenes: ["BS1050"] },
    "neelam dave": { name: "Neelam Dave", title: "Dr", convenes: ["BS1050"] },
    "sandra beleza": { name: "Sandra Beleza", title: "Dr", teaches: ["BS1050"] },
    "hollie marshall": { name: "Hollie Marshall", title: "Dr", teaches: ["BS1050"] },
    "mark jobling": { teaches: ["BS1050"] },
    "david twell": { teaches: ["BS1050", "BS1070"] },
    "john challiss": { teaches: ["BS1060"] },
    "frank proudlock": { teaches: ["BS1060"] },
    "luke baker": { name: "Luke Baker", title: "Dr", teaches: ["BS1060"] },
    "jonathan willets": { teaches: ["BS1060"] },
    "catherine vial": { teaches: ["BS1060"] },
    "leah cuthbertson": { name: "Leah Cuthbertson", title: "Dr", teaches: ["BS1060"] },
    "sinéad drea": { name: "Sinéad Drea", title: "Dr", convenes: ["BS1070"] },
    "moya burns": { teaches: ["BS1070"] },
    "stuart desjardins": { teaches: ["BS1070"] },
    "james higgins": { name: "James Higgins", title: "Dr", teaches: ["BS1070"] },
    "pat heslop-harrison": { name: "Pat Heslop-Harrison", title: "Professor", teaches: ["BS1070"] },
    "rob hammond": { teaches: ["BS1070"] },
    "jonathan mcdearmid": { teaches: ["BS1070"] },
    "will norton": { teaches: ["BS1070"] },
    "veryan codd": { name: "Veryan Codd", title: "Dr", convenes: ["MB1080"] }
  }
};
