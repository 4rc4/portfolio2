export type VFSNodeType = "folder" | "file";

export type VFSNode = {
  id: string;
  name: string;
  type: VFSNodeType;
  size?: string;
  modified: string;
  description?: string;
  children?: VFSNode[];
};

export const virtualFileSystem: VFSNode = {
  id: "root",
  name: "root",
  type: "folder",
  modified: "2026-05-13",
  children: [
    {
      id: "home",
      name: "home",
      type: "folder",
      modified: "2026-05-13",
      children: [
        {
          id: "user",
          name: "yusuf-arca-cicek",
          type: "folder",
          modified: "2026-05-13",
          children: [
            {
              id: "projects",
              name: "projects",
              type: "folder",
              modified: "2026-05-13",
              children: [
                {
                  id: "catudy",
                  name: "catudy",
                  type: "folder",
                  modified: "2026-05-13",
                  description:
                    "Flutter productivity app concept with timer, XP, rewards, cosmetics, pet system, reminders, calendar and multiplayer lobby.",
                  children: [
                    {
                      id: "catudy-readme",
                      name: "README.md",
                      type: "file",
                      size: "8 KB",
                      modified: "2026-05-13",
                      description:
                        "Catudy overview: gamified focus system with XP, coins, cosmetics and playful UI thinking.",
                    },
                    {
                      id: "catudy-stack",
                      name: "stack.json",
                      type: "file",
                      size: "2 KB",
                      modified: "2026-05-13",
                      description:
                        "Flutter, Dart, Supabase and gamification notes.",
                    },
                  ],
                },
                {
                  id: "catudy-website",
                  name: "catudy-website",
                  type: "folder",
                  modified: "2026-05-13",
                  description:
                    "Bilingual product website for Catudy with demo links, feature sections and product presentation.",
                  children: [
                    {
                      id: "catudy-site-index",
                      name: "index.html",
                      type: "file",
                      size: "18 KB",
                      modified: "2026-05-13",
                      description:
                        "Landing page for the Catudy concept.",
                    },
                    {
                      id: "catudy-site-links",
                      name: "links.url",
                      type: "file",
                      size: "1 KB",
                      modified: "2026-05-13",
                      description:
                        "Live: https://4rc4.github.io/Catudy-Site/ · Repo: https://github.com/4rc4/Catudy-Site",
                    },
                  ],
                },
                {
                  id: "dr-hicran",
                  name: "dr-hicran-unlu-website",
                  type: "folder",
                  modified: "2026-05-13",
                  description:
                    "Client-style dermatology clinic website focused on clarity, trust and appointment flow.",
                  children: [
                    {
                      id: "dr-site-index",
                      name: "index.html",
                      type: "file",
                      size: "16 KB",
                      modified: "2026-05-13",
                      description:
                        "Responsive clinic website structure with service sections and appointment CTA.",
                    },
                    {
                      id: "dr-site-links",
                      name: "links.url",
                      type: "file",
                      size: "1 KB",
                      modified: "2026-05-13",
                      description:
                        "Live: https://4rc4.github.io/drhicranunlu/ · Repo: https://github.com/4rc4/drhicranunlu",
                    },
                  ],
                },
                {
                  id: "unity-story-game",
                  name: "unity-story-game",
                  type: "folder",
                  modified: "2026-05-13",
                  description:
                    "Narrative Unity mini-game with gameplay logic, animations, scene transitions and original music.",
                  children: [
                    {
                      id: "unity-game-notes",
                      name: "game-notes.md",
                      type: "file",
                      size: "5 KB",
                      modified: "2026-05-13",
                      description:
                        "Solo Unity story game notes.",
                    },
                  ],
                },
                {
                  id: "interactive-portfolio",
                  name: "interactive-portfolio",
                  type: "folder",
                  modified: "2026-05-13",
                  description:
                    "Bilingual animated portfolio built with a more cinematic and personal feeling.",
                  children: [
                    {
                      id: "portfolio-live",
                      name: "live-site.url",
                      type: "file",
                      size: "1 KB",
                      modified: "2026-05-13",
                      description:
                        "Live: https://4rc4.github.io/portfolio/",
                    },
                  ],
                },
              ],
            },
            {
              id: "documents",
              name: "documents",
              type: "folder",
              modified: "2026-05-13",
              children: [
                {
                  id: "cv",
                  name: "Yusuf-Arca-Cicek-CV.pdf",
                  type: "file",
                  size: "1 page",
                  modified: "2026-05-13",
                  description:
                    "CV with education, work experience, projects, skills, languages and contact details.",
                },
                {
                  id: "contact",
                  name: "contact.txt",
                  type: "file",
                  size: "1 KB",
                  modified: "2026-05-13",
                  description:
                    "Email: arcacicek1@gmail.com · GitHub: https://github.com/4rc4 · LinkedIn: yusuf-arca-cicek-030688299",
                },
              ],
            },
            {
              id: "skills",
              name: "skills",
              type: "folder",
              modified: "2026-05-13",
              children: [
                {
                  id: "frontend",
                  name: "frontend.md",
                  type: "file",
                  size: "2 KB",
                  modified: "2026-05-13",
                  description:
                    "HTML, CSS, JavaScript, responsive layout and motion interfaces.",
                },
                {
                  id: "mobile",
                  name: "mobile.md",
                  type: "file",
                  size: "2 KB",
                  modified: "2026-05-13",
                  description:
                    "Flutter and Dart app structure, screens and feature thinking.",
                },
                {
                  id: "creative",
                  name: "creative-side.md",
                  type: "file",
                  size: "2 KB",
                  modified: "2026-05-13",
                  description:
                    "Drawing, animation, music creation and interactive storytelling.",
                },
              ],
            },
            {
              id: "desktop",
              name: "desktop",
              type: "folder",
              modified: "2026-05-13",
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
