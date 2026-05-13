import type { Language } from "@/i18n/translations";

type LocalizedText = Record<Language, string>;

export type PortfolioProject = {
  id: string;
  title: string;
  category: LocalizedText;
  description: LocalizedText;
  whatBuilt: LocalizedText[];
  whatLearned: LocalizedText[];
  stack: string[];
  status: LocalizedText;
  previewUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "catudy-app",
    title: "Catudy",
    category: {
      tr: "Flutter app / productivity",
      en: "Flutter app / productivity",
    },
    description: {
      tr: "Timer, XP, ödüller, kozmetikler, takvim, hatırlatıcılar, pet sistemi ve multiplayer lobby fikrini tek üründe birleştiren focus-productivity app konsepti.",
      en: "A focus-productivity app concept that combines the timer, XP, rewards, cosmetics, calendar, reminders, pet system, and multiplayer lobby idea in one product.",
    },
    whatBuilt: [
      {
        tr: "XP, coin ve kozmetiklerle oyunlaştırılmış odak sistemi.",
        en: "A gamified focus system with XP, coins, and cosmetics.",
      },
      {
        tr: "Flutter ile gerçek ürün gibi şekillenen mobil app yapısı.",
        en: "A mobile app structure shaped like a real product using Flutter.",
      },
      {
        tr: "Pet room, shop, focus timer ve multiplayer lobby fikri.",
        en: "Pet room, shop, focus timer, and multiplayer lobby concept.",
      },
    ],
    whatLearned: [
      {
        tr: "Ürün fikrini sadece UI olarak değil, motivation loop olarak düşünmeyi öğrendim.",
        en: "I learned to think about the product not only as UI, but as a motivation loop.",
      },
      {
        tr: "State, navigation ve feature scope kontrolünün önemini gördüm.",
        en: "I understood the importance of state, navigation, and feature scope control.",
      },
    ],
    stack: ["Flutter", "Dart", "Supabase", "Gamification"],
    status: {
      tr: "Aktif prototip",
      en: "Active prototype",
    },
    repoUrl: "https://github.com/4rc4/CatudyV2",
    liveUrl: "https://4rc4.github.io/Catudy-Site/",
    previewUrl: "https://4rc4.github.io/Catudy-Site/",
  },
  {
    id: "catudy-site",
    title: "Catudy Website",
    category: {
      tr: "Bilingual product website",
      en: "Bilingual product website",
    },
    description: {
      tr: "Catudy konseptini bilingual içerik, feature bölümleri, demo linkleri ve daha net ürün sunumuyla anlatan landing page.",
      en: "A website to demonstrate the Catudy concept with bilingual content, feature sections, demo links, and a clearer product presentation.",
    },
    whatBuilt: [
      {
        tr: "TR/EN destekli product landing page.",
        en: "TR/EN product landing page.",
      },
      {
        tr: "Feature kartları, demo yönlendirmeleri ve ürün anlatımı.",
        en: "Feature cards, demo directions, and product explanation.",
      },
    ],
    whatLearned: [
      {
        tr: "Bir uygulama fikrini sadece yapmak değil, anlaşılır şekilde sunmak gerektiğini öğrendim.",
        en: "I learned that building an app idea is not enough; it also needs to be presented clearly.",
      },
    ],
    stack: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    status: {
      tr: "Yayında",
      en: "Live",
    },
    repoUrl: "https://github.com/4rc4/Catudy-Site",
    liveUrl: "https://4rc4.github.io/Catudy-Site/",
    previewUrl: "https://4rc4.github.io/Catudy-Site/",
  },
  {
    id: "dr-hicran",
    title: "Dr. Hicran Ünlü Website",
    category: {
      tr: "Client-style website",
      en: "Client-style website",
    },
    description: {
      tr: "Dermatoloji kliniği için service sections, appointment CTA, temiz yapı ve güven odaklı sunum stili içeren website.",
      en: "A website for a dermatology clinic with service sections, appointment CTA, a clean structure, and a more trust-based presentation style.",
    },
    whatBuilt: [
      {
        tr: "Medical aesthetics odaklı responsive website.",
        en: "Responsive website focused on medical aesthetics.",
      },
      {
        tr: "Servis bölümleri ve appointment CTA yapısı.",
        en: "Service sections and appointment CTA structure.",
      },
    ],
    whatLearned: [
      {
        tr: "Kişisel ürünlerden farklı olarak daha güven veren ve net bir client-site dili kurmayı öğrendim.",
        en: "I learned to create a more trustworthy and clear client-site language outside my own product ideas.",
      },
    ],
    stack: ["HTML", "CSS", "JavaScript", "Responsive"],
    status: {
      tr: "Yayında",
      en: "Live",
    },
    repoUrl: "https://github.com/4rc4/drhicranunlu",
    liveUrl: "https://4rc4.github.io/drhicranunlu/",
    previewUrl: "https://4rc4.github.io/drhicranunlu/",
  },
  {
    id: "unity-story-game",
    title: "Unity Story Game",
    category: {
      tr: "Solo Unity project",
      en: "Solo Unity project",
    },
    description: {
      tr: "Gameplay logic, animasyonlar, scene transitions ve orijinal müzik içeren narrative mini-game.",
      en: "A narrative mini-game developed solo, including gameplay logic, animations, scene transitions, and original music.",
    },
    whatBuilt: [
      {
        tr: "Gameplay logic, sahne geçişleri ve animasyonlar.",
        en: "Gameplay logic, scene transitions, and animations.",
      },
      {
        tr: "Projenin müzik tarafını da kendim ürettim.",
        en: "I also created the music side of the project myself.",
      },
    ],
    whatLearned: [
      {
        tr: "Kod, görsel ve sesin aynı deneyimde nasıl birleştiğini daha iyi anladım.",
        en: "I better understood how code, visuals, and sound can come together in one experience.",
      },
    ],
    stack: ["Unity", "Animation", "Music"],
    status: {
      tr: "Solo çalışma",
      en: "Solo project",
    },
  },
  {
    id: "interactive-portfolio",
    title: "Interactive Portfolio",
    category: {
      tr: "Meta project / portfolio",
      en: "Meta project / portfolio",
    },
    description: {
      tr: "Bu portfolio sitesinin kendisi: çalışmaları daha cinematic ve kişisel bir hisle sunmak için tasarlanmış bilingual, animated portfolio.",
      en: "This website itself: a bilingual, animated portfolio built to present work with a more cinematic and personal feeling.",
    },
    whatBuilt: [
      {
        tr: "Bilingual portfolio yapısı.",
        en: "Bilingual portfolio structure.",
      },
      {
        tr: "Motion ve kişisel görsel dil.",
        en: "Motion and personal visual style.",
      },
    ],
    whatLearned: [
      {
        tr: "Portfolyonun sadece bilgi değil, karakter de göstermesi gerektiğini gördüm.",
        en: "I learned that a portfolio should show not only information, but also character.",
      },
    ],
    stack: ["HTML", "CSS", "JavaScript", "Motion"],
    status: {
      tr: "Yayında",
      en: "Live",
    },
    liveUrl: "https://4rc4.github.io/portfolio/",
    previewUrl: "https://4rc4.github.io/portfolio/",
  },
];
