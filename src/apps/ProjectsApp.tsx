"use client";

import { ExternalLink, Github, Maximize2, MonitorPlay, Search, X } from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";
import type { AppComponentProps } from "@/types/window";

export function ProjectsApp({ launchData }: AppComponentProps) {
  const { language, t } = useI18n();

  const initialProjectId =
    typeof launchData?.projectId === "string"
      ? launchData.projectId
      : portfolioProjects[0].id;

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [fullscreenPreviewOpen, setFullscreenPreviewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [techFilter, setTechFilter] = useState("all");

  useEffect(() => {
    if (typeof launchData?.projectId === "string") {
      setSelectedProjectId(launchData.projectId);
      setPreviewOpen(false);
      setFullscreenPreviewOpen(false);
    }
  }, [launchData]);

  const allTech = useMemo(() => {
    const values = new Set<string>();

    portfolioProjects.forEach((project) => {
      project.stack.forEach((item) => values.add(item));
    });

    return Array.from(values).sort();
  }, []);

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return portfolioProjects.filter((project) => {
      const matchesSearch =
        !normalizedSearch ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.description[language].toLowerCase().includes(normalizedSearch) ||
        project.stack.some((item) => item.toLowerCase().includes(normalizedSearch));

      const matchesTech =
        techFilter === "all" || project.stack.includes(techFilter);

      return matchesSearch && matchesTech;
    });
  }, [language, searchQuery, techFilter]);

  const selectedProject = useMemo(() => {
    return (
      portfolioProjects.find((project) => project.id === selectedProjectId) ??
      filteredProjects[0] ??
      portfolioProjects[0]
    );
  }, [filteredProjects, selectedProjectId]);

  return (
    <div className="grid h-full min-h-0 gap-4 md:grid-cols-[300px_1fr]">
      <aside className="min-h-0 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-3">
        <p className="mb-3 px-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          {t("projects.featured")}
        </p>

        <div className="mb-3 space-y-2">
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-400">
            <Search size={15} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("projects.search")}
              className="min-w-0 flex-1 bg-transparent text-slate-200 outline-none placeholder:text-slate-500"
            />
          </label>

          <select
            value={techFilter}
            onChange={(event) => setTechFilter(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 outline-none"
          >
            <option value="all">{t("projects.allTech")}</option>
            {allTech.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          {filteredProjects.map((project) => {
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
                  setFullscreenPreviewOpen(false);
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

          {filteredProjects.length === 0 && (
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-500">
              {t("command.noResults")}
            </p>
          )}
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
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.12)] px-4 py-2 text-sm text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.22)]"
                  onClick={() => setPreviewOpen((current) => !current)}
                >
                  <MonitorPlay size={17} />
                  <span>{t("projects.openPreview")}</span>
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
                  onClick={() => {
                    setPreviewOpen(true);
                    setFullscreenPreviewOpen(true);
                  }}
                >
                  <Maximize2 size={17} />
                  <span>{t("projects.fullscreenPreview")}</span>
                </button>
              </div>
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

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t("projects.whatBuilt")}
              </p>

              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-300">
                {selectedProject.whatBuilt.map((bullet) => (
                  <li key={bullet.en}>{bullet[language]}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {t("projects.whatLearned")}
              </p>

              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-300">
                {selectedProject.whatLearned.map((bullet) => (
                  <li key={bullet.en}>{bullet[language]}</li>
                ))}
              </ul>
            </div>
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

      <AnimatePresence>
        {fullscreenPreviewOpen && selectedProject.previewUrl && (
          <motion.div
            className="fixed inset-0 z-[19000] bg-slate-950/95 p-3 text-white backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{selectedProject.title}</p>
                  <p className="truncate text-xs text-slate-500">
                    {selectedProject.previewUrl}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/15 hover:text-white"
                  onClick={() => setFullscreenPreviewOpen(false)}
                  aria-label={t("projects.closePreview")}
                >
                  <X size={18} />
                </button>
              </div>

              <iframe
                title={`${selectedProject.title} fullscreen preview`}
                src={selectedProject.previewUrl}
                className="min-h-0 flex-1 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
