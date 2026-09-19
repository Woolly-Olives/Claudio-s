# Module-combination problems in the 2026-27 handbooks

Findings from transcribing all four handbooks into `assets/data/curriculum.js`
and checking the rules mechanically:

- **Year 2 Biological Sciences 2026-27** (34 pp.)
- **Year 2 Medical Sciences 2026-27 v2** (20 pp.)
- **Year 3 Biological Sciences 2026-27 v3** (24 pp.)
- **Year 3 Medical Sciences 2026-27 v2.1** (14 pp.)

Every degree in all four booklets **can** be completed — an exhaustive search
found at least one legal timetable for each. The problems below are option lists
that cannot be used, arithmetic that does not add up, and places where the
booklets contradict each other.

Nothing here has been reported to the School. Check each point before passing it
on: this is a reading of the documents, not an authority on what the School
intends.

---

## A. Outright errors

### A1. Medical Microbiology, Year 2 Semester 2 adds up to 75 credits

*Year 2 Medical Sciences, p. 13.* The page states "each semester must add up to
60 credits", then lists:

| | credits |
| --- | --- |
| BS2000 Research Skills 2 (core) | 15 |
| One of BS2032 / BS2033 (core) | 15 |
| **OPTIONS (choose 3)** | **45** |
| | **75** |

It should read **choose 2**. Biological Sciences (Microbiology), which has the
identical core for that semester, correctly says "choose 2" (Year 2 Biological
Sciences, p. 26). With "choose 2" there are 30 clash-free combinations.

### A2. Zoology, Year 3 Semester 1 offers a combination that clashes

*Year 2 Biological Sciences, p. 32* offers "**CHOOSE 1 OR 2 FROM:** BS3038
Biodiversity in Practice, BS3064 Comparative Neurobiology". The Year 3 clash
grid marks **BS3038 × BS3064 as a clash**, so "2" is never possible. The Year 3
handbook (p. 20) says "CHOOSE 1 FROM", which is right — but a student planning
from the Year 2 booklet is told otherwise.

### A3. Both Year 3 clash grids have mismatched row and column labels

Neither Semester 2 grid is square, and each is wrong in a different way:

- **Year 3 Biological Sciences, p. 22** — rows include **BS3038**, a *Semester 1*
  module, which has no column. Its row is entirely blank.
- **Year 3 Medical Sciences, p. 14** — **BS3038** appears as a *column* with no
  row, while **BS3080** has a row with no column. BS3080's clashes therefore
  cannot be cross-checked against its column, and the diagonal is offset from
  the BS3056 row onwards.

BS3038 belongs only in the Semester 1 grid; BS3080 should appear in both the
rows and the columns of the Semester 2 grid.

### A4. Undefined grey shading in the Year 3 Medical clash grid

*Year 3 Medical Sciences, p. 14.* The legend defines only "a black square …
indicates a clash" and "a blank square indicates that these two modules may be
taken together". Six cells are shaded **grey**: BS3073 and BS3080 against
MB3001, MB3020 and MB3050. A student cannot tell whether those combinations are
permitted. The Biological Sciences grid has no equivalent shading.

### A5. The project's credit split is described two ways

Both Year 3 handbooks say the project is "split into a 15-credit module for the
practical aspect … and a 30-credit module which will address the written and
oral parts", and that "the 30-credit module is split over semester 1 and
semester 2", assessed entirely in semester 2. But **every** degree table shows
"Research Project (30cr)" under Semester 1 and "Research Project (15cr)" under
Semester 2, which implies the 30-credit component sits wholly in Semester 1.
The two descriptions cannot both be literally true.

### A6. Smaller errors

| Where | Problem |
| --- | --- |
| Y3 Bio p. 14 (Genetics) | "BS22026" — should be BS2026 |
| Y3 Bio p. 19 | "BIOLGICAL SCIENCES (NEUROSCIENCE)" |
| Y3 Med p. 14 | "Aa black square" |
| All four, third-year module lists | BS3073's recommended modules include **BS2076**, which is not in any Year 2 module list |
| Y2 Bio p. 12 vs pp. 22, 28 | Dr Swidbert Ott is given as `rso11@le.ac.uk` for Biological Sciences and `so120@le.ac.uk` for Genetics and Zoology |
| Y2 Bio p. 7 vs Y2 Med p. 5 | BS2033 (London) costed at ~£180 and ~£200 respectively |
| Y3 Bio pp. 22, 23 | Two consecutive pages both printed "22"; no page 21 |
| Y3 Med | Printed page numbers run 8, 9, 10, 11, then 14 |
| Y2 Bio, Y2 Med | "Clash boxes on page 31 / 17" — the Semester 2 grid is on the *following* page in both |
| Y3 Med degree pages | "Clash boxes on page 12" — they are on the page printed 14 |

---

## B. Options that can never be taken

These are listed as choices but clash with a module that is **compulsory on the
same degree**, so no student on that degree can ever take them. 15 in Year 2 and
24 in Year 3.

### Year 2

