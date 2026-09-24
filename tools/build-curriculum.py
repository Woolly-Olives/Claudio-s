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

# ---- Year 2 module detail sections (Module Convenors / Aims / Learning
# Outcomes / Method of Assessment), transcribed verbatim from Y2_module_
# descriptions_2026-27.pdf. `aims`/`learningOutcomes`/`assessment` are each a
# list of blocks: {"type": "p", "text": ...} is a paragraph, {"type": "ul"|
# "ol", "items": [...]} is a bulleted or numbered list — mirroring how the
# source lays the text out. A module with no such label in the source has no
# `aims`/`learningOutcomes`/`assessment` key at all — the details sheet shows
# "N/A". `convenors` is a plain list of "Name (email)" strings.
M["BS2200"]["convenors"] = [
  "Dr Nicola Suter-Giorgini (nms2@le.ac.uk)",
  "Dr Alix Blockley (adb40@le.ac.uk)",
]
M["BS2200"]["aims"] = [
  {"type": "p", "text": "This module aims to provide students with experience of working in a team to produce an issue of a magazine based around some aspect of the Sustainable development goals (SDGs), to learn about Experimental design and Bioethics, to gain skills in researching and understanding scientific papers and in writing for a lay audience and to present information in different formats."},
]
M["BS2200"]["learningOutcomes"] = [
  {"type": "p", "text": "On successful completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Search effectively for information using online databases and utilise the information to plan and develop a specific research question.",
    "Demonstrate an understanding of the ethical implications and associated regulatory requirements of different types of biological research.",
    "Show an understanding of experimental design principles",
    "Explain complex information to a lay audience",
    "Reflect on and articulate motivations, strengths and skills, including teamwork, in relation to future employment and apply the concepts and rationale of Sustainable Development Goals, targets and indicators, involving real-world, biologically-based examples.",
  ]},
]
M["BS2200"]["assessment"] = [
  {"type": "p", "text": "This module is continuously assessed, with no final exam. The module marks are based on an individual article and infographic (45%), a team-written editorial and magazine issue (20%), an ethics and experimental design test (30%) and completion of a reflective portfolio (5%)."},
]

M["BS2009"]["convenors"] = [
  "Dr Celia May (cam5@le.ac.uk)",
  "Prof David Twell (twe@le.ac.uk)",
]
M["BS2009"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to illustrate how the techniques of modern molecular genetics are being applied to investigate the organisation, evolution and the maintenance of the integrity of genomes, as well as provide “hands on” experience of many of the relevant techniques through practical sessions. A wide range of genomes are considered including those of bacteria, yeast, plants, insects and humans."},
]
M["BS2009"]["learningOutcomes"] = [
  {"type": "p", "text": "On successful completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Differentiate the organisation and function of prokaryotic and eukaryotic genomes.",
    "Recognise the molecular pathways responsible for maintaining genome integrity.",
    "Identify natural processes driving genetic variation between genomes.",
    "Apply core genomic principles to problem-solving and data interpretation.",
    "Evaluate experimental data critically and formulate reasoned conclusions.",
    "Perform fundamental bioinformatics analyses to explore and interpret genomic data.",
  ]},
]
M["BS2009"]["assessment"] = [
  {"type": "p", "text": "60% of the module mark will be based on the January End of Module Assessment. 40% of the module mark will come from coursework based on the Practical Programme."},
]

M["BS2013"]["convenors"] = [
  "Dr Saba Imanzadeh (si149@le.ac.uk)",
  "Professor Martyn Mahaut-Smith (mpms1@le.ac.uk)",
]
M["BS2013"]["aims"] = [
  {"type": "p", "text": "To provide a basic understanding of the molecular mechanisms by which hormones, neurotransmitters and growth factors (agonists) that act at cell surface or intracellular receptors are capable of regulating the physiological function of individual cells. Understanding how drugs can either mimic or antagonise the effects of agonists will provide you with an appreciation of the therapeutic basis for the treatment of various disorders. A particular focus will be on the physiology and regulation of the cardiovascular system."},
]
M["BS2013"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "describe the basic structure of the various classes of cellular receptors",
    "explain the intracellular signalling pathways regulated by such receptors",
    "provide examples of receptors that possess multiple subtypes for a given hormone or neurotransmitter (agonist) and discuss the physiological basis for this",
    "undertake a quantitative analysis of drug-receptor interactions and interpret the information",
    "understand how drugs can modify agonist-receptor interactions and be able to quantitate these effects",
    "discuss the mechanisms by which drugs can modify the function of the cardiovascular system to treat disease states such as hypertension",
    "plan and analyse experiments that address the sites and mechanisms of drug action",
  ]},
]
M["BS2013"]["assessment"] = [
  {"type": "p", "text": "The end of module assessment contributes 60% of the total marks for the module. It will consist of questions requiring an answer of varying length (typically 150 words for short answer format and 500 words for an essay) together with multiple choice style questions. Course work will provide the remaining 40% of the marks for the module and consist of assessment of the practical component. You will be expected to meet the strict deadlines for submission of course work."},
]

M["BS2015"]["convenors"] = [
  "Dr Paul Glynn (pg8@le.ac.uk)",
  "Dr Volko Straub (vs64@le.ac.uk)",
  "Dr Emily Allen (ew150@le.ac.uk)",
]
M["BS2015"]["learningOutcomes"] = [
  {"type": "p", "text": "BS2015 extends material from BS1060 and aims to develop the student’s understanding of:"},
  {"type": "ul", "items": [
    "structure, organisation, and function of the nervous system and its components.",
    "qualitative and quantitative aspects of membrane excitability, ion channel function, and axonal conduction.",
    "transmission at, and pharmacology of, chemical synapses.",
    "qualitative and quantitative aspects of integration at synapses; synaptic plasticity.",
    "the physiology of vision, to demonstrate how the nervous system adapts or mal-adjusts in response to external factors.",
  ]},
  {"type": "p", "text": "In addition, BS2015 entails use of, and so aims to enhance the student’s facility with, transferable skills: numeracy; data-handling/analysis; concise written communication."},
]
M["BS2015"]["assessment"] = [
  {"type": "ul", "items": [
    "Essay (block 1)",
  ]},
  {"type": "p", "text": "25% of module mark"},
  {"type": "ul", "items": [
    "Work-session Report (block 3)",
  ]},
  {"type": "p", "text": "25% of module mark."},
  {"type": "ul", "items": [
    "End of Module Assessment: Data handling, calculations and short-answer questions (blocks 2, 4, 5) 50% of module  mark.",
  ]},
]

M["BS2030"]["convenors"] = [
  "Dr Hasan Yesilkaya (hy3@le.ac.uk)",
]
M["BS2030"]["aims"] = [
  {"type": "p", "text": "We share our world and body with a large number of microbes invisible to the naked eye. They existed on Earth before us, and they survive almost everywhere: on our skin, in hot and cold places, and on rocks and in ice. They can make us sick but they can also make us healthy and happy by contributing to the production of medicines, flavorsome food and drink and by cycling carbon and nitrogen. Life would not exist without microbes. How much do you know of microbes? Do you think they gossip and sense their environment? What they ‘eat’ and how do they do their vital functions? How do they spread to cause pandemics?"},
  {"type": "p", "text": "By choosing BS2030, you will be taught by internationally renowned microbiologists and develop an in-depth understanding of fundamental aspects of bacteria and archaea in breadth and depth, including microbial cell structure, culture techniques, energetics, microbial grouping, infectious diseases, and industrial uses of microbes. You will do lots of laboratory work to gain practical experience in  microbial growth techniques, biochemical characterization, and identification."},
]
M["BS2030"]["learningOutcomes"] = [
  {"type": "p", "text": "On successful completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Explain basic techniques for isolation, handling and identification of bacteria and archaea, and demonstrate an ability to apply these techniques in the laboratory.",
    "Explain the diversity of the mechanisms for energy generation by bacteria and archaea.",
    "Describe ways in which genetic techniques can be applied to the study of bacteria and archaea, and applications of these techniques in biotechnology",
    "Describe the salient features of selected groups of bacteria and archaea.",
    "Describe uses of bacteria and archaea in industrial processes.",
    "Describe basic themes in bacterial infectious diseases.",
  ]},
]
M["BS2030"]["assessment"] = [
  {"type": "p", "text": "Written examination (in January) 60% Laboratory report 30% Practical test 10%"},
]

M["BS2059"]["convenors"] = [
  "Dr Moya Burns (mlb40@le.ac.uk)",
  "Dr Rob Hammond (rh225@le.ac.uk)",
]
M["BS2059"]["aims"] = [
  {"type": "ul", "items": [
    "To understand how global environmental change is affecting how ecosystems function and how this can interact with human health, via factors such as disease-spread and food security.",
    "To understand conservation issues that apply to a wide variety of habitat types in the UK and worldwide.",
    "To evaluate conflicting demands between conservation and other forms of land use, and the conflicts as global society moves towards achieving “sustainability” in its resource use.",
    "To appreciate how ecological understanding is used to inform decision-making for biodiversity conservation management as part of our society’s overall objectives.",
    "To understand how the five main drivers of global environmental change (climate change, habitat loss, pollution, overharvesting and invasive species) are impacting biodiversity and how these impacts may be ameliorated.",
  ]},
]
M["BS2059"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of the module you will be able to:"},
  {"type": "ul", "items": [
    "Explain the major threats to global and UK biodiversity, including habit loss, invasive species, overexploitation and climate change.",
    "Explain how these major threats impact on human health and food security.",
    "Explain the legal and administrative basis for biodiversity conservation in the UK and Europe at species and ecosystem level.",
    "Demonstrate, from both fieldwork and a review of the literature, how conservation management can ameliorate the threats to particular, important UK habitats.",
    "Evaluate the management of habitats and ecosystems in terms of the perceived benefits for named species",
    "Explain the extinction risks faced by small, isolated and unconnected populations.",
    "Make a balanced assessment, based on both fieldwork and the literature, of the conflicts between conservation and competing land issues",
  ]},
]
M["BS2059"]["assessment"] = [
  {"type": "p", "text": "Assessment is through three activities:"},
  {"type": "p", "text": "Performance at final examination 50% Field course report 46% Engagement (evaluated using weekly quizzes) 4%"},
]

