# -*- coding: utf-8 -*-
"""Emit assets/data/curriculum.js from the rules transcribed out of the
2026-27 handbooks. Generated so the site cannot drift from the analysis."""
import json, pathlib

M = {}   # code -> (title, credits, year, semester, theme, flags)
def mod(code, title, cr, yr, sem, theme, **kw): M[code] = dict(title=title, credits=cr, year=yr, semester=sem, theme=theme, **kw)

# ---- Year 1. Year 1 takes no stream colour by derivation (every module is core
# for every degree), so each one carries an explicit `stream` instead, named for
# the subject it introduces. MB1080 is deliberately left without one.
y1 = [
 ("BS1030", 30, 1, "biochemistry",
  "The Molecules of Life \u2014 An Introduction to Biochemistry and Molecular Biology"),
 ("BS1040", 30, 1, "microbiology",
  "The Cell \u2014 An Introduction to Cell Biology and Microbiology"),
 ("BS1050", 15, 2, "genetics",
  "From Individuals to Populations \u2014 An Introduction to Genetics"),
 ("BS1060", 30, 2, "physiology",
  "Multicellular Organisation \u2014 An Introduction to Physiology, Pharmacology and Neuroscience"),
 ("BS1070", 15, 2, "zoology",
  "Biodiversity and Behaviour \u2014 An Introduction to Zoology"),
 ("MB1080", 15, 2, None,
  "Introduction to Medical Bioscience"),
]
for c, cr, sem, stream, title in y1:
    M[c] = dict(title=title, credits=cr, year=1, semester=sem, theme="year1")
    if stream:
        M[c]["stream"] = stream
M["BS1070"]["about"] = "Taken by every degree except the four Medical Sciences streams, which take MB1080 instead."
M["MB1080"]["about"] = "Taken only by the four Medical Sciences streams, in place of BS1070."

# `overview` is what "About the module:" shows in the details sheet — a
# list of bullet points, straight from the society, not the handbooks.
# A plain string is one bullet; {"text", "items"} is a bullet with its
# own sub-bullets. Modules with no `overview` show "N/A" instead — see
# assets/js/modulemap.js's details().
M["BS1030"]["overview"] = [
 "The study of the molecules of life — DNA, RNA & proteins",
 "How life works at a molecular level",
 "How the regulation of molecules defines how the cell works",
 "Molecular techniques",
]
M["BS1040"]["overview"] = [
 "From the origins of life, through its evolution to today’s biodiverse planet",
 "Viruses, bacteria, fungi, parasites, cells, disease, ecology and food",
 "How the molecules of life make cells work and interact with other cells",
]
M["BS1050"]["overview"] = [
 "How is genetic information passed on from generation to generation?",
 "How do populations evolve?",
 "How is genetics used in ancestry, forensics, conservation and biotechnology?",
 "How is genetics used to understand disease and improve health?",
]
M["BS1060"]["overview"] = [
 {"text": "The physiology and pharmacology of the human body:", "items": [
   "How cells maintain a constant environment for optimal function",
   "How individual organs work",
   "How the nervous system coordinates organ function to maintain homeostasis",
 ]},
]
M["BS1070"]["overview"] = [
 "Understand the diversity of animals and plants and adaptations to their environments – all in the context of evolution",
]
M["MB1080"]["overview"] = [
 {"text": "Learning how to use basic science and apply analytical methods to understand topics such as:", "items": [
   "The microbiome",
   "Cancer genomics",
   "Atherosclerosis",
 ]},
]

