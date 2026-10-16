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
    /* Sources, all supplied by the user as screenshots:
         - the School's contacts list (2026-10-13): roles, degree contacts, a few emails;
         - the user's own Year 1 teaching lists (2026-10-13): `convenes` / `teaches`;
         - the University staff directory pages (2026-10-16): leadership positions (Head of School, Deputy Heads of
           School, Heads of Division), titles, and every person's email.
       Only LEADERSHIP positions are shown as chips (not Lecturer, Professor, Fellow…). Where the directory gives a
       different mailbox from the handbooks' one, both are listed (a domain-only difference is one address); the
       differences are in docs/HANDOVER.md. `name` on someone who already has a card corrects how the name is spelled;
       `title` overrides Dr/Professor. People added from the directory have no module chips (nothing says what they
       convene). Four people have no email anywhere: Neelam Dave, Chris Holmes, Luke Baker, Veryan Codd. */
    "alison snape": { name: "Alison Snape", title: "Professor", emails: ["ams131@le.ac.uk", "alison.snape@le.ac.uk"], roles: ["Head of School"], teaches: ["BS1030"] },
    "sue shackleton": { emails: ["ss115@le.ac.uk"], roles: ["Director of Education", "Deputy Head of School (Education)"], teaches: ["BS1030", "ADBS001"] },
    "nina storey": { emails: ["nina.storey@leicester.ac.uk"], roles: ["Senior Tutor", "AccessAbility Tutor"], teaches: ["BS1060"] },
    "emily allen": { emails: ["ea150@le.ac.uk"], roles: ["Senior Tutor"], teaches: ["BS1060"] },
    "alix blockley": { roles: ["Careers Lead"], years: ["FY"], convenes: ["BS1060"] },
    "saba imanzadeh": { roles: ["BIOsEDI"] },
    "kath clark": { name: "Kath Clark", title: "Dr", emails: ["kc57@le.ac.uk"], roles: ["Deputy Head of School (Citizenship/EDI)", "EDI Lead", "Year 4 (MBiolSci) Programme Director"], years: ["4"] },
    "swidbert ott": { roles: ["Genetics + Zoology + Biological Sciences Programme Director"] },
    "olga makarova": { roles: ["Biochemistry Programme Director"], teaches: ["BS1030"] },
    "jo purves": { roles: ["Microbiology Programme Director"], teaches: ["BS1040"] },
    "volko straub": { roles: ["Physiology + Neuroscience Programme Director"], convenes: ["BS1060"], teaches: ["BS1040"] },
    "mark leyland": { prefix: "(Retired)", convenes: ["BS1030"] },
    "helen o’hare": { convenes: ["BS1040"] },
    "john schwabe": { name: "John Schwabe", title: "Professor", emails: ["js336@le.ac.uk"], teaches: ["BS1030"] },
    "amanda chaplin": { name: "Amanda Chaplin", title: "Dr", emails: ["ac853@le.ac.uk"], teaches: ["BS1030"] },
    "eamonn mallon": { roles: ["Head of Division (Genetics and Genome Biology)"], teaches: ["BS1040", "BS1070"] },
    "rob mahen": { name: "Rob Mahen", title: "Dr", emails: ["rm722@le.ac.uk"], teaches: ["BS1040"] },
    "sarah gretton": { title: "Dr", teaches: ["BS1040"] },
    "chris holmes": { name: "Chris Holmes", title: "Dr", teaches: ["BS1040"] },
    "martha clokie": { teaches: ["BS1040"] },
    "primrose freestone": { teaches: ["BS1040"] },
    "rosato": { name: "Ezio Rosato", title: "Professor", emails: ["er6@le.ac.uk"], convenes: ["BS1050"] },
    "neelam dave": { name: "Neelam Dave", title: "Dr", convenes: ["BS1050"] },
    "sandra beleza": { name: "Sandra Beleza", title: "Dr", emails: ["sdsb1@le.ac.uk"], teaches: ["BS1050"] },
    "hollie marshall": { name: "Hollie Marshall", title: "Dr", emails: ["hjm32@le.ac.uk"], teaches: ["BS1050"] },
    "mark jobling": { teaches: ["BS1050"] },
    "david twell": { teaches: ["BS1050", "BS1070"] },
    "john challiss": { teaches: ["BS1060"] },
    "frank proudlock": { teaches: ["BS1060"] },
    "luke baker": { name: "Luke Baker", title: "Dr", teaches: ["BS1060"] },
    "jonathan willets": { name: "Jonathon Willets", teaches: ["BS1060"] },
    "catherine vial": { teaches: ["BS1060"] },
    "leah cuthbertson": { name: "Leah Cuthbertson", title: "Dr", emails: ["lfc11@le.ac.uk"], teaches: ["BS1060"] },
    "sinéad drea": { name: "Sinéad Drea", title: "Dr", emails: ["sd201@le.ac.uk"], convenes: ["BS1070"] },
    "moya burns": { teaches: ["BS1070"] },
    "stuart desjardins": { teaches: ["BS1070"] },
    "james higgins": { name: "James Higgins", title: "Professor", emails: ["jh555@le.ac.uk"], teaches: ["BS1070"] },
    "pat heslop-harrison": { name: "Pat Heslop-Harrison", title: "Professor", emails: ["phh4@le.ac.uk"], teaches: ["BS1070"] },
    "rob hammond": { teaches: ["BS1070"] },
    "jonathan mcdearmid": { teaches: ["BS1070"] },
    "will norton": { emails: ["whjn1@le.ac.uk"], roles: ["Head of Division (Biosciences Education)"], teaches: ["BS1070"] },
    "veryan codd": { name: "Veryan Codd", title: "Dr", convenes: ["MB1080"] },
    "cyril dominguez": { emails: ["cd180@le.ac.uk"], roles: ["Deputy Head of School (Research)"] },
    "thomas schalch": { emails: ["ts332@le.ac.uk"], roles: ["Head of Division (Molecular and Cell Biology)"] },
    "christopher bayliss": { name: "Christopher Bayliss", title: "Professor", emails: ["cdb12@le.ac.uk"], roles: ["Head of Division (Microbiology and Infection)"] },
    "julie morissey": { name: "Julie Morrissey", emails: ["jam26@le.ac.uk"] },
    "daniel panne": { emails: ["daniel.panne@le.ac.uk"] },
    "chris talbot": { title: "Professor" },
    "anna tang": { name: "Anna Tang", title: "Dr", emails: ["ht228@le.ac.uk"] },
    "anthony brookes": { name: "Anthony Brookes", title: "Professor", emails: ["ajb97@le.ac.uk"] },
    "fabian freund": { name: "Fabian Freund", title: "Dr", emails: ["ff95@le.ac.uk"] },
    "flaviano giorgini": { name: "Flaviano Giorgini", title: "Professor", emails: ["fg36@le.ac.uk"] },
    "charalambos kyriacou": { name: "Charalambos Kyriacou", title: "Professor", emails: ["cpk@le.ac.uk"] },
    "mike barer": { name: "Mike Barer", title: "Professor", emails: ["mrb19@le.ac.uk"] },
    "natalie garton": { name: "Natalie Garton", title: "Dr", emails: ["njg17@le.ac.uk"] },
    "spyridon megremis": { name: "Spyridon Megremis", title: "Dr", emails: ["sm1219@le.ac.uk"] },
    "john pearl": { name: "John Pearl", title: "Dr", emails: ["jep38@le.ac.uk"] },
    "caroline williams": { name: "Caroline Williams", title: "Dr", emails: ["cw329@le.ac.uk"] },
    "nicholas brindle": { name: "Nicholas Brindle", title: "Professor", emails: ["npjb1@le.ac.uk"] },
    "shaun cowley": { name: "Shaun Cowley", title: "Professor", emails: ["smc57@le.ac.uk"] },
    "gareth hall": { name: "Gareth Hall", title: "Dr", emails: ["gh126@le.ac.uk"] },
    "abhinav koyamangalath vadakkepat": { name: "Abhinav Koyamangalath Vadakkepat", title: "Dr", emails: ["akv10@le.ac.uk"] },
    "hanna kwon": { name: "Hanna Kwon", title: "Dr", emails: ["hanna.kwon@le.ac.uk"] },
    "ralf schmid": { name: "Ralf Schmid", title: "Dr", emails: ["rs206@le.ac.uk"] },
    "christopher switzer": { name: "Christopher Switzer", title: "Dr", emails: ["cs876@le.ac.uk"] },
    "kayoko tanaka": { name: "Kayoko Tanaka", title: "Dr", emails: ["kt96@le.ac.uk"] },
    "michael tellier": { name: "Michael Tellier", title: "Dr", emails: ["mt477@le.ac.uk"] }
  }
};