M["BS2093"]["convenors"] = [
  "Dr Mark Leyland (ml27@le.ac.uk)",
  "Professor Geerten Vuister (gv29@le.ac.uk)",
]
M["BS2093"]["aims"] = [
  {"type": "p", "text": "To provide an understanding of protein structure, to appreciate how the structure of proteins relates to their function and to outline the different regulatory methods that are used in the cell to control protein function."},
]
M["BS2093"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of the module you should be able to:"},
  {"type": "ul", "items": [
    "Discuss the principles of protein structure and the methods used to study structure",
    "Discuss the properties of enzymes and describe the different ways protein activity is regulated",
    "Explain the integration and regulation of metabolism",
    "Demonstrate the ability to analyse the molecular features of proteins",
    "Analyse experimental data to solve problems",
    "Research, summarise and present material to a scientifically knowledgeable, non-specialist audience",
  ]},
]
M["BS2093"]["assessment"] = [
  {"type": "p", "text": "Continuous assessment work will count 40% towards the final mark and will consist of a recorded presentation (35%) and engagement marks (5%).  The examination paper will count 60% towards the final mark. The exam will consist of a mixture of multiple-choice/single-best answer style questions, short answer questions and an integrated long answer question."},
]

M["BS2094"]["convenors"] = [
  "Dr Cheryl Hurkett (cph9@le.ac.uk)",
  "Dr R Badge (Rmb19@le.ac.uk)",
]
M["BS2094"]["assessment"] = [
  {"type": "p", "text": "Coursework (essay): (40%) Coursework (Python code portfolio) (60%)"},
]

M["MB2020"]["convenors"] = [
  "Professor Galina Mukamolova (gvm4@le.ac.uk)",
  "Dr Jo Purves (jp437@leicester.ac.uk)",
  "Dr Helen O’Hare (hmo7@le.ac.uk)",
]
M["MB2020"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to provide the essential knowledge on the biology of major pathogens and their interactions with hosts; to cover the mechanisms of microbial diseases and virulence factors and to explain the main means for the prevention, diagnosis, and treatment of microbial diseases."},
]
M["MB2020"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module students should be able to:"},
  {"type": "ul", "items": [
    "Describe the basic principles of microbial diagnostics",
    "Know the characteristics of major human pathogens and explain how they adapt to different environments",
    "Describe major infectious diseases and name corresponding causative agents",
    "Know major antimicrobials used for treatment of infectious diseases and explain how they work",
    "Describe major areas of preventive treatment",
    "Conduct simple experiments for identification and characterisation of bacteria of medical importance",
  ]},
]
M["MB2020"]["assessment"] = [
  {"type": "ul", "items": [
    "Examination: 50%",
    "Continuous assessment: 40% consisting of a practical report",
    "Laboratory competency assessment: 10%",
  ]},
]

M["MB2050"]["convenors"] = [
  "Dr Sue Shackleton (sue.shackleton@le.ac.uk)",
]
M["MB2050"]["aims"] = [
  {"type": "p", "text": "To provide an introduction to the approaches used in modelling and developing treatments for human disease"},
]
M["MB2050"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of the module you should be able to:"},
  {"type": "ul", "items": [
    "Discuss the types and sources of stem cells and their uses",
    "Describe strategies that can be used to generate genetically modified mice",
    "Describe the principles of gene therapy and gene editing and assess the relative merits of each",
    "Describe the processes involved in drug design and the generation of a pharmaceutical product.",
    "Discuss key social and ethical issues related to disease treatments",
    "Describe the principles of a piece of scientific research for a non-expert audience",
  ]},
]
M["MB2050"]["assessment"] = [
  {"type": "p", "text": "Lay presentation of scientific research 40% Examination"},
  {"type": "p", "text": "60%"},
]

M["MB2051"]["convenors"] = [
  "Dr Chris Talbot (cjt15@le.ac.uk)",
]
M["MB2051"]["aims"] = [
  {"type": "p", "text": "To provide an introduction to the approaches used in modelling and developing treatments for human inherited disease."},
  {"type": "p", "text": "To enable the students to appreciate the social, ethical and legal implications of the application of modern molecular genetics to medicine."},
  {"type": "p", "text": "To engender discussion on the key social and ethical issues related to a number of scientific topics, Including genetic screening, genome editing, stem cells, reproductive technology, personalised medicine and genetic genealogy"},
  {"type": "p", "text": "To introduce the history of some controversial areas of genetics such as eugenics and the genetics of race and IQ."},
]
M["MB2051"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module students should be able to:"},
  {"type": "ul", "items": [
    "Discuss the types and sources of stem cells and their uses",
    "Describe strategies that can be used to generate genetically modified mice",
    "Describe the principles of gene therapy and gene editing and assess the relative merits of each",
    "Explain the scientific basis of current controversies in medical genetics",
    "Carry out a structured evaluation of the arguments on both sides of an ethical topic",
    "Describe the principles of a piece of scientific research for a non-expert audience",
  ]},
]
M["MB2051"]["assessment"] = [
  {"type": "p", "text": "There is no final examination for this module: all assessment is by continuous assessment."},
  {"type": "p", "text": "Lay presentation of scientific research: 40% Dissertation"},
  {"type": "p", "text": "60%"},
]

M["BS2000"]["convenors"] = [
  "Dr Nicola Suter-Giorgini (nms2@le.ac.uk)",
  "Dr Alix Blockley (adb40@le.ac.uk)",
]
M["BS2000"]["aims"] = [
  {"type": "p", "text": "This module aims to provide students with a practical appreciation of the processes involved in 'doing science' and will also provide essential employability skills. This will take the form of a team- written grant proposal and will build on skills introduced in BS2200 in semester 1: team working, literature searching, application of experimental design and appropriate consideration of ethical issues. New skills in this module will include an introduction to Intellectual property and grant costings."},
]
M["BS2000"]["learningOutcomes"] = [
  {"type": "p", "text": "On successful completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Demonstrate the ability to work effectively as part of a team",
    "Effectively search for and critically evaluate research literature",
    "Reflect on and articulate motivations, strengths and skills in relation to future employment",
    "Demonstrate an appreciation of project management skills, including costings and intellectual property",
    "Develop oral presentation skills",
  ]},
]
M["BS2000"]["assessment"] = [
  {"type": "p", "text": "This module is continuously assessed, with no final exam. The module marks are based on a team research proposal (65%), an Intellectual property MCQ test (20%), completion of a key skills portfolio (10%) and a live mock interview (5%)."},
]

M["BS2004"]["convenors"] = [
  "Professor Eamonn Mallon (ebm3@le.ac.uk)",
  "Dr Swidbert ott (so120@le.ac.uk)",
]
M["BS2004"]["aims"] = [
  {"type": "p", "text": "To further develop students’ data analysis abilities. As a scientist, you will be presented with ever more complicated experimental designs, as you become interested in the effects of more and more factors. Your current statistical knowledge will be found wanting. You can solve this by learning ever more specific tests, some of which will be complications of tests you already know. But there is an easier way. In this course, we will show you that using modern computing we can understand a large number of tests as variations of one test, the general linear model (GLM). If we learn how to use GLMs, we remove the need to constantly learn ever more obscure tests. This both reduces our workload and is more intellectually satisfying."},
]
M["BS2004"]["learningOutcomes"] = [
  {"type": "p", "text": "At the end of this module typical students should be able to"},
  {"type": "ul", "items": [
    "Understand various classical tests as examples of linear models",
    "Understand the basic logic and set up of GLMs",
    "Explain how various complications (e.g. interactions) are implemented in GLMs.",
  ]},
  {"type": "p", "text": "Key skills that should be acquired include the ability to:"},
  {"type": "ul", "items": [
    "Design a statistically robust experiment",
    "Choose the correct statistical model, i.e. model selection",
    "Implement practical aspects of the above in the statistical programming language R.",
  ]},
]
M["BS2004"]["assessment"] = [
  {"type": "ul", "items": [
    "Session MCQs - 50%",
    "Guided final project  - 50%",
  ]},
]

