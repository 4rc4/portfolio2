"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

import { appRegistry } from "@/config/appRegistry";
import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationContext";
import { useOSSettings } from "@/context/OSSettingsContext";
import { useWindowManager } from "@/context/WindowManagerContext";

type CommandItem = {
  id: string;
  title: string;
  subtitle: string;
  keywords: string;
  action: () => void;
};

export function CommandPalette() {
  const { language, setLanguage, t } = useI18n();
  const { notify } = useNotifications();
  const { openApp } = useWindowManager();
  const { setThemeMode, setWallpaperId, setAccentColorId } = useOSSettings();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands = useMemo<CommandItem[]>(() => {
    const appCommands: CommandItem[] = Object.values(appRegistry).map((app) => ({
      id: `app-${app.id}`,
      title: `${t("command.open")} ${t(app.titleKey)}`,
      subtitle: "Application",
      keywords: `${app.id} ${app.title} ${t(app.titleKey)}`,
      action: () => openApp(app.id),
    }));

    const projectCommands: CommandItem[] = portfolioProjects.map((project) => ({
      id: `project-${project.id}`,
      title: project.title,
      subtitle: project.category[language],
      keywords: `${project.title} ${project.description[language]} ${project.stack.join(" ")}`,
      action: () => openApp("projects", { projectId: project.id }),
    }));

    const actionCommands: CommandItem[] = [
      {
        id: "theme-dark",
        title: "Theme: Dark",
        subtitle: t("command.actions"),
        keywords: "theme dark",
        action: () => {
          setThemeMode("dark");
          setWallpaperId("midnight-grid");
          setAccentColorId("cyan");
        },
      },
      {
        id: "theme-violet",
        title: "Theme: Violet",
        subtitle: t("command.actions"),
        keywords: "theme violet purple",
        action: () => {
          setThemeMode("dark");
          setWallpaperId("violet-glass");
          setAccentColorId("violet");
        },
      },
      {
        id: "language-toggle",
        title: language === "tr" ? "Switch to English" : "Türkçeye geç",
        subtitle: t("taskbar.language"),
        keywords: "language tr en turkish english",
        action: () => setLanguage(language === "tr" ? "en" : "tr"),
      },
    ];

    return [...appCommands, ...projectCommands, ...actionCommands];
  }, [
    language,
    openApp,
    setAccentColorId,
    setLanguage,
    setThemeMode,
    setWallpaperId,
    t,
  ]);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return commands;
    }

    return commands.filter((command) =>
      `${command.title} ${command.subtitle} ${command.keywords}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [commands, query]);

  const runCommand = (command: CommandItem) => {
    command.action();
    notify({
      title: t("notify.appOpened"),
      message: command.title,
      tone: "success",
    });
    setOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[18000] flex items-start justify-center bg-black/45 px-4 pt-[10vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => setOpen(false)}
        >
          <motion.div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950/88 text-white shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <label className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
              <Search size={20} className="text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("command.search")}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-500"
              />
              <span className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-slate-400">
                Ctrl K
              </span>
            </label>

            <div className="max-h-[55vh] overflow-auto p-2">
              {filteredCommands.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">
                  {t("command.noResults")}
                </p>
              ) : (
                filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    type="button"
                    className={clsx(
                      "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/10",
                      index === 0 && "bg-white/[0.04]"
                    )}
                    onClick={() => runCommand(command)}
                  >
                    <span>
                      <span className="block text-sm font-medium text-white">
                        {command.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {command.subtitle}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