# ---- Year 2 (all 15 credits)
y2 = [
 ("BS2200","Research Skills 1",1,"skills"), ("BS2009","Genomes",1,"genetics"),
 ("BS2013","Physiology and Pharmacology",1,"physiology"), ("BS2015","Physiology of Excitable Cells",1,"physiology"),
 ("BS2030","Principles of Microbiology",1,"micro"), ("BS2059","Global Change Biology and Conservation",1,"ecology"),
 ("BS2093","Protein Structure and Function",1,"biochem"),
 ("BS2094","Introduction to Python Programming for Bioscientists",1,"skills"),
 ("MB2020","Medical Microbiology",1,"micro"),
 ("MB2050","Biochemical Approaches to Therapeutic Development",1,"biochem"),
 ("MB2051","Current Issues in Medical Genetics",1,"genetics"),
 ("BS2000","Research Skills 2",2,"skills"),
 ("BS2004","Contemporary Techniques in Biological Data Analysis",2,"skills"),
 ("BS2014","Exercise Physiology and Pharmacology",2,"physiology"),
 ("BS2026","Genes, Development and Inheritance",2,"genetics"),
 ("BS2032","Immunology and Eukaryotic Microbiology",2,"micro"),
 ("BS2033","Immunology and Eukaryotic Microbiology (with Science Enterprise Trip)",2,"micro"),
 ("BS2040","Bioinformatics",2,"genetics"), ("BS2066","Behavioural Neurobiology",2,"neuro"),
 ("BS2077","Neurobiology and Animal Behaviour",2,"neuro"), ("BS2078","A Field Guide to Evolution",2,"ecology"),
 ("BS2091","From Genes to Proteins",2,"biochem"), ("BS2092","Molecular and Cell Biology",2,"biochem"),
 ("MB2080","Pathophysiology of Disease",2,"physiology"),
]
for c,t,s,th in y2: mod(c,t,15,2,s,th)
for c in ("BS2033","BS2059","BS2078"): M[c]["field"] = True
M["BS2094"]["about"] = "Capped at 30 students, allocated first come first served."
M["BS2033"]["about"] = "Limited to 20 students; priority to those taking both BS2030 and MB2020."

# ---- Year 3 (all 15 credits except the project)
y3 = [
 ("BS3000","Evolutionary Genetics",1,"genetics"),
 ("BS3010","Gene Expression: Molecular Basis & Medical Relevance",1,"genetics"),
 ("BS3015","Molecular & Cellular Immunology",1,"micro"), ("BS3031","Human Genetics",1,"genetics"),
 ("BS3038","Biodiversity in Practice",1,"ecology"), ("BS3054","Molecular and Cellular Pharmacology",1,"physiology"),
 ("BS3055","Molecular and Cellular Neuroscience",1,"neuro"), ("BS3064","Comparative Neurobiology",1,"neuro"),
 ("BS3068","Microbial Biotechnology",1,"micro"), ("BS3070","Structural Biology",1,"biochem"),
 ("NT3100","Sustainability Enterprise Partnership Project",1,"skills"),
 ("BS3003","Cancer Cell and Molecular Biology",2,"biochem"),
 ("BS3011","Microbial Pathogenesis and Genomics",2,"micro"),
 ("BS3013","Human and Environmental Microbiomics",2,"micro"),
 ("BS3016","Neuroscience Futures",2,"neuro"), ("BS3033","Physiology, Pharmacology and Behaviour",2,"physiology"),
 ("BS3056","Cellular Physiology of the Cardiovascular System",2,"physiology"),
 ("BS3069","Introduction to Astrobiology and the Origin of Life",2,"ecology"),
 ("BS3073","Conservation and Ecological Genetics",2,"ecology"), ("BS3080","Behavioural Ecology",2,"ecology"),
 ("MB3001","Biochemical Mechanisms of Human Disease",2,"biochem"),
 ("MB3020","Advanced Topics in Medical Microbiology",2,"micro"), ("MB3050","Medical Genetics",2,"genetics"),
 ("MB3057","Current and Future Therapeutics",2,"physiology"),
 ("NT3200","Sustainability Enterprise Partnership Project",2,"skills"),
]
for c,t,s,th in y3: mod(c,t,15,3,s,th)
M["BS3080"]["field"] = True
M["BS3013"]["about"] = "Listed as “Human and Environmental Microbiology” in the degree tables and “… Microbiomics” in the module lists."
mod("BS3PROJ","Research Project",30,3,1,"skills", display="Project", linked="project",
    about="45 credits across the year. The handbooks describe it as a 15-credit practical module plus a 30-credit written and oral module that runs across both semesters, assessed entirely in semester 2.")
mod("BS3PROJB","Research Project",15,3,2,"skills", display="Project", linked="project",
    about="The semester 2 half of the 45-credit year-long project.")