M["BS2014"]["convenors"] = [
  "Dr Catherine Vial (cv12@le.ac.uk)",
]
M["BS2014"]["aims"] = [
  {"type": "p", "text": "The aim of this module is to develop students understanding of how the human body responds and adapts to exercise and how this can be manipulated pharmacologically. The module aims to build upon and integrate material introduced in BS1060 (Multicellular Organisation – An Introduction to Physiology, Pharmacology & Neuroscience). The principal systems that are involved in the physiological response to exercise will be examined including the musculoskeletal, cardiac, vascular and respiratory systems. Importantly, how these systems are regulated, the remarkable adaptations that occur with training and the factors that place limits on exercise will be considered, including fatigue and environment. In addition, the ability of regular exercise to prevent both chronic diseases and the natural effects of aging on physiological performance will also be described. The module will also explore the impact of genetic predispositions and drug abuse on athletic performance in sport."},
]
M["BS2014"]["learningOutcomes"] = [
  {"type": "p", "text": "At the end of this module students should be able to:"},
  {"type": "ul", "items": [
    "explain the structure, organisation and function of the major components of the musculoskeletal system, including skeletal muscle, bone and other components contained within joints.",
    "discuss factors that adversely impact exercise and athletic performance including environment (e.g. altitude and temperature), fatigue and age, as well as genetic factors and drugs that increase performance.",
    "discuss the proposed mechanisms whereby regular exercise can limit the development of common chronic diseases and also resist age-dependent loss of physical performance.",
  ]},
  {"type": "ul", "items": [
    "integrate information from different components of the module to explain how the musculoskeletal, cardiac, vascular, respiratory and nervous systems adapt to training to improve strength and endurance.",
    "explain the regulation of skeletal muscle contraction and mechanisms for increased strength with training.",
    "explain the control mechanisms responsible for regulating the responses of the cardiovascular and respiratory systems to exercise.",
    "describe the different sources of metabolic substrates and the regulation of energy supply to skeletal muscle with exercise.",
    "develop practical skills in physiological measurement and demonstrate the ability to handle, manipulate, display and statistically analyse physiological data.",
    "be able to generate components of a scientific report in an appropriate format.",
  ]},
]
M["BS2014"]["assessment"] = [
  {"type": "p", "text": "End of Module Assessment 65% of module mark"},
  {"type": "p", "text": "Continuous assessment 30% of module mark Practical report & supporting work"},
  {"type": "p", "text": "Tutorial Activities 5% of module mark"},
]

M["BS2026"]["convenors"] = [
  "Professor Mark Jobling (maj4@le.ac.uk)",
  "Dr Ko-Fan Chen (kc280@le.ac.uk)",
]
M["BS2026"]["aims"] = [
  {"type": "p", "text": "This module, together with BS2009 Genomes, provides a strong foundation for advanced third- year modules in genetics and molecular biology. Students will examine the ways that genes and genomes are organised, transmitted, and regulated in a range of different organisms; understand how mutations of different kinds can affect phenotypes and diseases; learn how allele frequencies are affected by selective and other forces in populations; and understand how genes control the developmental programmes of a range of organisms."},
]
M["BS2026"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "interpret patterns of inheritance, and understand the mechanisms underlying those inheritance patterns",
    "understand the core concepts of population genetics, and the contrast between quantitative traits and Mendelian traits",
    "relate disruptions in the genome to expression of diseases and phenotypes",
    "explain the use of genetics to dissect gene regulation and function during development in vertebrates, invertebrates, and plants",
    "frame a hypothesis, and use open sources to gather and critically assess scientific data, and test the hypothesis",
    "critically analyse and interpret experimental data.",
  ]},
]
M["BS2026"]["assessment"] = [
  {"type": "p", "text": "50%: end of module assessment 50%: practical portfolio jointly covering the practicals"},
]

M["BS2032"]["convenors"] = [
  "Professor Andrea Cooper (amc72@.le.ac.uk)",
  "Dr Hasan Yesilkaya (hy3@le.ac.uk)",
]
M["BS2032"]["aims"] = [
  {"type": "p", "text": "Do you know your closest eukaryotic companions? Take BS2032 and discover how we live in a world of parasites and fungi. Using lectures and practical hands-on activities you will learn about the eukaryotic microbial world and our immune response to it. Team work, time management, laboratory skills and data analysis are all involved as you gain new understanding of the love/hate relationship between humans and the microbial world."},
]
M["BS2032"]["assessment"] = [
  {"type": "p", "text": "End of year assessment (in person exam) 60% Practical workbook 40%"},
]

M["BS2033"]["convenors"] = [
  "Dr Hasan Yesilkaya (hy3@le.ac.uk)",
  "Professor Andrea Cooper (amc72@le.ac.uk)",
]
M["BS2033"]["assessment"] = [
  {"type": "ul", "items": [
    "End of year assessment (exam) (60%)",
    "Enterprise report document (40%)",
  ]},
]

M["BS2040"]["convenors"] = [
  "Dr Richard badge (rmb19@le.ac.uk)",
]
M["BS2040"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to illustrate how computers are used to investigate the organisation and evolution of genes, genomes and proteins. A “hands on” approach is taken by way of practical sessions held in computer laboratories. A wide range of genes and genomes are considered, with emphasis on those of model systems (yeast, Drosophila, mouse) and humans."},
]
M["BS2040"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of the module a typical student should be able to:"},
  {"type": "ul", "items": [
    "Use computer systems to access and search bioinformatic databases to address specific biological hypotheses.",
    "Describe how computers automate information retrieval from literature and unstructured data.",
    "Retrieve and utilise bioinformatic data (chiefly DNA and protein sequences).",
    "Compare DNA and protein sequences to analyse gene structure and function.",
    "Describe how protein structures are determined and computationally modelled.",
    "Use phylogenetic methods to examine evolutionary relationships between organisms.",
    "Outline the methods by which genomes are sequenced.",
    "Describe how genome scale data are organised and used.",
    "Discuss the applications and limitations of metagenomics.",
    "Identify and discuss the ramifications of genome projects e.g. transcriptomics, proteomics.",
    "Analyse genetic variation data using bioinformatic resources, and communicate, in writing, the application of bioinformatic approaches to dissecting human genetic disease.",
  ]},
]
M["BS2040"]["assessment"] = [
  {"type": "p", "text": "40% of the module mark will be derived from the May end of module assessment paper. 60% of the module mark will be derived from continuous assessment, which will consist of writing a report on a computer practical involving bioinformatic analyses."},
]

M["BS2066"]["convenors"] = [
  "Dr Tom Matheson (tm75@le.ac.uk)",
  "Dr Swidbert Ott (so120@le.ac.uk)",
]
M["BS2066"]["aims"] = [
  {"type": "p", "text": "This course will provide a detailed understanding of the processes by which nervous systems generate adaptive behaviours in a wide range of animals."},
]
M["BS2066"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module students should be able to:"},
  {"type": "ul", "items": [
    "Explain and critically discuss the main topics with reference to appropriate source material, including primary research papers.",
    "Analyse and interpret experiments investigating different aspects of animal behaviour.",
    "Discuss the results of experiments in the context of the related research literature.",
    "Use a computer modelling environment to design and carry out tests of neural network function.",
    "Analyse the patterns of connectivity in a model neural network to explain its functional organisation.",
  ]},
]
M["BS2066"]["assessment"] = [
  {"type": "p", "text": "Coursework: 30% Written end-of-year assessment: 65% Engagement: 5%"},
]

M["BS2077"]["convenors"] = [
  "Dr Swidbert Ott (so120@le.ac.uk)",
  "Dr Tom Matheson (tm75@le.ac.uk)",
]
M["BS2077"]["aims"] = [
  {"type": "p", "text": "This module aims to provide you with a deeper understanding of animal behaviour by bridging between two complementary kinds of explanations: First, how do animal brains generate behaviour? And second, why have animals evolved to behave in a particular way?"},
]
M["BS2077"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module students should be able to:"},
  {"type": "ul", "items": [
    "Explain the principles of neuronal signalling that underpin the control of behaviour.",
    "Discuss different types of sensory processing that enable animals to sense their environment.",
    "Explain how experience shapes development of neural circuits within the brain.",
    "Discuss the role of genes and environment in shaping adaptive behaviour.",
    "Formulate and test specific hypotheses in behavioural ecology.",
    "Explain how individual economics and competition shape behaviour.",
    "Evaluate theories explaining parental care, family conflict and the evolution of altruistic and cooperative behaviours.",
    "Analyse and interpret quantitative experiments investigating different aspects of animal behaviour.",
    "Discuss the results of experiments in the context of the related research literature.",
  ]},
]
M["BS2077"]["assessment"] = [
  {"type": "p", "text": "Practical Report: 30% Written end-of-year assessment: 65% Engagement: 5%"},
]

M["BS2078"]["convenors"] = [
  "Dr Rob Hammond (rh225@le.ac.uk)",
  "Dr Stuart Desjardins (sd226@le.ac.uk)",
]
M["BS2078"]["learningOutcomes"] = [
  {"type": "p", "text": "On successful completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Discuss basic ecological and evolutionary phenomena as they relate to communities in the context of the Mediterranean biome, biodiversity measures, breeding systems, adaptations, inter-specific interactions and conservation.",
    "Explain species concepts and speciation mechanisms in the context of natural selection, population differentiation and adaptive radiation.",
    {"text": "Design observational and experimental approaches to study aspects of evolutionary biology:", "items": [
      "Formulate and test hypotheses, using rigorous statistical techniques on data collected in observational field surveys or experiments.",
      "Master quantitative survey skills and sampling techniques for different organisms.",
      "Operate appropriate collection, recording and documentation protocols.",
      "Operate appropriate health and safety protocols in fieldwork.",
    ]},
    "Prepare and deliver oral and written reports.",
    "Understand good conservation practice and CITES legislation.",
  ]},
]
M["BS2078"]["assessment"] = [
  {"type": "p", "text": "Field project presentation (takes place during field course) 10% Field project written as a paper 40% End of module assessment (May exam period) 50%"},
]

