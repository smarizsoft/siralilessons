import { BoardType, ITCourseName, SubjectType } from '../types';

export interface TeacherProfileInfo {
  name: string;
  title: string;
  tagline: string;
  experienceOnlineYear: number;
  experienceHomeYear: number;
  totalYearsHome: number;
  totalYearsOnline: number;
  phone: string;
  whatsapp: string;
  email: string;
  location: string;
  bio: string;
  specializations: string[];
}

export const TEACHER_PROFILE: TeacherProfileInfo = {
  name: "Sir Ali",
  title: "Senior Master Tutor & IT Specialist",
  tagline: "Expert Physics, Chemistry, Math & IT Tuition for Cambridge, Federal, Karachi Board & AKU-EB",
  experienceOnlineYear: 2015,
  experienceHomeYear: 1992,
  totalYearsHome: new Date().getFullYear() - 1992, // 34+ years
  totalYearsOnline: new Date().getFullYear() - 2015, // 11+ years
  phone: "+92 302 2324503",
  whatsapp: "+92 302 2324503",
  email: "sagtut@gmail.com",
  location: "Karachi, Pakistan (Online Worldwide & Home Tuitions in Select Areas)",
  bio: "Sir Ali is a premier educator dedicated to transforming how children learn, offering elite home tuition since 1992 and interactive online classes since 2015.",
  specializations: [
    "Cambridge O-Level & IGCSE Physics (5054 / 0625)",
    "Cambridge A-Level Physics (9702) & Chemistry (9701)",
    "Cambridge Mathematics (4024 / 0580) & Add Maths (4037)",
    "Karachi Board XI/XII Physics & Chemistry (BIEK & BSEK)",
    "Federal Board (FBISE) SSC & HSSC Science Subjects",
    "AKU-EB Conceptual Learning & Past Paper Mastery",
    "Computer Science (2210 / 9618) & Professional IT Courses"
  ]
};

export const BOARDS_LIST: { id: BoardType; name: string; description: string; badge: string }[] = [
  {
    id: 'Cambridge (O Level / IGCSE / A Level)',
    name: 'Cambridge (O Level / IGCSE / A Level)',
    description: 'Syllabus-focused preparation, topical past paper drills (2000-2025), and practical paper guidance.',
    badge: 'CAIE Specialist'
  },
  {
    id: 'Karachi Board (BIEK / BSEK)',
    name: 'Karachi Board (BIEK / BSEK)',
    description: 'Comprehensive coverage of Sindh Textbook Board, numerical solving, and model paper solutions.',
    badge: 'Matrix & Inter Expert'
  },
  {
    id: 'Federal Board (FBISE)',
    name: 'Federal Board (FBISE)',
    description: 'SLO-based learning approach with focus on conceptual MCQs and targeted short answers.',
    badge: 'FBISE SLO Focused'
  },
  {
    id: 'AKU-EB (Aga Khan Board)',
    name: 'AKU-EB (Aga Khan Board)',
    description: 'Constructed response questions (CRQs) & multiple choice (MCQs) training according to AKU rubrics.',
    badge: 'AKU-EB Certified Methods'
  }
];

export const SUBJECTS_LIST: { name: SubjectType; code: string; desc: string; iconName: string }[] = [
  {
    name: 'Physics',
    code: 'CAIE 5054/9702 | STBB | FBISE',
    desc: 'Mechanics, Electricity, Waves, Quantum Physics & Experimental Skills with numerical masterclass.',
    iconName: 'Atom'
  },
  {
    name: 'Chemistry',
    code: 'CAIE 5070/9701 | Board Syllabi',
    desc: 'Organic Reaction Mechanisms, Stoichiometry, Physical Equilibrium & Practical Titrations.',
    iconName: 'FlaskConical'
  },
  {
    name: 'Mathematics',
    code: 'CAIE 4024/0580/9709 | SSC/HSSC',
    desc: 'Algebra, Trigonometry, Calculus, Vectors & Coordinate Geometry with step-by-step methodology.',
    iconName: 'Calculator'
  },
  {
    name: 'Additional Mathematics',
    code: 'CAIE 4037 / 0606',
    desc: 'Advanced Calculus, Permutations, Circular Measure, Polynomials & Vector Geometry.',
    iconName: 'Binary'
  },
  {
    name: 'Computer Science',
    code: 'CAIE 2210/9618 | Board CS',
    desc: 'Algorithm Design, Pseudocode, Python Coding, Binary Logic & Computer Architecture.',
    iconName: 'Laptop'
  }
];

