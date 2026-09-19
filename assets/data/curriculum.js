/* =============================================================
   School of Biological Sciences — module catalogue.

   >>> THIS IS SAMPLE DATA. <<<
   The modules and degrees below are placeholders with a realistic
   shape, so the planner can be seen working. Replace them with the
   School's real catalogue and set `sampleData: false` — the warning
   banner on the page disappears at that point and nothing else needs
   changing.

   SCHEMA
   ------
   module:  { code, title, credits, year, semester, theme }
              year     2 or 3
              semester 1 or 2
              theme    must match an id in `themes`

   degree:  { id, name, hue, core, restrictTo?, note? }
              core       required modules per slot, keyed y2s1 / y2s2 /
                         y3s1 / y3s2. These are locked into the plan.
              restrictTo optional array of codes. If present, only these
                         modules (plus core) can be chosen for this
                         degree. Omit it to allow the whole School pool.
              note       optional line shown under the degree name.

   Slots are Year 2 and Year 3 only; Year 1 is not planned here.
   ============================================================= */
window.BIOSOC_CURRICULUM = {
  meta: {
    sampleData: true,
    school: "School of Biological Sciences",
    creditsPerSemester: 60,
    sourceNote: "Replace with the module catalogue and degree structures published by the School."
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
    /* --- Year 2, Semester 1 --- */
    { code: "BS2001", title: "Molecular Genetics",            credits: 15, year: 2, semester: 1, theme: "genetics" },
    { code: "BS2002", title: "Microbial Physiology",          credits: 15, year: 2, semester: 1, theme: "micro" },
    { code: "BS2003", title: "Cell Signalling",               credits: 15, year: 2, semester: 1, theme: "biochem" },
    { code: "BS2004", title: "Animal Physiology",             credits: 15, year: 2, semester: 1, theme: "physiology" },
    { code: "BS2005", title: "Ecology and Conservation",      credits: 15, year: 2, semester: 1, theme: "ecology" },
    { code: "BS2006", title: "Neurobiology",                  credits: 15, year: 2, semester: 1, theme: "neuro" },
    { code: "BS2007", title: "Research Skills and Statistics", credits: 15, year: 2, semester: 1, theme: "skills" },
    { code: "BS2008", title: "Immunology",                    credits: 15, year: 2, semester: 1, theme: "micro" },

    /* --- Year 2, Semester 2 --- */
    { code: "BS2011", title: "Genomics and Bioinformatics",   credits: 15, year: 2, semester: 2, theme: "genetics" },
    { code: "BS2012", title: "Medical Microbiology",          credits: 15, year: 2, semester: 2, theme: "micro" },
    { code: "BS2013", title: "Metabolic Biochemistry",        credits: 15, year: 2, semester: 2, theme: "biochem" },
    { code: "BS2014", title: "Human Physiology",              credits: 15, year: 2, semester: 2, theme: "physiology" },
    { code: "BS2015", title: "Evolutionary Biology",          credits: 15, year: 2, semester: 2, theme: "ecology" },
    { code: "BS2016", title: "Systems Neuroscience",          credits: 15, year: 2, semester: 2, theme: "neuro" },
    { code: "BS2017", title: "Experimental Design",           credits: 15, year: 2, semester: 2, theme: "skills" },
    { code: "BS2018", title: "Virology",                      credits: 15, year: 2, semester: 2, theme: "micro" },

    /* --- Year 3, Semester 1 --- */
    { code: "BS3001", title: "Advanced Genetics",             credits: 15, year: 3, semester: 1, theme: "genetics" },
    { code: "BS3002", title: "Bacterial Pathogenesis",        credits: 15, year: 3, semester: 1, theme: "micro" },
    { code: "BS3003", title: "Structural Biology",            credits: 15, year: 3, semester: 1, theme: "biochem" },
    { code: "BS3004", title: "Cardiovascular Physiology",     credits: 15, year: 3, semester: 1, theme: "physiology" },
    { code: "BS3005", title: "Behavioural Ecology",           credits: 15, year: 3, semester: 1, theme: "ecology" },
    { code: "BS3006", title: "Neurodegeneration",             credits: 15, year: 3, semester: 1, theme: "neuro" },
    { code: "BS3007", title: "Research Project (part 1)",     credits: 30, year: 3, semester: 1, theme: "skills" },
    { code: "BS3008", title: "Cancer Biology",                credits: 15, year: 3, semester: 1, theme: "biochem" },

    /* --- Year 3, Semester 2 --- */
    { code: "BS3011", title: "Epigenetics",                   credits: 15, year: 3, semester: 2, theme: "genetics" },
    { code: "BS3012", title: "Antimicrobial Resistance",      credits: 15, year: 3, semester: 2, theme: "micro" },
    { code: "BS3013", title: "Drug Discovery",                credits: 15, year: 3, semester: 2, theme: "biochem" },
    { code: "BS3014", title: "Respiratory Physiology",        credits: 15, year: 3, semester: 2, theme: "physiology" },
    { code: "BS3015", title: "Global Change Biology",         credits: 15, year: 3, semester: 2, theme: "ecology" },
    { code: "BS3016", title: "Cognitive Neuroscience",        credits: 15, year: 3, semester: 2, theme: "neuro" },
    { code: "BS3017", title: "Research Project (part 2)",     credits: 30, year: 3, semester: 2, theme: "skills" },
    { code: "BS3018", title: "Synthetic Biology",             credits: 15, year: 3, semester: 2, theme: "genetics" }
  ],

  degrees: [
    { id: "biological-sciences", name: "Biological Sciences", hue: 150,
      note: "The broadest route — only the research strand is fixed.",
      core: { y2s1: ["BS2007"], y2s2: ["BS2017"], y3s1: ["BS3007"], y3s2: ["BS3017"] } },

    { id: "genetics", name: "Genetics", hue: 168,
      core: { y2s1: ["BS2001", "BS2007"], y2s2: ["BS2011", "BS2017"],
              y3s1: ["BS3001", "BS3007"], y3s2: ["BS3011", "BS3017"] } },

    { id: "microbiology", name: "Microbiology", hue: 186,
      core: { y2s1: ["BS2002", "BS2007"], y2s2: ["BS2012", "BS2017"],
              y3s1: ["BS3002", "BS3007"], y3s2: ["BS3012", "BS3017"] } },

    { id: "biochemistry", name: "Biochemistry", hue: 202,
      core: { y2s1: ["BS2003", "BS2007"], y2s2: ["BS2013", "BS2017"],
              y3s1: ["BS3003", "BS3007"], y3s2: ["BS3013", "BS3017"] } },

    { id: "physiology-pharmacology", name: "Physiology with Pharmacology", hue: 218,
      core: { y2s1: ["BS2004", "BS2007"], y2s2: ["BS2014", "BS2017"],
              y3s1: ["BS3004", "BS3007"], y3s2: ["BS3014", "BS3017"] } },

    { id: "zoology", name: "Zoology", hue: 96,
      core: { y2s1: ["BS2005", "BS2007"], y2s2: ["BS2015", "BS2017"],
              y3s1: ["BS3005", "BS3007"], y3s2: ["BS3015", "BS3017"] } },

    { id: "neuroscience", name: "Neuroscience", hue: 264,
      core: { y2s1: ["BS2006", "BS2007"], y2s2: ["BS2016", "BS2017"],
              y3s1: ["BS3006", "BS3007"], y3s2: ["BS3016", "BS3017"] } },

    { id: "medical-genetics", name: "Medical Genetics", hue: 286,
      note: "Year 3 Semester 1 is fully prescribed.",
      core: { y2s1: ["BS2001", "BS2008"], y2s2: ["BS2011", "BS2012"],
              y3s1: ["BS3001", "BS3008", "BS3007"], y3s2: ["BS3011", "BS3017"] } },

    { id: "medical-microbiology", name: "Medical Microbiology", hue: 306,
      core: { y2s1: ["BS2002", "BS2008"], y2s2: ["BS2012", "BS2018"],
              y3s1: ["BS3002", "BS3007"], y3s2: ["BS3012", "BS3017"] } },

    { id: "medical-biochemistry", name: "Medical Biochemistry", hue: 328,
      note: "Year 3 Semester 1 is fully prescribed.",
      core: { y2s1: ["BS2003", "BS2008"], y2s2: ["BS2013", "BS2014"],
              y3s1: ["BS3003", "BS3008", "BS3007"], y3s2: ["BS3013", "BS3017"] } },

    { id: "medical-physiology", name: "Medical Physiology", hue: 20,
      core: { y2s1: ["BS2004", "BS2008"], y2s2: ["BS2014", "BS2018"],
              y3s1: ["BS3004", "BS3007"], y3s2: ["BS3014", "BS3017"] } }
  ]
};