M["BS2091"]["convenors"] = [
  "Dr Olga Makarova (om13@le.ac.uk)",
  "Professor Thomas Schalch (Thomas.schalch@le.ac.uk)",
]
M["BS2091"]["aims"] = [
  {"type": "p", "text": "To give a thorough understanding of molecular aspects of the maintenance, expression and regulation of genetic information in living cells."},
]
M["BS2091"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of the module participating students should be able to:"},
  {"type": "ul", "items": [
    "Understand the molecular mechanisms of protein-protein and protein-DNA interactions and how these may be modulated; understand the use of molecular graphics to examine interactions within proteins;",
    "Explain the mechanisms responsible for the regulation of gene expression in prokaryotes and eukaryotes;",
    "Describe how the information encoded in DNA is transcribed into RNA and how primary transcripts are processed to achieve their final, functional form;",
    "Demonstrate an appreciation of the principles of the genetic code and the translation of genetic information from messenger RNA into protein;",
    "Carry out and interpret simple experiments illustrating aspects of the above;",
    "Read and understand original research literature.",
  ]},
]
M["BS2091"]["assessment"] = [
  {"type": "p", "text": "There are three assessments in this module:"},
  {"type": "ul", "items": [
    "Laboratory practical report 40%",
    "Exam 50%",
    "Engagement 10%",
  ]},
]

M["BS2092"]["convenors"] = [
  "Dr Sally Prigent (sap8@le.ac.uk)",
]
M["BS2092"]["aims"] = [
  {"type": "ul", "items": [
    "To provide an overview of cell ultrastructure, with a focus on the cytoskeleton and organelles involved in synthesis and trafficking of intracellular and secreted proteins.",
    "To provide an overview of cell signalling pathways with a focus on the molecular features of receptors, signal transducers and second messengers.",
    "To develop an understanding of the principles of cell cycle control in eukaryotes.",
    "A core aim of the module will also be to introduce students to the principal techniques used in molecular cell biology and to develop students’ ability to design experiments to test a hypothesis, based on the use of these techniques.",
  ]},
]
M["BS2092"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Describe the techniques used to study: (i) the subcellular localisation of proteins within the cell; (ii) protein-protein interactions in cells; (iii) the dynamic properties of cellular components; (iv) the cell cycle and (v) protein function.",
    "Explain the respective roles of microtubules, actin and intermediate filaments in the maintenance of cell architecture and function.",
    "Explain how membrane and secreted proteins are post-translationally processed and targeted to different subcellular and extracellular locations.",
    "Explain how signalling pathways are triggered and effectively influence cellular activities such as cell proliferation.",
    "Describe the processes involved in eukaryotic cell cycle control and mitotic division.",
    "Develop a strategy to address a specific scientific hypothesis and be able to: (i) carry out some of the experimental methods required; and (ii) critically analyse the results of such experiments.",
  ]},
]
M["BS2092"]["assessment"] = [
  {"type": "p", "text": "Practical report: 36% Engagement activities: 4% Examination: 60%"},
  {"type": "p", "text": "The examination will assess students’ understanding of key concepts in cell biology and ability to design and interpret the results of experiments."},
]

M["MB2080"]["convenors"] = [
  "Dr Jonathan Willets (jmw23@le.ac.uk)",
  "Dr Nina Storey (ns140@le.ac.uk)",
]
M["MB2080"]["aims"] = [
  {"type": "p", "text": "The aim of this module is to provide students with a sound understanding of how physiological systems function in health and disease and to provide an appreciation of the significance of various disease states in terms of symptoms, prevalence, morbidity, mortality, risk factors and prevention strategies."},
  {"type": "p", "text": "Emphasis will be made on understanding the functional changes that accompany a particular syndrome or disease (pathophysiology) and on the physiological and biochemical basis of current and possible future therapies."},
]
M["MB2080"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Discuss the underlying physiological and biochemical mechanisms and disease-induced changes associated with a range of human conditions including cystic fibrosis, hepatitis, gastric ulcers, narcolepsy, infertility, and vascular disease.",
    "Outline the symptoms, prevalence, morbidity, mortality, and risk factors associated with the range of human disease states covered.",
    "Critically evaluate the use of laboratory data in the identification, aetiology and pathogenesis of selected diseases processes.",
    "Discuss the physiological and biochemical principles behind both current and potential future therapeutic strategies for the disease states covered.",
    "Make effective use of electronic sources of information, including the PUBMED and OMIM databases and disease specific web sites, to find out detailed information about the physiology, aetiology and epidemiology of a particular disease.",
    "Produce a well-structured ,formatted and referenced scientific assignment.",
  ]},
]
M["MB2080"]["assessment"] = [
  {"type": "p", "text": "The module will be assessed by:"},
  {"type": "p", "text": "Exam (60%):   Answer 6 questions from a choice of eight, completed in a closed book, on campus, end of module, 2 hour exam."},
  {"type": "p", "text": "Continuous Assessment (36%): One coursework assignment in the middle of the module."},
  {"type": "p", "text": "Engagement marks for Tutorial (4%)"},
]

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

# None of these five are core for any degree by the letter of the
# handbooks — streamOf() in modulemap.js would otherwise leave them
# grey — but each sits in a small "choose N from" group where most
# students realistically end up taking most or all of the group's
# members: BS3015/BS3068/BS3013 in Microbiology's and Medical
# Microbiology's "choose 3 or 4 from" (of 4 members — most students
# clear 3, many take all 4), BS3038/BS3064 in Zoology's "choose 1
# from" (of only 2 members, so roughly half take each, but only ever
# these two — no third option to dilute it). Coloured outright, at
# explicit instruction (2026-09-24), the same way Year 1's modules
# carry a `stream` instead of having one derived.
for c in ("BS3015", "BS3068", "BS3013"): M[c]["stream"] = "microbiology"
for c in ("BS3038", "BS3064"): M[c]["stream"] = "zoology"

# ---- Year 3 module detail sections, transcribed verbatim from
# Y3_module_descriptions_2026-271.pdf. Same schema as Year 2 above.
M["BS3000"]["convenors"] = [
  "Professor Ed Hollox (eh33@le.ac.uk)",
]
M["BS3000"]["aims"] = [
  {"type": "p", "text": "How did life begin?  How do genes arise?  How do we detect natural selection in DNA?  How did humans evolve?  How were animals domesticated?  How do pathogens evolve?"},
  {"type": "p", "text": "In this module we will answer these questions, and more, showing an understanding of evolutionary genetics is fundamental not only to understanding evolution, but also to biology and disease, too."},
]
M["BS3000"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of the module, students should have a comprehensive understanding of the evolution of genes and  genomes and their role in the diversity and maintenance of different life forms."},
]
M["BS3000"]["assessment"] = [
  {"type": "p", "text": "40% of the final module mark will be based on a research essay. The research papers will be given out in the middle of term and you will need to produce a formative graphical abstract and write a 2500 word essay based on that research paper."},
  {"type": "p", "text": "A summer on-campus exam will contribute the other 60%."},
]

M["BS3010"]["convenors"] = [
  "Professor Ian Eperon (eci@le.ac.uk)",
  "Professor Daniel Panne (dp418@le.ac.uk)",
]
M["BS3010"]["aims"] = [
  {"type": "p", "text": "This course follows the expression of protein-coding genes, looking at the environment of a gene in the nucleus, transcription, processing of mRNA and production of multiple mRNA sequences from each gene and regulation by small RNA molecules. At all of these stages, we examine the mechanisms by which the level is controlled and fidelity maintained, and we address the origins of disease when these mechanisms fail."},
  {"type": "p", "text": "Our aims are:"},
  {"type": "ul", "items": [
    "That students should acquire a thorough understanding of the molecular mechanisms of gene expression and its control to enable them to pursue independent study in this area.",
    "That students should understand how gene expression can be perturbed and cause disease.",
    "That students should understand the role of creative thought and rigorous tests of hypotheses in science, be able to critically appraise papers and become independent thinkers in the experimental approaches to discovering how gene activity is controlled.",
    "That students should develop skills in generating and appraisal of data, reasoning and communication that will prepare them for more general employment.",
  ]},
]
M["BS3010"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of this course, students should be able to:"},
  {"type": "ul", "items": [
    "Describe the principal components, both protein and RNA, involved in transcription, RNA processing and micro RNA action.",
    "Explain how these components act and interact during the various reactions involved in gene expression.",
    "Describe the mechanisms by which the levels or sequences of the products are regulated.",
    "Review the main lines of evidence supporting the mechanisms proposed.",
    "Understand how these processes may cause or be altered in disease.",
    "Demonstrate in writing and in discussion their knowledge of current research methods and scientific reasoning.",
  ]},
]
M["BS3010"]["assessment"] = [
  {"type": "p", "text": "Debates:"},
  {"type": "p", "text": "We will arrange short polemical debates about current issues in the field. Pairs of students will be given papers that reached contradictory conclusions. One pair will use the data in the papers and any relevant additional published research to present the case for one point of view and against the other one; the other pair will present the opposing case likewise. The marks awarded will comprise 30% of the final mark."},
  {"type": "p", "text": "Written Examination:"},
  {"type": "p", "text": "This will be sat during the examination period in May (at the end of the academic year) and will count for 70% of the total course mark. It will cover material from all parts of the course. It would be sensible to start revising well in advance so that you can ask course tutors about any material that you might not understand."},
]

