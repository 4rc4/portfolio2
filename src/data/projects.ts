import type { Language } from "@/i18n/translations";

type LocalizedText = Record<Language, string>;

export type PortfolioProject = {
  id: string;
  title: string;
  category: LocalizedText;
  description: LocalizedText;
  bullets: LocalizedText[];
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
    bullets: [
      {
        tr: "XP, coin ve kozmetiklerle oyunlaştırılmış odak sistemi.",
        en: "Gamified focus system with XP, coins, and cosmetics.",
      },
      {
        tr: "Flutter ile gerçek ürün gibi şekillendirildi.",
        en: "Built with Flutter and shaped like a real product.",
      },
      {
        tr: "Productivity logic ile playful UI düşüncesini karıştırıyor.",
        en: "Mixes productivity logic with playful UI thinking.",
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
    bullets: [
      {
        tr: "Ürün fikrini temiz landing page formatında açıklar.",
        en: "Explains the product idea in a clean landing page format.",
      },
      {
        tr: "Demo / APK yönlendirmeleri ve feature breakdown içerir.",
        en: "Includes demo / APK directions and feature breakdowns.",
      },
      {
        tr: "Uygulamayı gerçek release gibi sunmak için tasarlandı.",
        en: "Designed to present the app like a real release.",
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
    bullets: [
      {
        tr: "Clarity, trust ve servislere hızlı erişime odaklanır.",
        en: "Focuses on clarity, trust, and fast access to services.",
      },
      {
        tr: "Medical aesthetics content ve appointment flow içerir.",
        en: "Includes medical aesthetics content and appointment flow.",
      },
      {
        tr: "Kendi ürün fikirlerim dışında da site kurabildiğimi gösterir.",
        en: "Shows I can build outside my own product ideas too.",
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
    bullets: [
      {
        tr: "Gameplay logic ve sahne geçişleri geliştirildi.",
        en: "Gameplay logic and scene transitions were developed.",
      },
      {
        tr: "Animasyon ve müzik tarafı da projeye dahil edildi.",
        en: "Animation and music were also included in the project.",
      },
      {
        tr: "Kod, görsel ve ses tarafını aynı fikirde birleştiren solo deneyim.",
        en: "A solo experiment combining code, visuals, and audio around one idea.",
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
    bullets: [
      {
        tr: "Bilingual içerik yapısı.",
        en: "Bilingual content structure.",
      },
      {
        tr: "Motion ve kişisel görsel stil.",
        en: "Motion and personal visual style.",
      },
      {
        tr: "Projeleri klasik CV formatından daha interaktif gösterme denemesi.",
        en: "An attempt to present projects in a more interactive way than a classic CV.",
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
