/* =============================================================
   School of Biological Sciences — module catalogue.

   >>> THIS IS SAMPLE DATA. <<<
   Placeholder modules and degrees with a realistic shape, so the map
   can be seen working. Replace them with the School's real catalogue
   and set `sampleData: false` — the warning line on the page goes away
   and nothing else needs changing.

   SCHEMA
   ------
   module:  { code, title, credits, year, semester, theme, about? }
              credits  15 or 30 (a 30-credit box is drawn double height)
              year     1, 2 or 3
              semester 1 or 2
              theme    must match an id in `themes`
              about    optional sentence shown in the details panel

   degree:  { id, name, hue, core, excluded?, note? }
              core      required modules per slot, keyed y1s1 … y3s2.
                        Locked into the plan and drawn filled.
              excluded  modules this degree may NOT take. Drawn dimmed
                        and struck through. Omit it and every module in
                        the pool is open to the degree.
              note      optional line shown beside the degree name.

   Any module that is neither core nor excluded is optional: open to
   choose, up to 60 credits per semester.
   ============================================================= */
window.BIOSOC_CURRICULUM = {
  meta: {
    sampleData: true,
    school: "School of Biological Sciences",
    creditsPerSemester: 60,
    years: [1, 2, 3]
  },

  themes: [
    { id: "genetics",   label: "Genetics & Genomics" },
    { id: "micro",      label: "Microbiology & Immunology" },
    { id: "biochem",    label: "Biochemistry" },
    { id: "physiology", label: "Physiology & Pharmacology" },
    { id: "ecology",    label: "Ecology & Evolution" },
    { id: "neuro",      label: "Neuroscience" },
    { id: "skills",     label: "Research & Skills" }
  ],

  modules: [
    /* --- Year 1, Semester 1 --- */
    { code: "BS1101", title: "Foundations of Cell Biology", credits: 15, year: 1, semester: 1, theme: "biochem",
      about: "Cell structure, membranes and the organelles, as the basis for everything that follows." },
    { code: "BS1102", title: "Genetics and Evolution",      credits: 15, year: 1, semester: 1, theme: "genetics",
      about: "Inheritance, variation and selection from Mendel through to population genetics." },
    { code: "BS1103", title: "Biological Chemistry",        credits: 15, year: 1, semester: 1, theme: "biochem" },
    { code: "BS1104", title: "Practical and Data Skills 1", credits: 15, year: 1, semester: 1, theme: "skills",
      about: "Laboratory technique, record keeping and introductory statistics." },

    /* --- Year 1, Semester 2 --- */
    { code: "BS1111", title: "Physiology and Anatomy",      credits: 15, year: 1, semester: 2, theme: "physiology" },
    { code: "BS1112", title: "Microbiology and Immunity",   credits: 15, year: 1, semester: 2, theme: "micro" },
    { code: "BS1113", title: "Ecology and Biodiversity",    credits: 15, year: 1, semester: 2, theme: "ecology" },
    { code: "BS1114", title: "Practical and Data Skills 2", credits: 15, year: 1, semester: 2, theme: "skills" },

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
    { code: "BS3007", title: "Research Project (part 1)",   credits: 30, year: 3, semester: 1, theme: "skills",
      about: "The first half of the independent project. Supervisors are allocated in the summer before Year 3." },
    { code: "BS3008", title: "Cancer Biology",              credits: 15, year: 3, semester: 1, theme: "biochem" },

    /* --- Year 3, Semester 2 --- */
    { code: "BS3011", title: "Epigenetics",                 credits: 15, year: 3, semester: 2, theme: "genetics" },
    { code: "BS3012", title: "Antimicrobial Resistance",    credits: 15, year: 3, semester: 2, theme: "micro" },
    { code: "BS3013", title: "Drug Discovery",              credits: 15, year: 3, semester: 2, theme: "biochem" },
    { code: "BS3014", title: "Respiratory Physiology",      credits: 15, year: 3, semester: 2, theme: "physiology" },
    { code: "BS3015", title: "Global Change Biology",       credits: 15, year: 3, semester: 2, theme: "ecology" },
    { code: "BS3016", title: "Cognitive Neuroscience",      credits: 15, year: 3, semester: 2, theme: "neuro" },
    { code: "BS3017", title: "Research Project (part 2)",   credits: 30, year: 3, semester: 2, theme: "skills",
      about: "The second half of the project, ending in the dissertation and a departmental talk." },
    { code: "BS3018", title: "Synthetic Biology",           credits: 15, year: 3, semester: 2, theme: "genetics" }
  ],

  degrees: [
    { id: "biological-sciences", name: "Biological Sciences", hue: 150,
      note: "The broadest route — only the research strand is fixed.",
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2007"], y2s2: ["BS2017"], y3s1: ["BS3007"], y3s2: ["BS3017"] } },

    { id: "genetics", name: "Genetics", hue: 168,
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2001", "BS2007"], y2s2: ["BS2011", "BS2017"],
              y3s1: ["BS3001", "BS3007"], y3s2: ["BS3011", "BS3017"] } },

    { id: "microbiology", name: "Microbiology", hue: 186,
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2002", "BS2007"], y2s2: ["BS2012", "BS2017"],
              y3s1: ["BS3002", "BS3007"], y3s2: ["BS3012", "BS3017"] } },

    { id: "biochemistry", name: "Biochemistry", hue: 202,
      excluded: ["BS2005", "BS3005"],
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2003", "BS2007"], y2s2: ["BS2013", "BS2017"],
              y3s1: ["BS3003", "BS3007"], y3s2: ["BS3013", "BS3017"] } },

    { id: "physiology-pharmacology", name: "Physiology with Pharmacology", hue: 218,
      excluded: ["BS2005", "BS3005", "BS3015"],
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2004", "BS2007"], y2s2: ["BS2014", "BS2017"],
              y3s1: ["BS3004", "BS3007"], y3s2: ["BS3014", "BS3017"] } },

    { id: "zoology", name: "Zoology", hue: 96,
      excluded: ["BS2012", "BS3008", "BS3013"],
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2005", "BS2007"], y2s2: ["BS2015", "BS2017"],
              y3s1: ["BS3005", "BS3007"], y3s2: ["BS3015", "BS3017"] } },

    { id: "neuroscience", name: "Neuroscience", hue: 264,
      excluded: ["BS2005", "BS3005"],
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2006", "BS2007"], y2s2: ["BS2016", "BS2017"],
              y3s1: ["BS3006", "BS3007"], y3s2: ["BS3016", "BS3017"] } },

    { id: "medical-genetics", name: "Medical Genetics", hue: 286,
      note: "Year 3 Semester 1 is fully prescribed.",
      excluded: ["BS2005", "BS2015", "BS3005", "BS3015"],
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2001", "BS2008"], y2s2: ["BS2011", "BS2012"],
              y3s1: ["BS3001", "BS3008", "BS3007"], y3s2: ["BS3011", "BS3017"] } },

    { id: "medical-microbiology", name: "Medical Microbiology", hue: 306,
      excluded: ["BS2005", "BS2015", "BS3005", "BS3015"],
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2002", "BS2008"], y2s2: ["BS2012", "BS2018"],
              y3s1: ["BS3002", "BS3007"], y3s2: ["BS3012", "BS3017"] } },

    { id: "medical-biochemistry", name: "Medical Biochemistry", hue: 328,
      note: "Year 3 Semester 1 is fully prescribed.",
      excluded: ["BS2005", "BS2015", "BS3005", "BS3015"],
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2003", "BS2008"], y2s2: ["BS2013", "BS2014"],
              y3s1: ["BS3003", "BS3008", "BS3007"], y3s2: ["BS3013", "BS3017"] } },

    { id: "medical-physiology", name: "Medical Physiology", hue: 20,
      excluded: ["BS2005", "BS2015", "BS3005", "BS3015"],
      core: { y1s1: ["BS1101", "BS1102", "BS1103", "BS1104"],
              y1s2: ["BS1111", "BS1112", "BS1113", "BS1114"],
              y2s1: ["BS2004", "BS2008"], y2s2: ["BS2014", "BS2018"],
              y3s1: ["BS3004", "BS3007"], y3s2: ["BS3014", "BS3017"] } }
  ]
};