M["BS3015"]["convenors"] = [
  "Dr Jo Purves (jp437@le.ac.uk)",
  "Professor Andrea Cooper (amc72@le.ac.uk)",
  "Professor David Cousins (dc282@le.ac.uk)",
]
M["BS3015"]["aims"] = [
  {"type": "p", "text": "This module will build understanding of the fundamentals of the immune response. It will cover the scientific method allowing students to develop an understanding of how immunology contributes to novel treatments and understanding of disease mechanisms.  Lectures cover basic and advanced topics in health and disease as well as treatment and vaccination approaches. The students acquire critical skills to evaluate immune mechanisms that provide protection, tolerance, and self-reactivity. Tutorials with group discussions guide the students in assessed tasks. Student learning is supported by guided group work and in-course revision."},
]
M["BS3015"]["learningOutcomes"] = [
  {"type": "p", "text": "On successful completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Demonstrate a detailed knowledge of the mammalian immune system, including specific and non-specific immune responses.",
    "Explain the molecular and cellular approaches used to investigate mechanisms of immunity.",
  ]},
  {"type": "p", "text": "Demonstrate a capacity for critical analysis of scientific literature in a topical area of immunology in health research."},
]
M["BS3015"]["assessment"] = [
  {"type": "p", "text": "50% News and Views article (continuous assessment) In this assessment, you will be asked to write a news and views article based on a research paper related to molecular and cellular immunology and will be guided by in person workshops and by the material taught in the module."},
  {"type": "p", "text": "50% Data handling paper under in-person examination conditions: Experimental data sets of immunological Research papers will be provided for analysis and critical evaluation. There will be a need to contribute knowledge derived from the lecture material."},
]

M["BS3031"]["convenors"] = [
  "Dr Celia May (cam5@le.ac.uk)",
  "Dr Tom Webb (tw126@le.ac.uk)",
]
M["BS3031"]["aims"] = [
  {"type": "ul", "items": [
    "to give students an understanding of the organization and dynamics of the human genome,",
    "to give students a broad, basic knowledge of methods used in the analysis of human genetics,",
    "to demonstrate how research in human genetics can be used for the benefit of society,",
    "to develop skills in problem-solving as well as researching and reviewing the scientific literature.",
  ]},
]
M["BS3031"]["learningOutcomes"] = [
  {"type": "p", "text": "On successful completion of the module, students should be able to: 1. Discuss the variety and complexity of the relationships between mutations in or near genes and the manifestation of disease phenotypes 2. Discuss the many ways that research in human genetics can be used. 3. Solve problems in genetics and interpret the outcome 4. Critically assess research papers in the field of human genetics to extract essential information."},
]
M["BS3031"]["assessment"] = [
  {"type": "p", "text": "The module is assessed by an essay-based End of Module exam paper and by a timed problem-based assessment. The End of Module paper contributes 70% of the total marks. The problem-based assessment, aligned to the tutorial work, constitutes 30% of the module marks."},
]

M["BS3038"]["convenors"] = [
  "Dr Stuart Desjardins (sd226@le.ac.uk)",
]
M["BS3038"]["aims"] = [
  {"type": "p", "text": "Upon successful completion of this course, you will be equipped with a broad set of field survey skills, underpinned by ecological & evolutionary theory, that is highly desirable for employability in jobs in the environment sector, such as ecological consultancy, conservation and land management."},
]
M["BS3038"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of the course students should be able to:"},
  {"type": "ul", "items": [
    "Conduct ecological surveys and field assessments in line with industry standard guidelines, and communicate findings/recommendations to stakeholders in the form of a written ecological report.",
    "Describe UK protected species, the legislation surrounding them, their ecological requirements & distribution, species-survey methodology, and how disturbance to their habitat is prevented/mitigated.",
    "Use practical botanical survey skills to identify common and widespread British plant species, and demonstrate a comprehensive understanding of the floral and vegetative characters that define major plant families.",
    "Identify common British bat species from sonograms; identify invertebrates to order level based on anatomical features & identify field evidence of common vertebrates.",
    "Use data analysis and remote mapping software to handle, analyse and present field observations.",
    "Prepare voucher specimens and submit biological records.",
  ]},
]
M["BS3038"]["assessment"] = [
  {"type": "p", "text": "Assessment 1: Ecological Report (50% weighting)"},
  {"type": "ul", "items": [
    "Fieldwork: Conduct an ecological assessment in a field practical class",
    "Write: a Preliminary Ecological Appraisal Report",
  ]},
  {"type": "p", "text": "Assessment 2: Practical Identification Exam (50% weighting)"},
  {"type": "ul", "items": [
    "Closed book, 3h, in-person practical exam",
    "You will be required to identify and correctly observe biological specimens (animal & plant)",
    "Practical classes are direct preparation for the exam",
  ]},
]

M["BS3054"]["convenors"] = [
  "Professor John Challiss (jc36@le.ac.uk)",
]
M["BS3054"]["aims"] = [
  {"type": "ul", "items": [
    "To gain a contemporary appreciation of molecular and cellular pharmacology, including how signal transduction pathways operate and can be manipulated to therapeutic advantage. To integrate this knowledge with related concepts discussed in other modules.",
    "To develop a contemporary understanding of how receptors regulate cellular processes and how both receptors, and the signalling pathways they regulate, can be pharmacologically altered.",
    "To consider the latest concepts and research in molecular and cellular pharmacology, and, using specific examples, how these pharmacological approaches can be applied to the treatment of specific diseases.",
  ]},
]
M["BS3054"]["learningOutcomes"] = [
  {"type": "p", "text": "When students have completed this module they should be able to:"},
  {"type": "ul", "items": [
    "Describe the basic structures and functions of the major classes of receptor and key components of their signal transduction cascades.",
    "Explain how receptors are regulated by agonists, antagonists and inverse agonists. Appreciate that receptor activity can be altered by ligands binding at allosteric as well as orthosteric sites. Describe the different mechanisms of G protein-coupled receptor (GPCR) desensitization and discuss its physiological and pharmacological significance. This should extend to an ability to design and execute experiments and to analyse experimental data.",
  ]},
  {"type": "ul", "items": [
    "Give specific examples of signalling pathways, showing how they are structured (e.g. by sub-cellular compartmentalization, scaffolding, etc.), their physiological function(s), and how molecular therapeutic targets might be selected and pharmacologically manipulated.",
    "Discuss, generally and through the use of specific examples, the pharmacological manipulation of GPCRs, receptor tyrosine kinases, nuclear receptors, ion channels and intracellular enzyme activities. This should include an explanation of different modes of drug-receptor interaction.",
    "Relate acute cell signalling events to longer-term changes in cell phenotype and fate. This should include an explanation of cell-surface-to-nuclear signalling and how changes in stimulation patterns or components of signalling pathways may regulate longer-term physiological or pathophysiological adaptations that are observed in certain disease conditions.",
  ]},
]
M["BS3054"]["assessment"] = [
  {"type": "p", "text": "Performance in this module will be assessed by a final assessment (60%) and course-work assessment (40%). Course-work assessment will be based upon the submission of a data analysis workbook. In the final assessment students will be required to write 2 essays (from a choice of at least 6 questions)."},
]

M["BS3055"]["convenors"] = [
  "Dr Jonathan McDearmid (jrm33@le.ac.uk)",
]
M["BS3055"]["aims"] = [
  {"type": "ul", "items": [
    "To build on knowledge gained in first and second years and particularly BS2013 and BS2014 to develop an understanding of the genes and molecules crucial for nervous system function.",
    "To understand the interactions between proteins and signalling cascades regulating excitability and neurotransmission.",
    "To appreciate the importance of protein structure and location on neuronal function.",
    "To develop knowledge of the experimental approaches and model systems used today in neuroscience research.",
  ]},
]
M["BS3055"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Summarise the properties of ion channels, receptors and signalling pathways involved in synaptic transmission.",
    "Explain the spatial and temporal sequence of events and signals that underlie the development of the nervous system.",
    "Understand neuropathological features of degenerative diseases such as Huntington’s disease.",
    "Explain dendritic propagation and the mechanisms underlying action potential generation.",
    "Explain the molecular mechanisms controlling neurotransmitter release, synaptic transmission and synaptic plasticity.",
    "Identify the specialized features employed to transmit information between neurons and to understand how neuronal excitability is regulated.",
    "Comprehend data series and interpret neuroscience experimental results.",
  ]},
]
M["BS3055"]["assessment"] = [
  {"type": "p", "text": "Performance in this module will be assessed by a final end of module assessment (70%) and continual course assessment (30%). Continual assessment will be based upon the submission of the “News and Views” article."},
]

