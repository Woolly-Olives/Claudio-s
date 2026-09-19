/* =============================================================
   School of Biological Sciences — module catalogue.

   >>> PARTLY SAMPLE DATA. <<<
   Year 1 carries the real module codes and credits. Their titles are
   not recorded yet — a module with no `title` draws as its code with
   "Title to be added" beneath, so the gap is visible rather than
   invented. Years 2 and 3, and the degree structures, are still
   placeholders with a realistic shape.

   Replace the placeholders and set `sampleData: false` to drop the
   warning line on the page.

   SCHEMA
   ------
   module:  { code, title?, credits, year, semester, theme, about?,
              display?, linked? }
              credits  15 or 30 (a 30-credit box is drawn double height)
              year     1, 2 or 3
              semester 1 or 2
              theme    must match an id in `themes`
              title    omit it if the real title is not known yet
              display  code to show, when it differs from the key `code`
              linked   group id. Modules sharing one are drawn as a
                       single connected shape across adjacent columns —
                       used for a year-long module split over two
                       semesters. They are always drawn first in their
                       column so the two halves line up, and taking or
                       dropping one takes or drops the whole group.

   degree:  { id, name, hue, core, excluded? }
              core      required modules per slot, keyed y1s1 … y3s2.
              excluded  modules this degree may NOT take. Drawn dimmed
                        and struck through.

   Any module that is neither core nor excluded is optional: open to
   choose, up to 60 credits per semester.

   `degreeLayout` sets how the degree buttons are arranged — one inner
   array per column, top to bottom. A degree missing from it is appended
   after the grid.
   ============================================================= */