| Degree | Sem | Dead option | Clashes with core |
| --- | --- | --- | --- |
| Physiology with Pharmacology | 1 | BS2030 | BS2015 |
| Neuroscience | 1 | BS2030 | BS2015 |
| Neuroscience | 2 | BS2032, BS2033 | BS2066 |
| Biochemistry | 1 | MB2020 | BS2093 |
| Microbiology | 1 | BS2015 | BS2030 |
| Microbiology | 1 | BS2093 | MB2020 |
| Microbiology | 2 | BS2066, BS2077 | BS2032 / BS2033 (one is compulsory) |
| Zoology | 2 | BS2032, BS2033 | BS2077 |
| Medical Biochemistry | 1 | MB2020 | BS2093 |
| Medical Microbiology | 1 | BS2093 | MB2020 |
| Medical Microbiology | 2 | BS2066, BS2077 | BS2032 / BS2033 (one is compulsory) |

### Year 3

| Degree | Dead options | Reason |
| --- | --- | --- |
| Physiology with Pharmacology | BS3000, BS3038, BS3068 | clash with core BS3054 |
| Physiology with Pharmacology | BS3011, BS3073, BS3080 | clash with core BS3056 |
| Neuroscience | BS3011, BS3013 | clash with core BS3016 |
| Biochemistry | BS3073, BS3080 | clash with core BS3003 |
| Genetics | BS3056 | clashes with both BS3011 and BS3073, one of which is compulsory |
| Microbiology | BS3064, BS3016 | no legal selection of the "choose 3 or 4" group leaves room |
| Zoology | BS3003, BS3056 | clash with core BS3073 |
| Zoology | BS3031 | clashes with both BS3038 and BS3064, one of which is compulsory |
| Medical Biochemistry | BS3000, BS3015, BS3064 | clash with core BS3010 |
| Medical Genetics | BS3016, BS3056 | clash with core BS3011 |
| Medical Microbiology | BS3064, BS3016 | as Microbiology |
| Medical Physiology | BS3069 | clashes with core MB3057 |

**The School is already doing this correctly in places**, which is what makes the
omissions look like oversights rather than policy:

- Neuroscience Year 2 Semester 2 leaves **BS2077** out of its options because it
  clashes with core BS2066 — but leaves **BS2032 and BS2033** in, which clash
  with BS2066 just as surely.
- Medical Microbiology Year 2 Semester 1 leaves **BS2015** out because it clashes
  with core BS2030. Biological Sciences (Microbiology), with the same core,
  lists it.

### How much choice is actually left

| Degree | Y2 Sem 1 | Y2 Sem 2 |
| --- | --- | --- |
| Biological Sciences | 8/8 usable, 44 combinations | 11/11, 119 |
| Physiology with Pharmacology | 5/6, 5 | 10/10, 39 |
| Neuroscience | 5/6, 5 | 7/9, 21 |
| Biochemistry | 6/7, 14 | 9/9, 9 |
| Genetics | 7/7, 19 | 9/9, 9 |
| Microbiology | 4/6, 4 | 6/8, 30 |
| Zoology | 7/7, 19 | 4/6, 4 |
| Medical Biochemistry | 5/6, 5 | 9/9, 9 |
| Medical Genetics | 6/6, 6 | 8/8, 8 |
| Medical Microbiology | 4/5, 4 | 6/8, 40 |
| Medical Physiology | 5/5, 5 | 8/8, 8 |

Whole-year-3 legal timetables, per degree: Biological Sciences 2,747; Zoology
216; Microbiology 91; Medical Biochemistry 67; Genetics 28; Medical Physiology
26; Medical Microbiology 22; Biochemistry 18; Physiology with Pharmacology 16;
Neuroscience 14; **Medical Genetics 5**.

---

## C. Where the handbooks disagree with each other

1. **Third-year module master lists.** Year 2 Biological Sciences (p. 9) lists
   MB3001, MB3020 and MB3050 as available third-year modules and omits
   NT3100/NT3200. Year 3 Biological Sciences (p. 22) does the reverse. Neither
   list matches the degree tables in its own booklet.

2. **Second-year master list vs the degree tables.** Year 2 Biological Sciences
   (p. 8) lists MB2050, MB2051 and MB2080 as second-year modules, but no
   Biological Sciences degree in that booklet offers any of them. MB2020, by
   contrast, *is* offered. A Biological Sciences student reading the master list
   would reasonably think all four were open to them.

3. **"Any combination of modules is acceptable."** Said of C100 Biological
   Sciences on p. 10 of the Year 2 booklet and p. 7 of the Year 3 booklet — and
   contradicted two pages later by option tables that omit the MB modules
   entirely, and by the clash grids.

4. **BS3013's title.** "Human and Environmental **Microbiomics**" in every
   module list; "Human and Environmental **Microbiology**" in every degree table.

5. **Zoology Year 3 Semester 1** — see A2.

---

## D. Presentation

- **BS2059 Global Change Biology and Conservation** is a Semester 1 module whose
  field course runs in **June**, after Semester 2 teaching ends. Stated plainly
  in the booklets, but worth a footnote on the module itself.
- The clash grids are the single most consequential page in each booklet and are
  the only page with no worked example. A student has to cross-reference them
  against their degree table by hand; §B is what falls out when you do that
  systematically.
- The "choose three or four from" groups that straddle both semesters
  (Physiology with Pharmacology, Microbiology, Medical Microbiology, Medical
  Physiology) are correct but hard to follow, because choosing a Semester 2
  member changes how many Semester 1 options you are entitled to.