M["BS3064"]["convenors"] = [
  "Dr Tom Matheson (tm75@le.ac.uk)",
  "Dr Switbert Ott (so120@le.ac.uk)",
]
M["BS3064"]["aims"] = [
  {"type": "p", "text": "Students taking this module should:"},
  {"type": "ul", "items": [
    "Develop a broad understanding of the neurophysiological functioning of animals through comparative study of vertebrate and invertebrate sensory-motor physiology, building on second year modules.",
    "Appreciate how structure and function have influenced the ways in which different animals have solved basic fundamental problems in sensory and motor neurophysiology.",
    "Gain insights into the ways in which experimental studies with non-mammalian animals and their tissues have increased our knowledge of fundamental neurophysiological processes.",
    "Develop a knowledge of experimental techniques used in modern neurobiology research",
  ]},
]
M["BS3064"]["learningOutcomes"] = [
  {"type": "p", "text": "At the end of the module students should be able to:"},
  {"type": "ul", "items": [
    "Use evidence from different animal groups to demonstrate knowledge and understanding of the principles of operation underpinning sensory-motor integration leading to the generation of behaviour.",
    "Synthesize raw data and published information to demonstrate understanding of energy storage mechanisms involved in insect jumping.",
    "Synthesize a range of relevant research literature to demonstrate understanding of a current topic in neuroscience.",
  ]},
]
M["BS3064"]["assessment"] = [
  {"type": "p", "text": "Performance in this module will be assessed by end-of-year assessment (65%) and continual assessment (practical report: 30%, engagement: 5%). The end-of-year exam will require you to answer one essay question from a selection of options, plus four compulsory short answer questions."},
]

M["BS3068"]["convenors"] = [
  "Dr Primrose Freestone (ppef1@le.ac.uk)",
  "Dr Andrew Millard (adm39@le.ac.uk)",
  "Dr Christian Jenul (cwj2@le.ac.uk)",
]
M["BS3068"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to allow students to:"},
  {"type": "ul", "items": [
    "Demonstrate an awareness of the importance of understanding microbial biotechnology and genetics in microbial biotechnological processes.",
    "Describe the central theories and concepts of selected aspects of microbial biotechnology.",
    "Develop a reflective appreciation of the economic, social and ethical issues surrounding uses of micro-organisms in industrial processes.",
  ]},
]
M["BS3068"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Describe the central theories and concepts of selected aspects of microbial biochemistry and biotechnology.",
    "Demonstrate an awareness of the importance of microbial biochemistry to industrial microbiological processes.",
    "Develop a reflective appreciation of the safety, social, environmental and enterprise issues surrounding uses of micro-organisms in biotechnology.",
    "Communicate their knowledge of industrial microbiology via poster and group presentations.",
  ]},
]
M["BS3068"]["assessment"] = [
  {"type": "p", "text": "There is no end of module exam. Continuous assessment will constitute 100% of the module mark. The first assessment is biotechnology product or process poster presentation that constitutes 35%, with an accompanying 400 word abstract set at 15%. The second assessment is also 50%, and is about biotechnology enterprise and patents. It will consist of a group of 4-5 students researching as a team a novel biotechnology application and completing a technology description form, combined with a short group podcast presentation of the technology."},
]

M["BS3070"]["convenors"] = [
  "Professor Cyril Dominguez (ch180@le.ac.uk)",
  "Professor Peter Moody (pcem1@le.ac.uk)",
]
M["BS3070"]["aims"] = [
  {"type": "p", "text": "Structural Biology has revolutionised our understanding of biology. The impact of knowing the structure of DNA is the most well-known example. Practically all events in cells depend on the interactions of biological macromolecules, with both other macromolecules and other molecules. Structural Biology enables us to see how these interactions work at the molecular level. The aim of this module is to provide  an overview and understanding of the techniques and methods used to discover the structures and interactions involved in biology. We will introduce and describe the range of techniques, including X-ray crystallography, NMR spectroscopy and cryo-electron microscopy as well as super-resolution microscopy. The scope and limitations of these techniques will be discussed in the context of biological questions and how investigations of these are communicated in the literature."},
]
M["BS3070"]["learningOutcomes"] = [
  {"type": "p", "text": "On successful completion of the module, students should be able to:"},
  {"type": "ul", "items": [
    "Quantitatively and qualitatively evaluate research literature where structural biology techniques have been used",
    "Discuss the basis, properties and applications of important biophysical techniques.",
    "Explain the basis and approaches of Protein Crystallography.",
    "Explain the basis and approaches of Protein Nuclear Magnetic Resonance.",
    "Explain the basis and approaches of Cryo Electron Microscopy.",
    "Explain the basis and approaches of super-resolution microscopy.",
    "Discuss the scope and contribution of Protein Bioinformatics as a computational method.",
  ]},
]
M["BS3070"]["assessment"] = [
  {"type": "p", "text": "The course is assessed by an End of Module Assessment (70%) and an on-line Literature comprehension exercise (30%)."},
]

M["NT3100"]["convenors"] = [
  "Professor Sarah Gretton (sng8@le.ac.uk)",
  "Dr Stuart Desjardins (sd226@le.ac.uk)",
]
M["NT3100"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to provide you with the chance to gain significant experience in the sustainability sector and contribute to positive community engagement- essentially you will be working as trainee sustainability advisors. This nationally award-winning module  is a ‘work related learning’ in that it contains elements similar to that of a placement or internship. Such experience, alongside an academic qualification, allows for the development of critical employability skills. Successful completion of the portfolio assessment will give you accreditation in Carbon Literacy, which is a desirable asset for employers (we know that businesses report that they are struggling to find candidates with the right sustainability skills to fit graduate positions, and receiving this accreditation as part of the module should make you directly more employable and equipped with the right skills for addressing future challenges). You will have the chance to put those skills into action by working directly with a business to assess their sustainability audit data and generate your own sustainability baseline report in groups (Written Industry Report). Working with an interdisciplinary group will allow you to holistically address sustainability challenges and learn from the approach of other disciplines. Following completion of the group Written Industry Report, you will be supported to deliver an individual Detailed Implementation Plan for your business."},
]
M["NT3100"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of this module you will be able to:"},
  {"type": "ul", "items": [
    "Discuss the significance of the following areas when auditing sustainability: carbon/energy, waste, procurement, travel, biodiversity, community",
    "Apply sustainability auditing training to analyse real world data and conduct research on the environmental and social impact of an organisation's activities",
  ]},
  {"type": "ul", "items": [
    "Utilise problem solving and decision-making skills to make appropriate recommendations in an industry focused report",
    "Demonstrate how insights into your own carbon footprint will translate into meaningful future behaviour ensuring you are a responsible global citizen through forward planning",
    "Critique performance during the group project, then use self-reflection to articulate strengths and future development areas",
  ]},
]
M["NT3100"]["assessment"] = [
  {"type": "p", "text": "Written Industry Report (group project) – 50% Detailed Implementation Plan (Individual) – 40% Professional Reflection Portfolio (Individual) – 10%"},
]

M["BS3003"]["convenors"] = [
  "Professor Salvador Macip (sm460@le.ac.uk)",
  "Dr Raj Patel (rp31@le.ac.uk)",
]
M["BS3003"]["aims"] = [
  {"type": "ul", "items": [
    "To appreciate the impact of cancer in today’s society",
    "To gain an in-depth understanding of the molecular basis of human cancer",
    "To develop knowledge of the experimental approaches used in cancer research",
    "To have an insight into cancer treatments of the future",
    "To develop skills in researching and reviewing the scientific literature",
  ]},
]
M["BS3003"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module students should be able to:"},
  {"type": "ul", "items": [
    "describe the main features which distinguish malignant cells from normal cells, including metabolic changes and genomic instability.",
    "describe the mechanisms which regulate the proliferation and survival of normal cells including cell signalling pathways, cell cycle control and apoptosis.",
    "explain how mutations in oncogenes and tumour suppressor genes contribute to the malignant phenotype.",
    "describe the pathological processes of immune avoidance, cancer cell metastasis and tumour angiogenesis.",
    "integrate information from diverse sources which have contributed to the understanding of the origins of human cancer.",
    "conduct a literature research project and write a critical appraisal of the subject",
  ]},
]
M["BS3003"]["assessment"] = [
  {"type": "p", "text": "The module will be assessed entirely through coursework and there will be no end-of-module examination. There will be three pieces of assessment:"},
  {"type": "ol", "items": [
    "Infographic (35% of module mark). An infographic (graphic summary) on one of the topics offered. The goal of the infographic is to assess the ability to summarize a specific topic using visual elements.",
    "Course essay (45% of module mark). A 3,000 word essay on a given topic. The goal of the essay is to assess the student’s ability to produce a review on a complex topic from existing literature in the form of a written communication.",
    "Multiple choice question test (20% of module mark). An MCQ test under exam conditions will be done at the end of the module to assess engagement with the material delivered in the lectures. The test will have 20 questions with 4 options (only one correct).",
  ]},
]

M["BS3011"]["convenors"] = [
  "Dr Katrin Schilcher (ks665@le.ac.uk)",
  "Professor Julie Morissey (jam20@le.ac.uk)",
]
M["BS3011"]["aims"] = [
  {"type": "ul", "items": [
    "To explain the principles of microbial pathogenesis and infectious disease",
    "To describe examples of the major virulence determinants of bacterial pathogens",
    "To provide an advanced interdisciplinary approach to understanding the molecular and genetic determinants of infectious diseases",
    "To illustrate the use of infectious disease models, genetic techniques, -omics techniques and bioinformatics in studies of microbial pathogenesis",
  ]},
]
M["BS3011"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module, students are expected to be able to:"},
  {"type": "ul", "items": [
    "Present in detail and explain the genetic mechanisms underlying selected processes in bacteria",
    "Demonstrate knowledge of the molecular and genetic basis of strategies employed by microorganisms to invade host tissue, avoid host defence mechanisms and proliferate at sites of infection.",
    "Analyse and interpret data and information from primary literature sources, and organise and communicate it in writing",
    "Demonstrate, in writing, a capacity for critical analysis of a specialised or topical issue in microbiology",
    "Design a research activity to determine the contributions of a virulence factor or other mechanism to an infectious disease.",
    "Demonstrate use of bioinformatics tools to analyse and understand microbial virulence traits",
  ]},
]
M["BS3011"]["assessment"] = [
  {"type": "p", "text": "This module does not have a final exam and all marks are derived from the continuous assessment. These marks are allocated as follows:"},
  {"type": "p", "text": "30% for a timed, online assessment consisting of a series of questions on analysis of published experimental data and bioinformatic interrogation of sequences for a specific virulence factor"},
  {"type": "p", "text": "70% for a report on the design of an experimental strategy to analyse a virulence factor."},
]