CLASH = [
 ["BS2015","BS2030"],["BS2093","MB2020"],["MB2050","MB2051"],
 ["BS2032","BS2033"],["BS2032","BS2066"],["BS2032","BS2077"],
 ["BS2033","BS2066"],["BS2033","BS2077"],["BS2066","BS2077"],["BS2078","MB2080"],
 ["BS3000","BS3010"],["BS3000","BS3015"],["BS3010","BS3015"],["BS3000","BS3054"],
 ["BS3010","BS3064"],["BS3015","BS3064"],["BS3031","BS3038"],["BS3031","BS3055"],
 ["BS3031","BS3064"],["BS3031","BS3068"],["BS3038","BS3054"],["BS3038","BS3064"],
 ["BS3054","BS3068"],["BS3064","BS3068"],
 ["BS3003","BS3073"],["BS3003","BS3080"],["BS3011","BS3016"],["BS3011","BS3056"],
 ["BS3011","BS3080"],["BS3013","BS3016"],["BS3056","BS3073"],["BS3056","BS3080"],
 ["BS3069","MB3057"],["MB3001","MB3020"],["MB3001","MB3050"],["MB3001","MB3057"],
 ["MB3020","MB3050"],["MB3020","MB3057"],["MB3050","MB3057"],
]

MED = ["medical-physiology","medical-biochemistry","medical-genetics","medical-microbiology"]
NAMES = {
 "biological-sciences":"Biological Sciences","zoology":"Zoology","neuroscience":"Neuroscience",
 "physiology-pharmacology":"Physiology with Pharmacology","medical-physiology":"Medical Physiology",
 "biochemistry":"Biochemistry","medical-biochemistry":"Medical Biochemistry",
 "genetics":"Genetics","medical-genetics":"Medical Genetics",
 "microbiology":"Microbiology","medical-microbiology":"Medical Microbiology",
}
HUE = {"biological-sciences":150,"zoology":96,"neuroscience":264,"physiology-pharmacology":218,
 "medical-physiology":20,"biochemistry":202,"medical-biochemistry":328,"genetics":168,
 "medical-genetics":286,"microbiology":186,"medical-microbiology":306}

