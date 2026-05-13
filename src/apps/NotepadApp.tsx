"use client";

import { FileText, Save } from "lucide-react";
import { useMemo, useState } from "react";

import { profile, education, experience, skillGroups } from "@/data/profile";
import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";
import type { AppComponentProps } from "@/types/window";

const storageKey = "portfolio-os-notepad-content";

function buildReadme(language: "tr" | "en") {
  const projectLines = portfolioProjects
    .map((project) => `- ${project.title}: ${project.description[language]}`)
    .join("\n");

  const skillLines = skillGroups
    .map((group) => `- ${group.title}: ${group.items.join(", ")}`)
    .join("\n");

  const educationLines = education
    .map((item) => `- ${item.date} — ${item.title}${item.place ? ` / ${item.place}` : ""}`)
    .join("\n");

  const experienceLines = experience
    .map((item) => `- ${item.date} — ${item.title}${item.place ? ` / ${item.place}` : ""}`)
    .join("\n");

  if (language === "tr") {
    return `README.txt

${profile.name}
${profile.role.tr}

Kısa Tanıtım
${profile.summary.tr}

Odak
${profile.focus.tr}

Projeler
${projectLines}

Skills
${skillLines}

Eğitim
${educationLines}

İş Deneyimi
${experienceLines}

İletişim
Email: ${profile.contactEmail}
GitHub: ${profile.githubUrl}
LinkedIn: ${profile.linkedInUrl}
`;
  }

  return `README.txt

${profile.name}
${profile.role.en}

Short Introduction
${profile.summary.en}

Focus
${profile.focus.en}

Projects
${projectLines}

Skills
${skillLines}

Education
${educationLines}

Experience
${experienceLines}

Contact
Email: ${profile.contactEmail}
GitHub: ${profile.githubUrl}
LinkedIn: ${profile.linkedInUrl}
`;
}

export function NotepadApp({ launchData }: AppComponentProps) {
  const { language } = useI18n();

  const launchContent =
    typeof launchData?.content === "string" ? launchData.content : null;

  const launchFileName =
    typeof launchData?.fileName === "string" ? launchData.fileName : null;

  const defaultReadme = useMemo(() => buildReadme(language), [language]);

  const [fileName, setFileName] = useState(launchFileName ?? "README.txt");
  const [content, setContent] = useState(() => {
    if (launchContent) {
      return launchContent;
    }

    if (typeof window !== "undefined") {
      return window.localStorage.getItem(storageKey) ?? defaultReadme;
    }

    return defaultReadme;
  });

  const save = () => {
    window.localStorage.setItem(storageKey, content);
  };

  const loadReadme = () => {
    setFileName("README.txt");
    setContent(defaultReadme);
  };

  const loadProjectNotes = () => {
    setFileName("project-notes.txt");
    setContent(
      portfolioProjects
        .map((project) => {
          const built = project.whatBuilt
            .map((item) => `  - ${item[language]}`)
            .join("\n");

          const learned = project.whatLearned
            .map((item) => `  - ${item[language]}`)
            .join("\n");

          return `${project.title}

${project.description[language]}

What I built:
${built}

What I learned:
${learned}`;
        })
        .join("\n\n---\n\n")
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 text-sm text-slate-200">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.035] p-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <FileText size={17} className="text-slate-400" />
          <input
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
          />
        </div>

        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
          onClick={loadReadme}
        >
          README
        </button>

        <button
          type="button"
          className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
          onClick={loadProjectNotes}
        >
          Project Notes
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.35)] bg-[rgba(var(--os-accent-rgb),0.12)] px-3 py-2 text-xs text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.22)]"
          onClick={save}
        >
          <Save size={15} />
          Save
        </button>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-0 flex-1 resize-none bg-black/35 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none"
        spellCheck={false}
      />
    </div>
  );
}