M["BS3013"]["convenors"] = [
  "Dr Andrew Millard (adm39@le.ac.uk)",
  "Professor Martha Clokie (mrjc1@le.ac.uk)",
]
M["BS3013"]["aims"] = [
  {"type": "p", "text": "The aim of this module is to provide an understanding of the current views of microbial evolution and physiology; to evaluate the continuing roles played by microbes in the environment, and to consider the non-pathogenic roles of microbes in the human body."},
]
M["BS3013"]["assessment"] = [
  {"type": "p", "text": "30% continuous assessment: Each student will be provide with a set of reads from a bacteria. Students will assemble, annotate and analyse the genome to identify the bacteria using online webtools. Analysis includes identifying the role of the organisms in the environment.  ."},
  {"type": "p", "text": "70% final assessment: Analysis of an unseen paper under examination conditions"},
]

M["BS3016"]["convenors"] = [
  "Dr Will Norton (Will.norton@le.ac.uk)",
]
M["BS3016"]["aims"] = [
  {"type": "p", "text": "The aim of this module is to bring the most recent and exciting neuroscience research at Leicester to life, to explain its background, the underlying methods and the impact of new ideas in this rapidly progressing scientific field. We aim to inform and inspire you as the next generation of neuroscientists. The module will be delivered in a series of five topics: each with a background Lecture, a Research Seminar and Journal Club, alongside guided independent study."},
  {"type": "p", "text": "This module will build on and complement the modules delivered in previous years, including: BS1060, Multicellular Organisation; BS2015, Physiology of Excitable Cells; BS2066 Behavioural Neurobiology; and complement the other third year Neuroscience modules such as BS3055, Molecular and Cellular Neuroscience, and BS3033 Physiology, Pharmacology and Behaviour."},
]
M["BS3016"]["learningOutcomes"] = [
  {"type": "p", "text": "At the end of this module students should be able to:"},
  {"type": "ul", "items": [
    "Read primary neuroscience literature in areas of current research",
    "Appreciate recent advances in neuroscience with particular references to new and developing methodologies",
    "Read, analyse and interpret published data from the neuroscience literature",
    "Demonstrate the ability to communicate research findings in writing and orally through video presentation.",
    "Participate and ask questions in a ‘Journal Club’ format.",
    "Integrate relevant information from related articles within neuroscience and propose future research directions",
  ]},
]
M["BS3016"]["assessment"] = [
  {"type": "p", "text": "Final examination. 50% of module mark"},
  {"type": "p", "text": "In the final examination, students will be required to answer two sections: one based upon a previously supplied scientific article, and one that asks questions related to data interpretation and analysis."},
  {"type": "p", "text": "Continuous assessment."},
  {"type": "p", "text": "Coursework essay 50% of module mark"},
]

M["BS3033"]["convenors"] = [
  "Dr Frank Proudlock (fap1@le.ac.uk)",
  "Dr Rebecca McLean (rjm19@le.ac.uk)",
]
M["BS3033"]["aims"] = [
  {"type": "p", "text": "The aims of the module are that students should:"},
  {"type": "ul", "items": [
    "Build on the foundations of neurophysiology, laid in the 1st and 2nd years, to develop an understanding of the cellular basis of information processing within the central nervous system.",
    "Appreciate the processes of integration within the brain with respect to the generation of higher functions of the brain and behaviour such as: (i) voluntary movement of skeletomotor and oculomotor systems, (ii) sensory processing, perception and attention; and (iii) cardiovascular and gastrointestinal regulation.",
    "Understand examples of how cellular neuropathology can lead to visual, neurological, autonomic, enteric and psychiatric diseases.",
    "Be aware of the different approaches to investigating CNS function and their limitations.",
    "Where applicable, be able to relate the knowledge and understanding gained in this module to those gained in the other neuroscience modules.",
  ]},
]
M["BS3033"]["learningOutcomes"] = [
  {"type": "p", "text": "The learning outcomes of the module are that students should, in the light of current knowledge, be able to:"},
  {"type": "ul", "items": [
    "Describe the anatomy of the brain, including major structures such that their relationship to function can be described and appraised.",
    "Explain how exogenous information (i.e. external signals) are transduced to generate sensations.",
    "Appraise the role of endogenous information (i.e. internal signals) in the formation of perception.",
    "Appraise the role of integration within the CNS with particular reference to sensori-motor integration, integration across central and peripheral systems, and integration in respect to higher functions such as attention and sensory processing.",
    "Describe the role of the semi-autonomous neural network governing gastrointestinal motility, secretion, and gut–brain communication.",
    "Describe and appraise disorders of the CNS, including higher disorders such as schizophrenia.",
  ]},
  {"type": "ul", "items": [
    "Describe some of the different approaches to investigating CNS function, including clinical testing, and compare their relative advantages and disadvantages.",
    "Critically analyse a theory of some aspects of brain function based on the use of recent research reports.",
  ]},
  {"type": "p", "text": "Detailed module information is available on the module Blackboard site."},
]
M["BS3033"]["assessment"] = [
  {"type": "p", "text": "Performance in this module will be assessed using the coursework essay with a data handling component (40%) and a final assessment (60%)."},
  {"type": "p", "text": "In the final examination (on-campus exam), students will be required to write three 500 word essays."},
]

M["BS3056"]["convenors"] = [
  "Dr Emily Allen (ew150@le.ac.uk)",
]
M["BS3056"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to teach the cellular aspects of the regulation of the cardiovascular system. The topics to be covered are: introduction to the cardiovascular system, cellular mechanisms leading to contraction of cardiac muscle, control of heart rate and contractility, role of platelets in haemostasis and thrombosis and the mechanisms underlying a number of cardiovascular diseases. The emphasis in this module will be on understanding physiological mechanisms of regulation of the cardiovascular system and how these mechanisms are altered in disease states."},
]
M["BS3056"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of this module students should, in the light of current knowledge:"},
  {"type": "ul", "items": [
    "Be able to describe the cardiovascular system and aspects of the control systems involved in its regulation.",
    "Explain the mechanisms of ion transport at the cell membrane and discuss the molecular processes in ion channel and contractile protein regulation within the CVS",
    "Be able to describe the cellular mechanisms leading to the generation and regulation of the cardiac action potential.",
    "Be able to discuss aspects of cardiac pathology and understand potential therapeutic interventions.",
    "Be able to describe signalling mechanisms involved in haemostasis and thrombosis.",
    "Be able to describe vascular physiology and pathology",
  ]},
]
M["BS3056"]["assessment"] = [
  {"type": "p", "text": "End of module assessment 60%, candidates will be required to answer a compulsory data interpretation question and two essays from a choice of six."},
  {"type": "p", "text": "Coursework 40%, a research essay based on computer generated data obtained in a practical and on existing literature."},
]

M["BS3069"]["convenors"] = [
  "Dr Cheryl Hurkett (cph9@le.ac.uk)",
]
M["BS3069"]["assessment"] = [
  {"type": "ul", "items": [
    {"text": "Coursework: Debate Position paper notes (50%)", "items": [
      "Individual submission",
      "The debate topic will be released at the start of the module",
    ]},
    {"text": "Coursework: White Paper (50%)", "items": [
      "Group submission",
      "A White Paper is very similar in structure and presentation as a normal scientific paper; they are normally very concise and are intended to provide a detailed, synoptic report on a scientific topic rather than reporting results?conclusions from a single experimental investigation.",
      "The title of the White Paper will be released at the start of the module.",
    ]},
  ]},
  {"type": "p", "text": "Please be aware that the format of these assessments is consistent between years, but the titles/topics are subject to change.  If you would like further detail on these assessments please email Dr Hurkett (cph9@le.ac.uk)."},
]

M["BS3073"]["convenors"] = [
  "Dr Rob Hammond (rh225@le.ac.uk)",
]
M["BS3073"]["assessment"] = [
  {"type": "p", "text": "End of module assessment (50%) Practical report (50%)"},
]