# core / options per slot, straight from the handbook tables
D = {
 "biological-sciences": dict(
  y2s1c=["BS2200"], y2s1o=["BS2009","BS2013","BS2015","BS2030","BS2059","BS2093","BS2094","MB2020"],
  y2s2c=["BS2000"], y2s2o=["BS2004","BS2014","BS2026","BS2032","BS2033","BS2040","BS2066","BS2077","BS2078","BS2091","BS2092"],
  y3s1c=[], y3s1o=["BS3000","BS3010","BS3015","BS3031","BS3038","BS3054","BS3055","BS3064","BS3068","BS3070","NT3100"],
  y3s2c=[], y3s2o=["BS3003","BS3011","BS3013","BS3016","BS3033","BS3056","BS3069","BS3073","BS3080","NT3200"]),
 "physiology-pharmacology": dict(
  y2s1c=["BS2200","BS2013","BS2015"], y2s1o=["BS2009","BS2030","BS2059","BS2093","BS2094","MB2020"],
  y2s2c=["BS2000","BS2014"], y2s2o=["BS2004","BS2026","BS2032","BS2033","BS2040","BS2066","BS2077","BS2078","BS2091","BS2092"],
  y3s1c=["BS3054"], y3s1o=["BS3055","BS3000","BS3010","BS3015","BS3031","BS3038","BS3064","BS3068","BS3070","NT3100"],
  y3s2c=["BS3056"], y3s2o=["BS3033","MB3057","BS3003","BS3011","BS3013","BS3016","BS3069","BS3073","BS3080","NT3200"],
  groups=[dict(label="Choose two or three from", min=2, max=3, members=["BS3055","BS3033","MB3057"])]),
 "neuroscience": dict(
  y2s1c=["BS2200","BS2013","BS2015"], y2s1o=["BS2009","BS2030","BS2059","BS2093","BS2094","MB2020"],
  y2s2c=["BS2000","BS2066"], y2s2o=["BS2004","BS2014","BS2026","BS2032","BS2033","BS2040","BS2078","BS2091","BS2092"],
  y3s1c=["BS3055"], y3s1o=["BS3054","BS3064"],
  y3s2c=["BS3016","BS3033"], y3s2o=["BS3003","BS3011","BS3013","BS3056","BS3069","BS3073","BS3080","MB3057","NT3200"]),
 "biochemistry": dict(
  y2s1c=["BS2200","BS2093"], y2s1o=["BS2009","BS2013","BS2015","BS2030","BS2059","BS2094","MB2020"],
  y2s2c=["BS2000","BS2091","BS2092"], y2s2o=["BS2004","BS2014","BS2026","BS2032","BS2033","BS2040","BS2066","BS2077","BS2078"],
  y3s1c=["BS3010","BS3070"], y3s1o=[],
  y3s2c=["BS3003"], y3s2o=["BS3011","BS3013","BS3016","BS3033","BS3056","BS3069","BS3073","BS3080","NT3200"]),
 "genetics": dict(
  y2s1c=["BS2200","BS2009"], y2s1o=["BS2013","BS2015","BS2030","BS2059","BS2093","BS2094","MB2020"],
  y2s2c=["BS2000","BS2026","BS2040"], y2s2o=["BS2004","BS2014","BS2032","BS2033","BS2066","BS2077","BS2078","BS2091","BS2092"],
  y3s1c=["BS3000","BS3031"], y3s1o=[],
  y3s2c=[], y3s2o=["BS3011","BS3073","BS3003","BS3013","BS3016","BS3033","BS3056","BS3069","BS3080","NT3200"],
  groups=[dict(label="Choose one or two from", min=1, max=2, members=["BS3011","BS3073"])]),
 "microbiology": dict(
  y2s1c=["BS2200","BS2030","MB2020"], y2s1o=["BS2009","BS2013","BS2015","BS2059","BS2093","BS2094"],
  y2s2c=["BS2000"], y2s2alt=[["BS2032","BS2033"]],
  y2s2o=["BS2004","BS2014","BS2026","BS2040","BS2066","BS2077","BS2091","BS2092"],
  y3s1c=[], y3s1o=["BS3015","BS3068","BS3000","BS3010","BS3031","BS3038","BS3054","BS3055","BS3064","BS3070","NT3100"],
  y3s2c=[], y3s2o=["BS3011","BS3013","BS3003","BS3016","BS3033","BS3056","BS3069","BS3073","BS3080","NT3200"],
  groups=[dict(label="Choose three or four from", min=3, max=4, members=["BS3015","BS3068","BS3011","BS3013"])]),
 "zoology": dict(
  y2s1c=["BS2200","BS2059"], y2s1o=["BS2009","BS2013","BS2015","BS2030","BS2093","BS2094","MB2020"],
  y2s2c=["BS2000","BS2026","BS2077"], y2s2o=["BS2004","BS2014","BS2032","BS2033","BS2040","BS2078"],
  y3s1c=[], y3s1o=["BS3038","BS3064","BS3000","BS3010","BS3015","BS3031","BS3054","BS3055","BS3068","BS3070","NT3100"],
  y3s2c=["BS3073"], y3s2o=["BS3003","BS3011","BS3013","BS3016","BS3033","BS3056","BS3069","BS3080","NT3200"],
  groups=[dict(label="Choose one from", min=1, max=1, members=["BS3038","BS3064"])]),
 "medical-biochemistry": dict(
  y2s1c=["BS2200","BS2093","MB2050"], y2s1o=["BS2009","BS2013","BS2015","BS2030","BS2094","MB2020"],
  y2s2c=["BS2000","BS2091","BS2092"], y2s2o=["BS2004","BS2014","BS2026","BS2032","BS2033","BS2040","BS2066","BS2077","BS2078"],
  y3s1c=["BS3010"], y3s1o=["BS3070","BS3000","BS3015","BS3031","BS3038","BS3054","BS3055","BS3064","BS3068","NT3100"],
  y3s2c=["MB3001"], y3s2o=["BS3003","BS3011","BS3013","BS3016","BS3033","BS3056","BS3069","NT3200"],
  groups=[dict(label="Choose one or two from", min=1, max=2, members=["BS3070","BS3003"])]),
 "medical-genetics": dict(
  y2s1c=["BS2200","BS2009","MB2051"], y2s1o=["BS2013","BS2015","BS2030","BS2093","BS2094","MB2020"],
  y2s2c=["BS2000","BS2026","BS2040"], y2s2o=["BS2004","BS2014","BS2032","BS2033","BS2066","BS2077","BS2091","BS2092"],
  y3s1c=["BS3000","BS3031"], y3s1o=[],
  y3s2c=["MB3050","BS3011"], y3s2o=["BS3003","BS3013","BS3016","BS3033","BS3056","BS3069","NT3200"]),
 "medical-microbiology": dict(
  y2s1c=["BS2200","BS2030","MB2020"], y2s1o=["BS2009","BS2013","BS2059","BS2093","BS2094"],
  y2s2c=["BS2000"], y2s2alt=[["BS2032","BS2033"]],
  y2s2o=["BS2004","BS2014","BS2026","BS2040","BS2066","BS2077","BS2091","BS2092"],
  y3s1c=[], y3s1o=["BS3015","BS3068","BS3000","BS3010","BS3031","BS3038","BS3054","BS3055","BS3064","BS3070","NT3100"],
  y3s2c=["MB3020"], y3s2o=["BS3011","BS3013","BS3003","BS3016","BS3033","BS3056","BS3069","NT3200"],
  groups=[dict(label="Choose three or four from", min=3, max=4, members=["BS3015","BS3068","BS3011","BS3013"])]),
 "medical-physiology": dict(
  y2s1c=["BS2200","BS2013","BS2015"], y2s1o=["BS2009","BS2059","BS2093","BS2094","MB2020"],
  y2s2c=["BS2000","BS2014","MB2080"], y2s2o=["BS2004","BS2026","BS2032","BS2033","BS2040","BS2066","BS2077","BS2092"],
  y3s1c=[], y3s1o=["BS3054","BS3055","BS3000","BS3010","BS3015","BS3031","BS3038","BS3064","BS3068","BS3070","NT3100"],
  y3s2c=["MB3057"], y3s2o=["BS3033","BS3056","BS3003","BS3011","BS3013","BS3016","BS3069","BS3073","BS3080","NT3200"],
  groups=[dict(label="Choose three or four from", min=3, max=4, members=["BS3054","BS3055","BS3033","BS3056"])]),
}

