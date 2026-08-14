export interface TopicItem {
  id: string;
  name: string;
  hours: number;
  pricePKR: number;
}

export interface SubjectSyllabus {
  subjectName: string;
  defaultPricePKR: number;
  defaultHours: number;
  topics: TopicItem[];
}

export interface LevelCategory {
  levelName: string;
  subjects: Record<string, SubjectSyllabus>;
}

export const LEVEL_OPTIONS = [
  "Olevels",
  "Alevels",
  "Karachi Board Secondary",
  "Karachi Board Intermidiate"
] as const;

export type LevelOptionType = typeof LEVEL_OPTIONS[number];

export const CUSTOM_INVOICE_DATA: Record<string, SubjectSyllabus[]> = {
  "Olevels": [
    {
      subjectName: "Physics",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "ol-phy-1", name: "Physical Quantities & Measurement Techniques", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-2", name: "Kinematics, Distance, Velocity & Acceleration", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-3", name: "Dynamics, Mass, Weight & Density", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-4", name: "Forces, Turning Effects & Momentum", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-5", name: "Work, Energy, Power & Efficiency", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-6", name: "Pressure & Thermal Properties of Matter", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-7", name: "General Wave Properties & Electromagnetic Spectrum", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-8", name: "Light Optics, Lenses & Sound Waves", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-9", name: "Electricity, Circuits & Magnetism", hours: 2, pricePKR: 2000 },
        { id: "ol-phy-10", name: "Nuclear Physics & Radioactivity", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Chemistry",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "ol-chem-1", name: "States of Matter & Experimental Chemistry", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-2", name: "Atomic Structure, Bonding & Chemical Formulae", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-3", name: "Stoichiometry & Mole Concept Calculations", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-4", name: "Electrochemistry & Electrolysis", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-5", name: "Chemical Energetics & Rates of Reaction", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-6", name: "Acids, Bases, Salts & Redox Reactions", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-7", name: "Periodic Table, Metals & Extraction", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-8", name: "Chemistry of Environment, Air & Water", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-9", name: "Organic Chemistry Fundamentals & Hydrocarbons", hours: 2, pricePKR: 2000 },
        { id: "ol-chem-10", name: "Polymers, Functional Groups & Chemical Analysis", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Mathematics syllabus D",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "ol-math-1", name: "Number, Operations, Percentages & Ratios", hours: 2, pricePKR: 2000 },
        { id: "ol-math-2", name: "Algebra, Indices, Surds & Sequences", hours: 2, pricePKR: 2000 },
        { id: "ol-math-3", name: "Linear Equations, Inequalities & Graphs", hours: 2, pricePKR: 2000 },
        { id: "ol-math-4", name: "Quadratic Equations, Factorization & Formula", hours: 2, pricePKR: 2000 },
        { id: "ol-math-5", name: "Functions & Coordinate Geometry", hours: 2, pricePKR: 2000 },
        { id: "ol-math-6", name: "Geometry, Angles, Polygons & Circle Theorems", hours: 2, pricePKR: 2000 },
        { id: "ol-math-7", name: "Mensuration (2D & 3D Shapes, Volume)", hours: 2, pricePKR: 2000 },
        { id: "ol-math-8", name: "Trigonometry, Sine/Cosine Rule & Bearings", hours: 2, pricePKR: 2000 },
        { id: "ol-math-9", name: "Vectors, Matrices & Transformations", hours: 2, pricePKR: 2000 },
        { id: "ol-math-10", name: "Probability & Statistics (Mean, Median, Histograms)", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Additional Mathematics",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "ol-addmath-1", name: "Functions & Quadratic Functions Analysis", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-2", name: "Equations, Inequalities & Absolute Values", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-3", name: "Indices, Surds & Logarithmic Functions", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-4", name: "Polynomials, Remainder & Factor Theorems", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-5", name: "Simultaneous Equations & Linear Programming", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-6", name: "Circular Measure (Arcs, Sectors & Radians)", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-7", name: "Trigonometrical Identities & Equations", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-8", name: "Permutations & Combinations", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-9", name: "Binomial Series Expansion", hours: 2, pricePKR: 2000 },
        { id: "ol-addmath-10", name: "Differentiation, Integration & Kinematics", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Computer Science",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "ol-cs-1", name: "Data Representation (Binary, Hexadecimal & Text)", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-2", name: "Data Transmission, Packets & Encryption", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-3", name: "Computer Architecture, CPU & Storage Devices", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-4", name: "Operating Systems, Software & High-Level Languages", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-5", name: "Internet, Cyber Security & Malicious Software", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-6", name: "Automated Systems, Robotics & AI Principles", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-7", name: "Algorithm Design, Flowcharts & Trace Tables", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-8", name: "Programming Concepts (Python / Pseudocode)", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-9", name: "Databases, SQL Queries & Primary Keys", hours: 2, pricePKR: 2000 },
        { id: "ol-cs-10", name: "Boolean Logic, Truth Tables & Logic Gates", hours: 2, pricePKR: 2000 },
      ]
    }
  ],
  "Alevels": [
    {
      subjectName: "Physics",
      defaultPricePKR: 2500,
      defaultHours: 2,
      topics: [
        { id: "al-phy-1", name: "Physical Quantities, Kinematics & Dynamics (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-2", name: "Work, Energy, Power & Deformation of Solids (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-3", name: "Waves, Superposition & Interference (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-4", name: "Electric Current, DC Circuits & Resistance (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-5", name: "Particle & Nuclear Physics Fundamentals (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-6", name: "Circular Motion & Gravitational Fields (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-7", name: "Oscillations & Simple Harmonic Motion (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-8", name: "Thermodynamics & Thermal Physics (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-9", name: "Capacitance & Magnetic Fields / Induction (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-phy-10", name: "Quantum Physics, Nuclear & Medical Physics (A2)", hours: 2, pricePKR: 2500 },
      ]
    },
    {
      subjectName: "Chemistry",
      defaultPricePKR: 2500,
      defaultHours: 2,
      topics: [
        { id: "al-chem-1", name: "Atomic Structure, Periodicity & Chemical Bonding (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-2", name: "States of Matter & Reaction Energetics (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-3", name: "Kinetics, Chemical Equilibria & Le Chatelier (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-4", name: "Inorganic Chemistry (Group 2 & Group 17 Trends) (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-5", name: "Organic Chemistry (Alkanes, Alkenes, Haloalkanes) (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-6", name: "Chemical Thermodynamics, Lattice Energy & Entropy (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-7", name: "Electrochemistry & Standard Electrode Potentials (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-8", name: "Transition Elements & Complex Ions (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-9", name: "Organic Chemistry Mechanisms & Synthesis (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-chem-10", name: "Analytical Techniques (NMR, Mass Spec, IR) (A2)", hours: 2, pricePKR: 2500 },
      ]
    },
    {
      subjectName: "Mathematics",
      defaultPricePKR: 2500,
      defaultHours: 2,
      topics: [
        { id: "al-math-1", name: "Pure Math 1: Quadratics, Functions & Coordinate Geometry (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-math-2", name: "Pure Math 1: Circular Measure, Trigonometry & Series (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-math-3", name: "Pure Math 1: Differentiation & Integration (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-math-4", name: "Mechanics M1: Forces, Equilibrium & Motion Equations (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-math-5", name: "Statistics S1: Probability & Normal Distribution (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-math-6", name: "Pure Math 3: Algebra, Logarithms & Polynomials (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-math-7", name: "Pure Math 3: Complex Numbers & Trigonometry (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-math-8", name: "Pure Math 3: Advanced Calculus & Differential Equations (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-math-9", name: "Pure Math 3: Vectors in 3D Space (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-math-10", name: "Statistics S2 / Mechanics M2 Advanced Modules (A2)", hours: 2, pricePKR: 2500 },
      ]
    },
    {
      subjectName: "Further Mathematics",
      defaultPricePKR: 2500,
      defaultHours: 2,
      topics: [
        { id: "al-fm-1", name: "Roots of Polynomial Equations & Rational Functions", hours: 2, pricePKR: 2500 },
        { id: "al-fm-2", name: "Matrices, Linear Transformations & Proof by Induction", hours: 2, pricePKR: 2500 },
        { id: "al-fm-3", name: "Complex Numbers, De Moivre's Theorem & Polar Coordinates", hours: 2, pricePKR: 2500 },
        { id: "al-fm-4", name: "Hyperbolic Functions & Vector Geometry", hours: 2, pricePKR: 2500 },
        { id: "al-fm-5", name: "Further Calculus: Integration Techniques & Differential Equations", hours: 2, pricePKR: 2500 },
      ]
    },
    {
      subjectName: "Computer Science",
      defaultPricePKR: 2500,
      defaultHours: 2,
      topics: [
        { id: "al-cs-1", name: "Information Representation & Floating Point Numbers (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-2", name: "Communication, Networking & System Software (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-3", name: "Logic Gates, Boolean Algebra & Assembly Language (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-4", name: "Algorithm Design & Data Structures (Stack, Queue, List) (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-5", name: "Software Development & Database Modeling (AS)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-6", name: "Advanced Data Structures (Trees, Graphs, Hash Tables) (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-7", name: "Object-Oriented Programming (OOP) in Python (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-8", name: "Artificial Intelligence & Neural Network Principles (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-9", name: "Parallel Processing & Operating Systems (A2)", hours: 2, pricePKR: 2500 },
        { id: "al-cs-10", name: "Asynchronous Software Development & Encryption (A2)", hours: 2, pricePKR: 2500 },
      ]
    }
  ],
  "Karachi Board Secondary": [
    {
      subjectName: "Physics",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-sec-phy-1", name: "Physical Quantities & Measurement System", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-2", name: "Kinematics & Motion Equations", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-3", name: "Dynamics & Laws of Motion", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-4", name: "Turning Effects of Forces & Equilibrium", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-5", name: "Gravitation & Planetary Mechanics", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-6", name: "Work, Energy & Power", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-7", name: "Properties of Matter & Fluid Pressure", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-8", name: "Thermal Properties of Matter & Heat Transfer", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-9", name: "Waves, Sound & Reflection/Refraction of Light", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-phy-10", name: "Electricity, Magnetism & Modern Physics", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Chemistry",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-sec-chem-1", name: "Fundamentals of Chemistry & Calculations", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-2", name: "Atomic Structure & Historical Theories", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-3", name: "Periodic Table & Periodicity of Properties", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-4", name: "Chemical Bonding & Molecular Structure", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-5", name: "Physical States of Matter (Gas, Liquid, Solid)", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-6", name: "Solutions, Molarity & Solubility", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-7", name: "Electrochemistry & Electrolytic Cells", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-8", name: "Chemical Reactivity & Main Group Elements", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-9", name: "Organic Chemistry & Functional Groups", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-chem-10", name: "Environmental Chemistry & Water Purification", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Mathematics",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-sec-math-1", name: "Sets, Real Numbers & Complex Numbers", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-2", name: "Logarithms & Scientific Notation", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-3", name: "Algebraic Expressions & Formulas", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-4", name: "Factorization, HCF & LCM Problems", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-5", name: "Linear Equations & Simultaneous Systems", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-6", name: "Matrices & Determinants (Cramer's Rule)", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-7", name: "Fundamentals of Geometry & Triangles", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-8", name: "Practical Geometry & Circle Constructions", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-9", name: "Trigonometry & Height/Distance Applications", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-math-10", name: "Demonstrative Geometry Theorems", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Computer Science",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-sec-cs-1", name: "Introduction to Computer Systems & Generations", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-2", name: "Computer Architecture & Hardware Components", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-3", name: "Input/Output & Storage Devices", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-4", name: "Operating Systems & File Systems", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-5", name: "Number Systems (Binary, Octal, Decimal, Hex)", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-6", name: "Computer Software & Utility Programs", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-7", name: "Flowcharts & Problem Solving Methodology", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-8", name: "Introduction to Programming Concepts", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-9", name: "Logic Gates & Boolean Algebra Fundamentals", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-cs-10", name: "Internet, Cyber Ethics & Data Security", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Biology",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-sec-bio-1", name: "Introduction to Biology & Scientific Method", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-2", name: "Biodiversity & Classification Systems", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-3", name: "Cell Structure, Organelles & Microscopy", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-4", name: "Cell Cycle, Mitosis & Meiosis", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-5", name: "Enzymes & Bioenergetics (Photosynthesis/Respiration)", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-6", name: "Human Nutrition & Digestive System", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-7", name: "Transport in Plants & Human Circulatory System", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-8", name: "Gaseous Exchange & Respiration", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-9", name: "Homeostasis, Excretion & Osmoregulation", hours: 2, pricePKR: 2000 },
        { id: "kb-sec-bio-10", name: "Support, Movement & Nervous Coordination", hours: 2, pricePKR: 2000 },
      ]
    }
  ],
  "Karachi Board Intermidiate": [
    {
      subjectName: "Physics",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-int-phy-1", name: "Physical Quantities, Measurements & Vectors (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-2", name: "Motion, Momentum & Collision Dynamics (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-3", name: "Work, Energy, Power & Circular Motion (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-4", name: "Fluid Dynamics, Surface Tension & Viscosity (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-5", name: "Wave Motion, Sound & Physical Optics (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-6", name: "Thermodynamics & Kinetic Theory of Gases (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-7", name: "Electrostatics & Capacitance (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-8", name: "Current Electricity & DC Circuits (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-9", name: "Electromagnetism & Induction (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-phy-10", name: "Modern Physics, Nuclear Radiation & Electronics (Part II)", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Chemistry",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-int-chem-1", name: "Stoichiometry & Gas Laws (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-2", name: "Atomic Structure & Quantum Mechanics (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-3", name: "Chemical Bonding & Molecular Shapes (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-4", name: "States of Matter: Liquids & Solids (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-5", name: "Chemical Equilibrium & Reaction Kinetics (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-6", name: "Periodic Classification & s/p-Block Elements (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-7", name: "Transition Elements & Complex Ions (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-8", name: "Hydrocarbons & Alkyl Halides (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-9", name: "Alcohols, Phenols, Ethers & Carbonyls (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-chem-10", name: "Biochemistry & Industrial Chemistry (Part II)", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Mathematics",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-int-math-1", name: "Complex Numbers, Matrices & Determinants (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-2", name: "Quadratic Equations & Partial Fractions (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-3", name: "Sequences, Series & Binomial Theorem (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-4", name: "Permutations, Combinations & Probability (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-5", name: "Trigonometric Identities & Inverse Functions (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-6", name: "Functions, Limits & Continuity (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-7", name: "Differentiation & Derivative Applications (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-8", name: "Integration Techniques & Definite Integrals (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-9", name: "Analytic Geometry & Straight Lines (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-math-10", name: "Circles, Conic Sections & 3D Vectors (Part II)", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Computer Science",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-int-cs-1", name: "Overview of Computer Systems & Networks (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-2", name: "Data Communication, Modulation & Topologies (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-3", name: "Database Management Systems (DBMS) Fundamentals (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-4", name: "Relational Algebra, SQL Queries & Normalization (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-5", name: "C Programming: Basic Syntax, Data Types & Variables (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-6", name: "C Programming: Decision Making & Loops (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-7", name: "C Programming: Functions, Arrays & Strings (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-8", name: "C Programming: Pointers, Structures & File Handling (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-9", name: "Software Engineering & System Development Life Cycle (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-cs-10", name: "Web Development Fundamentals & Security (Part II)", hours: 2, pricePKR: 2000 },
      ]
    },
    {
      subjectName: "Biology",
      defaultPricePKR: 2000,
      defaultHours: 2,
      topics: [
        { id: "kb-int-bio-1", name: "Biological Molecules & Enzymes (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-2", name: "Cell Structure, Function & Bioenergetics (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-3", name: "Monera, Protista, Fungi & Plantae (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-4", name: "Animalia Diversity & Structural Organization (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-5", name: "Digestion, Circulation & Immunity (Part I)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-6", name: "Homeostasis, Excretion & Osmoregulation (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-7", name: "Support, Movement & Nervous Coordination (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-8", name: "Chemical Coordination & Hormones (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-9", name: "Reproduction & Development (Part II)", hours: 2, pricePKR: 2000 },
        { id: "kb-int-bio-10", name: "Genetics, DNA Technology & Evolution (Part II)", hours: 2, pricePKR: 2000 },
      ]
    }
  ]
};
