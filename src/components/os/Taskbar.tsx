"use client";

import { AnimatePresence } from "framer-motion";
import { MonitorDown } from "lucide-react";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

import { appRegistry } from "@/config/appRegistry";
import { useI18n } from "@/context/LanguageContext";
import { useWindowManager } from "@/context/WindowManagerContext";
import { StartMenu } from "@/components/os/StartMenu";

export function Taskbar() {
  const { language, toggleLanguage, t } = useI18n();
  const { windows, activeWindowId, focusWindow, showDesktop } =
    useWindowManager();

  const [startOpen, setStartOpen] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const intervalId = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const formattedTime = useMemo(() => {
    if (!now) {
      return "--:--";
    }

    return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(now);
  }, [language, now]);

  return (
    <>
      <AnimatePresence>
        {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 right-0 z-[10000] border-t border-white/10 bg-slate-950/70 px-3 py-2 text-white shadow-2xl backdrop-blur-xl">
        <div className="flex h-12 items-center gap-2">
          <button
            type="button"
            className={clsx(
              "flex h-11 shrink-0 items-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-medium transition",
              startOpen ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
            )}
            onClick={() => setStartOpen((current) => !current)}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[rgba(var(--os-accent-rgb),0.22)] text-white">
              ✦
            </span>
            <span>{t("taskbar.start")}</span>
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto overflow-y-hidden px-1">
            {windows.length === 0 ? (
              <span className="rounded-xl px-3 py-2 text-xs text-slate-400">
                {t("taskbar.noWindows")}
              </span>
            ) : (
              windows.map((osWindow) => {
                const app = appRegistry[osWindow.appId];
                const Icon = app.icon;
                const isActive =
                  activeWindowId === osWindow.instanceId && !osWindow.minimized;

                return (
                  <button
                    key={osWindow.instanceId}
                    type="button"
                    className={clsx(
                      "flex h-11 min-w-11 max-w-48 shrink-0 items-center gap-2 rounded-2xl border px-3 text-sm transition",
                      isActive
                        ? "border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.16)] text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                    )}
                    onClick={() => focusWindow(osWindow.instanceId)}
                    title={t(app.titleKey)}
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="truncate max-sm:hidden">{t(app.titleKey)}</span>
                  </button>
                );
              })
            )}
          </div>

          <button
            type="button"
            className="flex h-11 shrink-0 items-center rounded-2xl border border-white/10 bg-white/5 px-3 text-sm transition hover:bg-white/10"
            onClick={toggleLanguage}
            title={t("taskbar.language")}
          >
            {language === "tr" ? "TR" : "EN"}
          </button>

          <div className="hidden shrink-0 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right text-xs text-slate-200 sm:block">
            {formattedTime}
          </div>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            onClick={showDesktop}
            title={t("taskbar.showDesktop")}
            aria-label={t("taskbar.showDesktop")}
          >
            <MonitorDown size={18} />
          </button>
        </div>
      </footer>
    </>
  );
}
