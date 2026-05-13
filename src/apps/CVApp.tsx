"use client";

import { Download, ExternalLink, Github, Linkedin, Mail, MapPin } from "lucide-react";

import { education, experience, profile, skillGroups } from "@/data/profile";
import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";

export function CVApp() {
  const { language, t } = useI18n();

  return (
    <div className="mx-auto max-w-4xl space-y-5 text-sm text-slate-200">
      <section className="rounded-3xl border border-white/10 bg-white/[0.055] p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              {t("cv.heading")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {profile.name}
            </h1>
            <p className="mt-2 max-w-2xl leading-relaxed text-slate-300">
              {profile.headline[language]}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.14)] px-4 py-2 text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.24)]"
            >
              <Download size={16} />
              {t("cv.download")}
            </a>

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
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
            <p className="text-xs text-slate-500">{t("about.focus")}</p>
            <p className="mt-1 font-medium text-white">{profile.focus[language]}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/10 p-3">
            <p className="text-xs text-slate-500">{t("about.status")}</p>
            <p className="mt-1 font-medium text-white">{profile.status[language]}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold text-white">{t("about.education")}</h2>
          <div className="mt-4 space-y-4">
            {education.map((item) => (
              <article key={`${item.date}-${item.title}`} className="border-l border-white/10 pl-4">
                <p className="text-xs text-slate-500">{item.date}</p>
                <h3 className="mt-1 font-medium text-white">{item.title}</h3>
                {item.place && <p className="text-xs text-slate-400">{item.place}</p>}
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {item.description[language]}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold text-white">{t("about.experience")}</h2>
          <div className="mt-4 space-y-4">
            {experience.map((item) => (
              <article key={`${item.date}-${item.title}`} className="border-l border-white/10 pl-4">
                <p className="text-xs text-slate-500">{item.date}</p>
                <h3 className="mt-1 font-medium text-white">{item.title}</h3>
                {item.place && <p className="text-xs text-slate-400">{item.place}</p>}
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {item.description[language]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">{t("projects.featured")}</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {portfolioProjects.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-white/10 bg-black/10 p-4"
            >
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                {project.category[language]}
              </p>
              <h3 className="mt-1 font-semibold text-white">{project.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-300">
                {project.description[language]}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-semibold text-white">{t("about.skills")}</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {skillGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-white/10 bg-black/10 p-4"
            >
              <h3 className="font-medium text-white">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {group.description[language]}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
        <a
          href={profile.cvUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
        >
          <Download size={16} />
          {t("cv.download")}
        </a>
      </section>
    </div>
  );
}
