import type { Language } from "@/i18n/translations";

type LocalizedText = Record<Language, string>;

export type TimelineItem = {
  date: string;
  title: string;
  place?: string;
  description: LocalizedText;
};

export type SkillGroup = {
  title: string;
  description: LocalizedText;
  items: string[];
};

export const profile = {
  name: "Yusuf Arca Çiçek",
  headline: {
    tr: "Görsel düşünen, web / mobil / interaktif yazılımlar geliştiren Software Engineering öğrencisi.",
    en: "Software engineering student building web, mobile, and interactive software with a visual mind.",
  },
  heroTitle: {
    tr: "Görsel düşünen yazılımlar geliştiriyorum.",
    en: "I build software with a visual mind.",
  },
  summary: {
    tr: "Web siteleri, uygulama konseptleri ve temiz, biraz oyunlu, gerçekten kullanışlı hissettiren interaktif deneyimler geliştirmeyi seviyorum.",
    en: "I like building websites, app concepts, and interactive experiences that feel clean, a little playful, and actually useful.",
  },
  role: {
    tr: "Software Engineering Student",
    en: "Software Engineering Student",
  },
  base: "Wrocław / Istanbul",
  focus: {
    tr: "Web, mobile, UI, interactive ideas",
    en: "Web, mobile, UI, interactive ideas",
  },
  status: {
    tr: "Stajlara ve iş birliklerine açık",
    en: "Open to internships and collaborations",
  },
  contactEmail: "arcacicek1@gmail.com",
  githubUrl: "https://github.com/4rc4",
  linkedInUrl: "https://www.linkedin.com/in/yusuf-arca-cicek-030688299/",
  cvUrl: "https://4rc4.github.io/portfolio/assets/Yusuf-Arca-Cicek-CV.pdf",
  currentPortfolioUrl: "https://4rc4.github.io/portfolio/",
  intro: {
    tr: [
      "WSB Merito Wrocław'da Software Development okuyorum ve fikirleri sadece notlarda tutmak yerine gerçek projelere dönüştürerek öğrenmeyi tercih ediyorum.",
      "Kodla görsel tarafı birleştiren işler ilgimi çekiyor. Bu yüzden arayüzler, animasyon, interaction ve ürün fikirleri benim için sadece arka planda logic yazmaktan daha motive edici.",
      "Bu portfolio olduğumdan büyük görünmeye çalışmıyor. Yaptıklarımı, öğrendiklerimi ve nasıl bir geliştiriciye dönüştüğümü temiz bir şekilde gösteriyor.",
    ],
    en: [
      "I study Software Development at WSB Merito Wrocław and prefer learning by turning ideas into real projects instead of keeping them in notes.",
      "My interests naturally mix code with visuals. That is why I enjoy interfaces, animation, interaction, and product ideas — not just writing logic in the background.",
      "This portfolio is not trying to sound bigger than I am. It is a clean selection of what I made, what I learned, and what kind of developer I am becoming.",
    ],
  },
  buildAreas: [
    "Web design",
    "Mobile app ideas",
    "Interactive UI",
    "Product thinking",
    "Frontend animation",
    "Game feel",
  ],
  coreTools: [
    "HTML",
    "CSS",
    "JavaScript",
    "Flutter",
    "Dart",
    "Unity",
    "Python",
    "Supabase",
    "GitHub",
  ],
  softStrengths: [
    "Fast learner",
    "Team adaptable",
    "Visual thinking",
    "Motivated",
  ],
  languages: [
    {
      name: "English",
      level: "B2–C1",
    },
    {
      name: "Turkish",
      level: "Native",
    },
    {
      name: "Polish",
      level: "Beginner",
    },
  ],
  hobbies: ["Drawing", "Creating music", "Creating animation"],
};

export const education: TimelineItem[] = [
  {
    date: "2023 — Present",
    title: "WSB Merito Wrocław",
    place: "Software Development",
    description: {
      tr: "Software Development öğrencisi, şu anda üçüncü yıl.",
      en: "Software Development student, currently in the third year.",
    },
  },
  {
    date: "2025 — Present",
    title: "Fullstack Web Development Course",
    place: "Udemy",
    description: {
      tr: "Web geliştirme tarafında frontend, backend ve pratik proje yapısını geliştirmek için devam eden kurs.",
      en: "Ongoing course to improve frontend, backend, and practical project structure.",
    },
  },
  {
    date: "2025 — Present",
    title: "Unity Course",
    place: "Udemy",
    description: {
      tr: "Unity, sahne mantığı, oyun yapısı ve interaktif deneyimler üzerine devam eden çalışma.",
      en: "Ongoing study around Unity, scene logic, game structure, and interactive experiences.",
    },
  },
];

export const experience: TimelineItem[] = [
  {
    date: "2025 — Present",
    title: "Courier",
    place: "Eternis · Wrocław",
    description: {
      tr: "Software studies ve kişisel projeler devam ederken Wrocław'da courier işi.",
      en: "Courier work in Wrocław while continuing software studies and personal projects.",
    },
  },
  {
    date: "2024 — 2025",
    title: "Laborer",
    place: "QSense · Wrocław",
    description: {
      tr: "Ağır batarya ünitelerini güvenli ve verimli şekilde taşıma ve ekip içinde çalışma.",
      en: "Team-based labor work handling heavy battery units safely and efficiently.",
    },
  },
  {
    date: "2024",
    title: "Barista / Waiter / Cashier",
    place: "Cafe Mola · Turkey",
    description: {
      tr: "Yoğun tempolu ortamda müşteri hizmeti, barista, garson ve kasa görevleri.",
      en: "Customer service, barista, waiter, and cashier tasks in a fast-paced environment.",
    },
  },
  {
    date: "2023",
    title: "Logistic Assistant",
    place: "Aras Kargo · Turkey",
    description: {
      tr: "Gönderi, iade, pickup ve sistem girişi gibi günlük lojistik operasyonlarına destek.",
      en: "Supported logistics operations with shipments, returns, pickups, and system entries.",
    },
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    description: {
      tr: "HTML, CSS, JavaScript, responsive layout ve motion içeren arayüz çalışmaları.",
      en: "HTML, CSS, JavaScript, responsive layout work, and interfaces with motion.",
    },
    items: ["HTML", "CSS", "JavaScript", "Responsive UI", "Motion"],
  },
  {
    title: "Mobile",
    description: {
      tr: "Flutter ve Dart ile app structure, ekran akışları ve feature düşünme.",
      en: "Flutter and Dart, especially for app structure, screens, and feature thinking.",
    },
    items: ["Flutter", "Dart", "App screens", "Feature flow"],
  },
  {
    title: "Backend & Data",
    description: {
      tr: "Python, SQL temelleri, Supabase ve web backend / deployment öğrenimi.",
      en: "Python, SQL basics, Supabase, and ongoing learning in web backend and deployment.",
    },
    items: ["Python", "SQL basics", "Supabase", "Deployment basics"],
  },
  {
    title: "Creative Side",
    description: {
      tr: "Çizim, animasyon, müzik üretimi ve interaktif storytelling.",
      en: "Drawing, animation, music creation, and interactive storytelling.",
    },
    items: ["Drawing", "Animation", "Music", "Storytelling"],
  },
];