M["BS3080"]["convenors"] = [
  "Dr Will Norton (Will.norton@le.ac.uk)",
  "Dr Moya Burns (mlb40@le.ac.uk)",
]
M["BS3080"]["aims"] = [
  {"type": "p", "text": "The module incorporates both a class-based lecture component, and a compulsory 7-day residential field course. The field course may come at additional cost – contact the module convenor for more information. The lecture component of the module will cover topics of current research interest in behavioural ecology, the study of the adaptive function of animal behaviour viewed in the context of their natural ecosystems. You will also learn how to formulate testable hypotheses about animal behaviour, and receive training on how to design and conduct field surveys of animal behaviour to test these hypotheses. You will develop advanced statistical techniques for the quantitative analysis of behaviour. On the field course you will put this knowledge into practice, designing and conducting a field project into the adaptive value of animal behaviour."},
]
M["BS3080"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module students should be able to:"},
  {"type": "ul", "items": [
    "Demonstrate an understanding of theoretical, observational and experimental approaches to the modern study of behavioural ecology [Exam]",
    "Construct detailed accounts of the current state of knowledge in the field of behavioural ecology [Exam]",
    "Design a programme of fieldwork to test a hypothesis about the function of behaviour [Field journal]Carry out a programme of field observations and quantitative data collection safely and efficiently [Field journal]",
    "Keep a detailed, reflective account of observations and data files in a field notebook, providing a complete record of fieldwork and evidencing progression and development of scientific ideas [Field journal]",
    "Analyse data using appropriate statistical and graphical techniques [Field journal; Seminar]",
    "Present research findings verbally in a concise, clear and coherent manner and to interact with others in discussion [Seminar]",
  ]},
]
M["BS3080"]["assessment"] = [
  {"type": "p", "text": "Assessment is through two activities:"},
  {"type": "p", "text": "1. Performance at examination: 60% 2. Field skills assessment: 40%"},
]

M["MB3001"]["convenors"] = [
  "Dr Yolanda Markaki (gm365@le.ac.uk)",
  "Dr Sue Shackleton (Sue.shackleton@le.ac.uk)",
]
M["MB3001"]["aims"] = [
  {"type": "ul", "items": [
    "To gain an in-depth understanding of the biochemical and cellular defects associated with specific human conditions and diseases",
    "To develop knowledge of the experimental approaches used to investigate and design therapies for human disease",
    "To develop skills in how to critically evaluate scientific papers and analyse the data they contain",
  ]},
]
M["MB3001"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of this module students should be able to:"},
  {"type": "ul", "items": [
    "Describe the genetic and biochemical factors and the cellular defects that are involved in the development of a range of human conditions",
    "Summarise the biochemical evidence and current theories about the development of these conditions",
    "Discuss current and developing treatment strategies",
    "Analyse and draw conclusions from published scientific data",
  ]},
]
M["MB3001"]["assessment"] = [
  {"type": "p", "text": "Continuous assessment (30%): Data analysis from a research article Examination (70%): Including essay writing and data analysis tasks"},
]

M["MB3020"]["convenors"] = [
  "Dr Ed Galyov (eg98@le.ac.uk)",
]
M["MB3020"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to present advanced topics in microbial pathogenesis, molecular mechanisms of bacterial virulence and host-pathogen interactions. Furthermore, major infections in clinical settings will be described and modern approaches for vaccine development, diagnosis and treatment of microbial infections will be explained."},
]
M["MB3020"]["learningOutcomes"] = [
  {"type": "p", "text": "On completion of the module students are expected:"},
  {"type": "ul", "items": [
    "To be able to critically assess current views on the molecular mechanisms underlying bacterial virulence, drawing on evidence from the studies of host-pathogen interactions, immune responses, and lessons from history.",
    "To be able to describe the key virulence factors and systems of major bacterial pathogens, and mechanisms of their acquisition and exchange.",
    "To be able to evaluate important host-microbe interactions such as bacterial invasion and intracellular life styles of different bacterial pathogens.",
    "To be able to define host responses to bacterial infections and approaches to create effective vaccines.",
    "Have gained, in context of the above areas of microbiology, experience of assessing information from the scientific literature in electronic and written form, and its organisation through oral presentations",
  ]},
]
M["MB3020"]["assessment"] = [
  {"type": "p", "text": "Examination: 70% Continuous assessment: 30%, consisting of a case study presentation"},
]

M["MB3050"]["convenors"] = [
  "Dr Chris Talbot (cjt14@le.ac.uk)",
  "Dr Ed Hollox (ejh33@le.ac.uk)",
]
M["MB3050"]["aims"] = [
  {"type": "p", "text": "The aim of the module is to give students an appreciation of the application of genetics to a broad range of areas of modern medicine."},
]
M["MB3050"]["assessment"] = [
  {"type": "p", "text": "70% of the module mark will be based on the mid-summer end of module assessment. 30% of the module mark will come from continuous assessment consisting of an oral presentation (30%)."},
]

M["MB3057"]["convenors"] = [
  "Dr Nina Storey (ns140@le.ac.uk)",
]
M["MB3057"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to develop students’ understanding of a range of human diseases, particularly examples incorporating more novel treatment strategies and where there may be areas of unmet clinical need. Examples will be used to demonstrate current research aims, models and methods designed to facilitate the understanding, diagnosis and/or treatment of disease."},
]
M["MB3057"]["learningOutcomes"] = [
  {"type": "p", "text": "At the end of this module students should be able to:"},
  {"type": "ul", "items": [
    "appraise the underlying pathophysiology of a range of human diseases",
    "appraise current treatment strategies for a range of human diseases, showing a knowledge of inadequacies and unmet clinical need",
    "using specific examples, appraise current research aims, models and methods designed to facilitate the understanding, diagnosis and/or treatment of disease",
  ]},
]
M["MB3057"]["assessment"] = [
  {"type": "p", "text": "Assessment within this module will be by a portfolio of assessment during the module only. There will not be a final assessment during the summer assessment period. There are two assessments each worth 48% of the module mark and some mini tasks (generally a small number of MCQs) worth 4% of the module mark. The two main assessments are:"},
  {"type": "ul", "items": [
    "a report",
    "a data handling, presentation and analysis exercise",
  ]},
  {"type": "p", "text": "The format of the assessments may change to accommodate the changing landscape of, for example, generative AI."},
  {"type": "p", "text": "The two main assessments are generally run over a relatively short time-frame."},
  {"type": "p", "text": "Each of the main assessments will be based on specific components of the module (which you will be informed of); each one being based on approximately one-third of the module material. The mini tasks will be very light-touch, involving some simple tasks that will be very straightforward and quick, provided that you have engaged with the material as the module is running."},
]

M["NT3200"]["convenors"] = [
  "Professor Sarah Gretton (sng8@le.ac.uk)",
  "Dr Stuart Desjardins (sd226@le.ac.uk)",
]
M["NT3200"]["aims"] = [
  {"type": "p", "text": "The aims of this module are to provide you with the chance to gain significant experience in the sustainability sector and contribute to positive community engagement- essentially you will be working as trainee sustainability advisors. This nationally award-winning module  is a ‘work related learning’ in that it contains elements similar to that of a placement or internship. Such experience, alongside an academic qualification, allows for the development of critical employability skills. Successful completion of the portfolio assessment will give you accreditation in Carbon Literacy, which is a desirable asset for employers (we know that businesses report that they are struggling to find candidates with the right sustainability skills to fit graduate positions, and receiving this accreditation as part of the module should make you directly more employable and equipped with the right skills for addressing future challenges). You will have the chance to put those skills into action by working directly with a business to assess their sustainability audit data and generate your own sustainability baseline report in groups (Written Industry Report). Working with an interdisciplinary group will allow you to holistically address sustainability challenges and learn from the approach of other disciplines. Following completion of the group Written Industry Report, you will be supported to deliver an individual Detailed Implementation Plan for your business."},
]
M["NT3200"]["learningOutcomes"] = [
  {"type": "p", "text": "By the end of this module you will be able to:"},
  {"type": "ul", "items": [
    "Discuss the significance of the following areas when auditing sustainability: carbon/energy, waste, procurement, travel, biodiversity, community",
    "Apply sustainability auditing training to analyse real world data and conduct research on the environmental and social impact of an organisation's activities",
  ]},
  {"type": "ul", "items": [
    "Utilise problem solving and decision-making skills to make appropriate recommendations in an industry focused report",
    "Demonstrate how insights into your own carbon footprint will translate into meaningful future behaviour ensuring you are a responsible global citizen through forward planning",
    "Critique performance during the group project, then use self-reflection to articulate strengths and future development areas",
  ]},
]
M["NT3200"]["assessment"] = [
  {"type": "p", "text": "Written Industry Report (group project) – 50% Detailed Implementation Plan (Individual) – 40% Professional Reflection Portfolio (Individual) – 10%"},
]
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
              overview?, display?, linked?, field?, stream?,
              convenors?, aims?, learningOutcomes?, assessment? }
              stream   names a stream colour outright, instead of deriving it
                       from which degrees hold the module as core
              schoolCore  true when every degree holds it as core (generated)
              overview a list of bullet points for "About the module:" in
                       the details sheet — a plain string is one bullet,
                       {text, items} is a bullet with its own sub-bullets.
                       No `overview` shows "N/A" instead. From the society,
                       not the handbooks.
              convenors  a plain list of "Name (email)" strings, Year 2/3 only
              aims / learningOutcomes / assessment
                       transcribed verbatim from the Year 2/3 module
                       description PDFs (Y1 has none). Each is a list of
                       blocks: {type: "p", text} is a paragraph, {type: "ul"
                       | "ol", items} is a bulleted or numbered list — an
                       item may itself be {text, items} for one level of
                       sub-bullets. No such label in the source (or no
                       description PDF, as for Year 1 and the project) means
                       the key is absent and the details sheet shows "N/A".
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
    if m.get("convenors"): tail.append("convenors: %s" % jd(m["convenors"]))
    if m.get("aims"): tail.append("aims: %s" % jd(m["aims"]))
    if m.get("learningOutcomes"): tail.append("learningOutcomes: %s" % jd(m["learningOutcomes"]))
    if m.get("assessment"): tail.append("assessment: %s" % jd(m["assessment"]))
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
