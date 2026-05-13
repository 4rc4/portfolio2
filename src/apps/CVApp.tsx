"use client";

import { Download, ExternalLink, Github, Linkedin, Mail, MapPin, Printer } from "lucide-react";

import { education, experience, profile, skillGroups } from "@/data/profile";
import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";

export function CVApp() {
  const { language, t } = useI18n();

  const printPage = () => {
    window.print();
  };

  return (
    <div className="grid h-full min-h-0 gap-4 text-sm text-slate-200 lg:grid-cols-[340px_1fr]">
      <aside className="min-h-0 overflow-auto rounded-3xl border border-white/10 bg-white/[0.055] p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          {t("cv.heading")}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          {profile.name}
        </h1>
        <p className="mt-2 leading-relaxed text-slate-300">
          {profile.headline[language]}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.14)] px-4 py-2 text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.24)]"
          >
            <Download size={16} />
            {t("cv.download")}
          </a>

          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-slate-200 transition hover:bg-white/10"
            onClick={printPage}
          >
            <Printer size={16} />
            Print
          </button>

          <a
            href={profile.currentPortfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-slate-200 transition hover:bg-white/10"
          >
            <ExternalLink size={16} />
            {t("cv.openPortfolio")}
          </a>
        </div>

        <div className="mt-5 grid gap-3">
          <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
            <p className="text-xs text-slate-500">{t("about.role")}</p>
            <p className="mt-1 font-medium text-white">{profile.role[language]}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
            <p className="text-xs text-slate-500">{t("about.base")}</p>
            <p className="mt-1 flex items-center gap-2 font-medium text-white">
              <MapPin size={14} />
              {profile.base}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
            <p className="text-xs text-slate-500">{t("about.status")}</p>
            <p className="mt-1 font-medium text-white">{profile.status[language]}</p>
          </div>
        </div>

        <section className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4">
          <h2 className="font-semibold text-white">{t("about.skills")}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {skillGroups.flatMap((group) => group.items).slice(0, 18).map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-5 space-y-2">
          <a
            href={`mailto:${profile.contactEmail}`}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
          >
            <Mail size={16} />
            {profile.contactEmail}
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
          >
            <Github size={16} />
            GitHub
          </a>
          <a
            href={profile.linkedInUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
          >
            <Linkedin size={16} />
            LinkedIn
          </a>
        </section>
      </aside>

      <section className="flex min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-white/[0.035] px-4 py-3">
          <div>
            <p className="font-semibold text-white">PDF Viewer</p>
            <p className="text-xs text-slate-500">Yusuf-Arca-Cicek-CV.pdf</p>
          </div>

          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
          >
            Open PDF
          </a>
        </div>

        <div className="min-h-0 flex-1 bg-white">
          <iframe
            title="CV PDF Viewer"
            src={profile.cvUrl}
            className="h-full w-full bg-white"
          />
        </div>

        <div className="shrink-0 border-t border-white/10 bg-slate-950/85 px-4 py-2 text-xs text-slate-500">
          {language === "tr"
            ? "PDF mobil tarayıcıda açılmazsa Open PDF butonuyla yeni sekmede açabilirsin."
            : "If the PDF does not render in a mobile browser, open it in a new tab."}
        </div>
      </section>
    </div>
  );
}