window.BIOSOC_CURRICULUM = {
  meta: {
    sampleData: true,
    school: "School of Biological Sciences",
    creditsPerSemester: 60,
    degreeLayout: [
      ["biological-sciences"],
      ["zoology", "neuroscience"],
      ["physiology-pharmacology", "medical-physiology"],
      ["biochemistry", "medical-biochemistry"],
      ["genetics", "medical-genetics"],
      ["microbiology", "medical-microbiology"]
    ]
  },

  themes: [
    { id: "year1",      label: "Year 1 core" },
    { id: "genetics",   label: "Genetics & Genomics" },
    { id: "micro",      label: "Microbiology & Immunology" },
    { id: "biochem",    label: "Biochemistry" },
    { id: "physiology", label: "Physiology & Pharmacology" },
    { id: "ecology",    label: "Ecology & Evolution" },
    { id: "neuro",      label: "Neuroscience" },
    { id: "skills",     label: "Research & Skills" }
  ],

  modules: [
    /* --- Year 1 --- real codes and credits; titles still to be filled in.
       BS1070 and MB1080 are alternatives: BS1070 for every degree except
       the four Medical ones, MB1080 for those four only. --- */
    { code: "BS1030", credits: 30, year: 1, semester: 1, theme: "year1" },
    { code: "BS1040", credits: 30, year: 1, semester: 1, theme: "year1" },
    { code: "BS1050", credits: 15, year: 1, semester: 2, theme: "year1" },
    { code: "BS1060", credits: 30, year: 1, semester: 2, theme: "year1" },
    { code: "BS1070", credits: 15, year: 1, semester: 2, theme: "year1",
      about: "Taken by every degree except the four Medical ones, which take MB1080 instead." },
    { code: "MB1080", credits: 15, year: 1, semester: 2, theme: "year1",
      about: "Taken only by the four Medical degrees, in place of BS1070." },

    /* --- Year 2, Semester 1 --- */
    { code: "BS2001", title: "Molecular Genetics",          credits: 15, year: 2, semester: 1, theme: "genetics" },
    { code: "BS2002", title: "Microbial Physiology",        credits: 15, year: 2, semester: 1, theme: "micro" },
    { code: "BS2003", title: "Cell Signalling",             credits: 15, year: 2, semester: 1, theme: "biochem" },
    { code: "BS2004", title: "Animal Physiology",           credits: 15, year: 2, semester: 1, theme: "physiology" },
    { code: "BS2005", title: "Ecology and Conservation",    credits: 15, year: 2, semester: 1, theme: "ecology" },
    { code: "BS2006", title: "Neurobiology",                credits: 15, year: 2, semester: 1, theme: "neuro" },
    { code: "BS2007", title: "Research Skills and Statistics", credits: 30, year: 2, semester: 1, theme: "skills",
      about: "Runs across the semester: experimental design, statistics in R, and scientific writing." },
    { code: "BS2008", title: "Immunology",                  credits: 15, year: 2, semester: 1, theme: "micro" },

    /* --- Year 2, Semester 2 --- */
    { code: "BS2011", title: "Genomics and Bioinformatics", credits: 15, year: 2, semester: 2, theme: "genetics" },
    { code: "BS2012", title: "Medical Microbiology",        credits: 15, year: 2, semester: 2, theme: "micro" },
    { code: "BS2013", title: "Metabolic Biochemistry",      credits: 15, year: 2, semester: 2, theme: "biochem" },
    { code: "BS2014", title: "Human Physiology",            credits: 15, year: 2, semester: 2, theme: "physiology" },
    { code: "BS2015", title: "Evolutionary Biology",        credits: 15, year: 2, semester: 2, theme: "ecology" },
    { code: "BS2016", title: "Systems Neuroscience",        credits: 15, year: 2, semester: 2, theme: "neuro" },
    { code: "BS2017", title: "Experimental Design",         credits: 15, year: 2, semester: 2, theme: "skills" },
    { code: "BS2018", title: "Virology",                    credits: 15, year: 2, semester: 2, theme: "micro" },

    /* --- Year 3, Semester 1 --- */
    { code: "BS3001", title: "Advanced Genetics",           credits: 15, year: 3, semester: 1, theme: "genetics" },
    { code: "BS3002", title: "Bacterial Pathogenesis",      credits: 15, year: 3, semester: 1, theme: "micro" },
    { code: "BS3003", title: "Structural Biology",          credits: 15, year: 3, semester: 1, theme: "biochem" },
    { code: "BS3004", title: "Cardiovascular Physiology",   credits: 15, year: 3, semester: 1, theme: "physiology" },
    { code: "BS3005", title: "Behavioural Ecology",         credits: 15, year: 3, semester: 1, theme: "ecology" },
    { code: "BS3006", title: "Neurodegeneration",           credits: 15, year: 3, semester: 1, theme: "neuro" },
    { code: "BS3008", title: "Cancer Biology",              credits: 15, year: 3, semester: 1, theme: "biochem" },

    /* --- Year 3, Semester 2 --- */
    { code: "BS3011", title: "Epigenetics",                 credits: 15, year: 3, semester: 2, theme: "genetics" },
    { code: "BS3012", title: "Antimicrobial Resistance",    credits: 15, year: 3, semester: 2, theme: "micro" },
    { code: "BS3013", title: "Drug Discovery",              credits: 15, year: 3, semester: 2, theme: "biochem" },
    { code: "BS3014", title: "Respiratory Physiology",      credits: 15, year: 3, semester: 2, theme: "physiology" },
    { code: "BS3015", title: "Global Change Biology",       credits: 15, year: 3, semester: 2, theme: "ecology" },
    { code: "BS3016", title: "Cognitive Neuroscience",      credits: 15, year: 3, semester: 2, theme: "neuro" },
    { code: "BS3018", title: "Synthetic Biology",           credits: 15, year: 3, semester: 2, theme: "genetics" },

    /* --- the year-long Research Project: 45 credits, 30 in Semester 1 and
       15 in Semester 2, drawn as one connected shape across the two --- */
    { code: "BS3090",  display: "BS3090", title: "Research Project", credits: 30,
      year: 3, semester: 1, theme: "skills", linked: "project",
      about: "A year-long project worth 45 credits in total: 30 in Semester 1 and 15 in Semester 2. Supervisors are allocated in the summer before Year 3." },
    { code: "BS3090B", display: "BS3090", title: "Research Project", credits: 15,
      year: 3, semester: 2, theme: "skills", linked: "project",
      about: "The Semester 2 half of the year-long project: the dissertation and a departmental talk." }
  ],

  degrees: [
    { id: "biological-sciences", name: "Biological Sciences", hue: 150,
      excluded: ["MB1080"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "BS1070"],
              y2s1: ["BS2007"], y2s2: ["BS2017"],
              y3s1: ["BS3090"], y3s2: ["BS3090B"] } },

    { id: "genetics", name: "Genetics", hue: 168,
      excluded: ["MB1080"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "BS1070"],
              y2s1: ["BS2001", "BS2007"], y2s2: ["BS2011", "BS2017"],
              y3s1: ["BS3001", "BS3090"], y3s2: ["BS3011", "BS3090B"] } },

    { id: "microbiology", name: "Microbiology", hue: 186,
      excluded: ["MB1080"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "BS1070"],
              y2s1: ["BS2002", "BS2007"], y2s2: ["BS2012", "BS2017"],
              y3s1: ["BS3002", "BS3090"], y3s2: ["BS3012", "BS3090B"] } },

    { id: "biochemistry", name: "Biochemistry", hue: 202,
      excluded: ["BS2005", "BS3005", "MB1080"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "BS1070"],
              y2s1: ["BS2003", "BS2007"], y2s2: ["BS2013", "BS2017"],
              y3s1: ["BS3003", "BS3090"], y3s2: ["BS3013", "BS3090B"] } },

    { id: "physiology-pharmacology", name: "Physiology with Pharmacology", hue: 218,
      excluded: ["BS2005", "BS3005", "BS3015", "MB1080"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "BS1070"],
              y2s1: ["BS2004", "BS2007"], y2s2: ["BS2014", "BS2017"],
              y3s1: ["BS3004", "BS3090"], y3s2: ["BS3014", "BS3090B"] } },

    { id: "zoology", name: "Zoology", hue: 96,
      excluded: ["BS2012", "BS3008", "BS3013", "MB1080"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "BS1070"],
              y2s1: ["BS2005", "BS2007"], y2s2: ["BS2015", "BS2017"],
              y3s1: ["BS3005", "BS3090"], y3s2: ["BS3015", "BS3090B"] } },

    { id: "neuroscience", name: "Neuroscience", hue: 264,
      excluded: ["BS2005", "BS3005", "MB1080"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "BS1070"],
              y2s1: ["BS2006", "BS2007"], y2s2: ["BS2016", "BS2017"],
              y3s1: ["BS3006", "BS3090"], y3s2: ["BS3016", "BS3090B"] } },

    { id: "medical-genetics", name: "Medical Genetics", hue: 286,
      excluded: ["BS1070", "BS2005", "BS2015", "BS3005", "BS3015"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "MB1080"],
              y2s1: ["BS2001", "BS2008"], y2s2: ["BS2011", "BS2012"],
              y3s1: ["BS3001", "BS3008", "BS3090"], y3s2: ["BS3011", "BS3090B"] } },

    { id: "medical-microbiology", name: "Medical Microbiology", hue: 306,
      excluded: ["BS1070", "BS2005", "BS2015", "BS3005", "BS3015"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "MB1080"],
              y2s1: ["BS2002", "BS2008"], y2s2: ["BS2012", "BS2018"],
              y3s1: ["BS3002", "BS3090"], y3s2: ["BS3012", "BS3090B"] } },

    { id: "medical-biochemistry", name: "Medical Biochemistry", hue: 328,
      excluded: ["BS1070", "BS2005", "BS2015", "BS3005", "BS3015"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "MB1080"],
              y2s1: ["BS2003", "BS2008"], y2s2: ["BS2013", "BS2014"],
              y3s1: ["BS3003", "BS3008", "BS3090"], y3s2: ["BS3013", "BS3090B"] } },

    { id: "medical-physiology", name: "Medical Physiology", hue: 20,
      excluded: ["BS1070", "BS2005", "BS2015", "BS3005", "BS3015"],
      core: { y1s1: ["BS1030", "BS1040"], y1s2: ["BS1050", "BS1060", "MB1080"],
              y2s1: ["BS2004", "BS2008"], y2s2: ["BS2014", "BS2018"],
              y3s1: ["BS3004", "BS3090"], y3s2: ["BS3014", "BS3090B"] } }
  ]
};