SLOTS = ["y1s1","y1s2","y2s1","y2s2","y3s1","y3s2"]
degrees = []
DEGREE_IDS = ["biological-sciences","zoology","neuroscience","physiology-pharmacology","medical-physiology",
              "biochemistry","medical-biochemistry","genetics","medical-genetics","microbiology","medical-microbiology"]
for did in DEGREE_IDS:
    d = D[did]; med = did in MED
    core = {"y1s1":["BS1030","BS1040"], "y1s2":["BS1050","BS1060","MB1080" if med else "BS1070"],
            "y2s1":d["y2s1c"], "y2s2":d["y2s2c"],
            "y3s1":["BS3PROJ"]+d["y3s1c"], "y3s2":["BS3PROJB"]+d["y3s2c"]}
    opts = {"y1s1":[], "y1s2":[], "y2s1":d["y2s1o"], "y2s2":d["y2s2o"], "y3s1":d["y3s1o"], "y3s2":d["y3s2o"]}
    entry = dict(id=did, name=NAMES[did], hue=HUE[did], core=core, options=opts)
    if "y2s2alt" in d: entry["coreOneOf"] = {"y2s2": d["y2s2alt"]}
    if "groups" in d: entry["groups"] = d["groups"]
    degrees.append(entry)

# a module every degree holds as core is School-wide core, whatever its stream
for code in M:
    if all(any(code in d["core"][s] for s in SLOTS) or
           any(code in g for gs in d.get("coreOneOf", {}).values() for g in gs)
           for d in degrees):
        M[code]["schoolCore"] = True

def jd(o): return json.dumps(o, ensure_ascii=False)

