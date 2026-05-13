"use client";

import { ExternalLink, Github, MonitorPlay } from "lucide-react";
import clsx from "clsx";
import { useMemo, useState } from "react";

import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";

export function ProjectsApp() {
  const { language, t } = useI18n();
  const [selectedProjectId, setSelectedProjectId] = useState(
    portfolioProjects[0].id
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  const selectedProject = useMemo(() => {
    return (
      portfolioProjects.find((project) => project.id === selectedProjectId) ??
      portfolioProjects[0]
    );
  }, [selectedProjectId]);

  return (
    <div className="grid h-full min-h-0 gap-4 md:grid-cols-[280px_1fr]">
      <aside className="min-h-0 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          {t("projects.featured")}
        </p>

        <div className="space-y-2">
          {portfolioProjects.map((project) => {
            const isSelected = selectedProject.id === project.id;

            return (
              <button
                key={project.id}
                type="button"
                className={clsx(
                  "w-full rounded-2xl border p-3 text-left transition",
                  isSelected
                    ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.14)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                )}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setPreviewOpen(false);
                }}
              >
                <p className="text-[11px] uppercase tracking-wide text-slate-500">
                  {project.category[language]}
                </p>
                <h3 className="mt-1 font-semibold text-white">{project.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                  {project.description[language]}
                </p>
              </button>
            );
          })}
        </div>
      </aside>

      <section className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div className="shrink-0 border-b border-white/10 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {selectedProject.category[language]}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {selectedProject.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
                {selectedProject.description[language]}
              </p>
            </div>

            {selectedProject.previewUrl && (
              <button
                type="button"
                className="flex items-center gap-2 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.12)] px-4 py-2 text-sm text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.22)]"
                onClick={() => setPreviewOpen((current) => !current)}
              >
                <MonitorPlay size={17} />
                <span>{t("projects.openPreview")}</span>
              </button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t("projects.stack")}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedProject.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t("projects.status")}
              </p>
              <p className="mt-3 text-sm text-white">
                {selectedProject.status[language]}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Links
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedProject.repoUrl && (
                  <a
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                    href={selectedProject.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github size={15} />
                    {t("projects.repo")}
                  </a>
                )}

                {selectedProject.liveUrl && (
                  <a
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={15} />
                    {t("projects.live")}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              {t("projects.details")}
            </p>

            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-300">
              {selectedProject.bullets.map((bullet) => (
                <li key={bullet.en}>{bullet[language]}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
              <p className="text-sm font-medium text-white">
                {t("projects.preview")}
              </p>
              <p className="truncate text-xs text-slate-500">
                {selectedProject.previewUrl ?? t("projects.noPreview")}
              </p>
            </div>

            {selectedProject.previewUrl && previewOpen ? (
              <iframe
                title={`${selectedProject.title} preview`}
                src={selectedProject.previewUrl}
                className="h-[420px] w-full bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : (
              <div className="flex h-[260px] items-center justify-center p-6 text-center text-sm text-slate-500">
                {selectedProject.previewUrl
                  ? t("projects.openPreview")
                  : t("projects.noPreview")}
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">{t("projects.note")}</p>
        </div>
      </section>
    </div>
  );
}