export interface ITCourseConfig {
  name: ITCourseName;
  basePrice1Month: number;
  desc: string;
  modules: string[];
}

export const IT_COURSES_DATA: ITCourseConfig[] = [
  {
    name: 'Web Development (HTML, CSS, JS, React)',
    basePrice1Month: 15000,
    desc: 'Master responsive frontend web application development from scratch with modern projects.',
    modules: ['HTML5 & Semantic Layouts', 'CSS3 & Flexbox/Grid', 'Modern JavaScript (ES6+)', 'React 19 Hooks & UI Tools']
  },
  {
    name: 'Python Programming & Data Science Fundamentals',
    basePrice1Month: 16500,
    desc: 'Learn practical Python programming, logic building, NumPy, Pandas, and basic data visualization.',
    modules: ['Python Syntax & OOP', 'Data Structures', 'Pandas & File I/O', 'Data Cleaning & Plotting']
  },
  {
    name: 'Graphic Design & UI/UX Design',
    basePrice1Month: 14000,
    desc: 'Design beautiful branding, vector graphics, social media posts, and modern app wireframes.',
    modules: ['Canva & Figma Masterclass', 'Color Theory & Typography', 'Branding Kits', 'UI Prototyping']
  },
  {
    name: 'MS Office & IT Office Automation',
    basePrice1Month: 10000,
    desc: 'Essential workplace computer skills including advanced Excel formulas, Word & PowerPoint.',
    modules: ['Advanced Excel VLOOKUP/Pivots', 'Word Professional Formatting', 'PowerPoint Slide Decks', 'Email & Cloud Handling']
  },
  {
    name: 'Cyber Security & Ethical Hacking Basics',
    basePrice1Month: 18000,
    desc: 'Understand network fundamentals, security protocols, ethical hacking concepts, and digital safety.',
    modules: ['Networking Essentials', 'Web Vulnerabilities', 'Encryption & Hashes', 'System Defense']
  },
  {
    name: 'Computer Science O/A Level Practical Coding',
    basePrice1Month: 14500,
    desc: 'Targeted preparation for Paper 2 problem solving, pseudocode writing, and Python coding questions.',
    modules: ['Pseudocode Conventions', 'Arrays & Trace Tables', 'File Handling & Subroutines', 'Past Paper Solved Exercises']
  }
];

export const TESTIMONIALS = [
  {
    name: "Hamza Rehman",
    role: "A-Level Student (A* in Physics & Chemistry)",
    board: "Cambridge A-Level",
    quote: "Sir Ali's numerical techniques made A-Level Physics 9702 feel effortless. His 20+ years of past paper solutions were a game changer for my A* grade."
  },
  {
    name: "Syeda Alizeh",
    role: "Parent of O-Level Student",
    board: "Cambridge O-Level",
    quote: "We hired Sir Ali for home tuition for Additional Maths and Computer Science. He is punctual, extremely knowledgeable, and deeply dedicated."
  },
  {
    name: "Farhan Ali",
    role: "Matric 10th Position Holder",
    board: "Karachi Board (BSEK)",
    quote: "Sir's crash course before board exams boosted my Physics score to 95%. His predicted questions hit the exam paper almost directly!"
  },
  {
    name: "Daniyal Khan",
    role: "Full-Stack Web Dev Trainee",
    board: "IT Professional Course",
    quote: "Completed 2 months IT course in Web Development. Sir teaches with real live projects and personal attention that you never get in big institute batches."
  }
];