out = ['''/* =============================================================
   School of Biological Sciences — module catalogue, 2026-27.

   Years 2 and 3 are transcribed from the four School handbooks:
     Year 2 Biological Sciences 2026-27
     Year 2 Medical Sciences 2026-27 (v2)
     Year 3 Biological Sciences 2026-27 (v3)
     Year 3 Medical Sciences 2026-27 (v2.1)
   Year 1 codes, credits and titles came from the society.

   Where the handbooks disagree, the Year 3 handbooks were taken as
   authoritative for Year 3 (the Year 2 booklets label their third-year
   tables "provisional"). Differences are listed in README.md.

   SCHEMA
   ------
   module:  { code, title?, credits, year, semester, theme, about?,
              overview?, display?, linked?, field?, stream? }
              stream   names a stream colour outright, instead of deriving it
                       from which degrees hold the module as core
              schoolCore  true when every degree holds it as core (generated)
              overview a list of bullet points for "About the module:" in
                       the details sheet — a plain string is one bullet,
                       {text, items} is a bullet with its own sub-bullets.
                       No `overview` shows "N/A" instead. From the society,
                       not the handbooks.
   degree:  { id, name, hue, core, options, coreOneOf?, groups? }
              core      required per slot, keyed y1s1 … y3s2
              options   what the handbook lists as choosable in that slot
              coreOneOf alternatives of which exactly one is compulsory
              groups    the handbook's "choose N from" sets: {label, min, max, members}
   A module that is neither core nor in `options` is not available to
   that degree. `clashes` lists pairs the handbooks' clash grids mark as
   untimetableable together.
   ============================================================= */
window.BIOSOC_CURRICULUM = {
  meta: {
    sampleData: false,
    school: "School of Biological Sciences",
    session: "2026-27",
    creditsPerSemester: 60,

    /* Subject-stream colours, sampled from the School's own module key.
       Listed in the precedence order used when a module is core for more
       than one stream: physiology, neuroscience, biochemistry, genetics,
       microbiology, zoology. A stream's Medical counterpart shares its
       colour. `uncoloured` names modules that take no stream colour even
       though they are core — they are core for everyone, so colouring them
       would say nothing about the stream. Year 1 is excluded wholesale. */
    streams: [
      { id: "physiology",   label: "Physiology",   colour: "#ff99ff",
        degrees: ["physiology-pharmacology", "medical-physiology"] },
      { id: "neuroscience", label: "Neuroscience", colour: "#9999ff",
        degrees: ["neuroscience"] },
      { id: "biochemistry", label: "Biochemistry", colour: "#66ffcc",
        degrees: ["biochemistry", "medical-biochemistry"] },
      { id: "genetics",     label: "Genetics",     colour: "#ff9966",
        degrees: ["genetics", "medical-genetics"] },
      { id: "microbiology", label: "Microbiology", colour: "#ccff66",
        degrees: ["microbiology", "medical-microbiology"] },
      { id: "zoology",      label: "Zoology",      colour: "#33cc33",
        degrees: ["zoology"] }
    ],
    /* `school` is for modules every single degree must take */
    neutral: { core: "#bfbfbf", plain: "#f2f2f2", school: "#1b6b3a", schoolInk: "#eaf5ee" },
    uncoloured: ["BS2200", "BS2000", "BS3PROJ", "BS3PROJB", "BS2004", "BS2094"],

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

  /* pairs the handbooks' clash grids mark as impossible to timetable together */
  clashes: [''']
for a,b in CLASH: out.append('    ["%s", "%s"],' % (a,b))
out[-1] = out[-1].rstrip(",")
out.append("  ],\n\n  modules: [")
for code in sorted(M, key=lambda c: (M[c]["year"], M[c]["semester"], "0" if M[c].get("linked") else "1", c)):
    m = M[code]; parts = ['code: %s' % jd(code)]
    if m.get("display"): parts.append("display: %s" % jd(m["display"]))
    if m["title"]: parts.append("title: %s" % jd(m["title"]))
    parts += ["credits: %d" % m["credits"], "year: %d" % m["year"], "semester: %d" % m["semester"],
              "theme: %s" % jd(m["theme"])]
    if m.get("stream"): parts.append("stream: %s" % jd(m["stream"]))
    if m.get("schoolCore"): parts.append("schoolCore: true")
    if m.get("linked"): parts.append("linked: %s" % jd(m["linked"]))
    if m.get("field"): parts.append("field: true")
    line = "    { " + ", ".join(parts)
    tail = []
    if m.get("about"): tail.append("about: %s" % jd(m["about"]))
    if m.get("overview"): tail.append("overview: %s" % jd(m["overview"]))
    if tail:
        out.append(line + ",")
        for i, t in enumerate(tail):
            out.append("      " + t + ("," if i < len(tail) - 1 else " },"))
    else:
        out.append(line + " },")
out[-1] = out[-1].rstrip(",")
out.append("  ],\n\n  degrees: [")
for d in degrees:
    out.append('    { id: %s, name: %s, hue: %d,' % (jd(d["id"]), jd(d["name"]), d["hue"]))
    out.append('      core: { ' + ",\n              ".join('%s: %s' % (s, jd(d["core"][s])) for s in SLOTS) + ' },')
    tail = ' },' 
    out.append('      options: { ' + ",\n                 ".join('%s: %s' % (s, jd(d["options"][s])) for s in SLOTS) + ' }' + ("," if ("coreOneOf" in d or "groups" in d) else tail))
    if "coreOneOf" in d:
        out.append('      coreOneOf: %s%s' % (jd(d["coreOneOf"]), "," if "groups" in d else tail))
    if "groups" in d:
        out.append('      groups: %s%s' % (jd(d["groups"]), tail))
out[-1] = out[-1].rstrip(",")
out.append("  ]\n};")
pathlib.Path("assets/data/curriculum.js").write_text("\n".join(out) + "\n", encoding="utf-8")
print("modules:", len(M), " degrees:", len(degrees), " clashes:", len(CLASH))
