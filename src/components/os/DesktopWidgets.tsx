"use client";

import { ExternalLink, FolderKanban, Mail, Sparkles } from "lucide-react";

import { profile } from "@/data/profile";
import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";
import { useWindowManager } from "@/context/WindowManagerContext";

export function DesktopWidgets() {
  const { language } = useI18n();
  const { openApp } = useWindowManager();
  const latestProject = portfolioProjects[0];

  return (
    <aside className="pointer-events-none fixed right-5 top-5 z-[5] hidden w-80 space-y-3 xl:block">
      <section className="pointer-events-auto rounded-3xl border border-white/10 bg-slate-950/42 p-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          <Sparkles size={15} />
          Current Focus
        </div>

        <h2 className="mt-3 text-lg font-semibold">{profile.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          {profile.focus[language]}
        </p>

        <button
          type="button"
          className="mt-4 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.35)] bg-[rgba(var(--os-accent-rgb),0.12)] px-4 py-2 text-sm text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.22)]"
          onClick={() => openApp("about")}
        >
          {language === "tr" ? "Profili Aç" : "Open Profile"}
        </button>
      </section>

      <section className="pointer-events-auto rounded-3xl border border-white/10 bg-slate-950/42 p-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          <FolderKanban size={15} />
          Featured Project
        </div>

        <h3 className="mt-3 font-semibold">{latestProject.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">
          {latestProject.description[language]}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
            onClick={() => openApp("projects", { projectId: latestProject.id })}
          >
            Details
          </button>

          {latestProject.liveUrl && (
            <a
              href={latestProject.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
            >
              <ExternalLink size={13} />
              Live
            </a>
          )}
        </div>
      </section>

      <section className="pointer-events-auto rounded-3xl border border-white/10 bg-slate-950/42 p-4 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          <Mail size={15} />
          Contact
        </div>

        <p className="mt-3 text-sm text-slate-300">{profile.status[language]}</p>

        <button
          type="button"
          className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
          onClick={() => openApp("contact")}
        >
          {profile.contactEmail}
        </button>
      </section>
    </aside>
  );
}
