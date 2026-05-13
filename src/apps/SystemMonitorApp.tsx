"use client";

import { Activity, Cpu, Gauge, Languages, Palette, Timer, Workflow } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { appRegistry } from "@/config/appRegistry";
import { useI18n } from "@/context/LanguageContext";
import { useOSSettings } from "@/context/OSSettingsContext";
import { useWindowManager } from "@/context/WindowManagerContext";

function formatUptime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");
}

export function SystemMonitorApp() {
  const { language, t } = useI18n();
  const { windows, activeWindowId } = useWindowManager();
  const { themeMode, accentColor } = useOSSettings();

  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setUptime((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeWindow = useMemo(() => {
    return windows.find((windowItem) => windowItem.instanceId === activeWindowId) ?? null;
  }, [activeWindowId, windows]);

  const cpuValue = 18 + windows.length * 7;
  const memoryValue = 1.2 + windows.length * 0.28;

  const cards = [
    {
      label: t("monitor.uptime"),
      value: formatUptime(uptime),
      icon: Timer,
    },
    {
      label: t("monitor.windows"),
      value: windows.length.toString(),
      icon: Workflow,
    },
    {
      label: t("monitor.cpu"),
      value: `${Math.min(cpuValue, 91)}%`,
      icon: Cpu,
    },
    {
      label: t("monitor.memory"),
      value: `${memoryValue.toFixed(1)} GB`,
      icon: Gauge,
    },
    {
      label: t("monitor.theme"),
      value: themeMode,
      icon: Activity,
    },
    {
      label: t("monitor.language"),
      value: language.toUpperCase(),
      icon: Languages,
    },
    {
      label: t("monitor.accent"),
      value: accentColor.name,
      icon: Palette,
    },
    {
      label: t("monitor.active"),
      value: activeWindow ? t(appRegistry[activeWindow.appId].titleKey) : "—",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-5 text-sm text-slate-200">
      <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(var(--os-accent-rgb),0.20),transparent_35%),rgba(255,255,255,0.05)] p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
          {t("monitor.heading")}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          Portfolio OS runtime
        </h2>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {card.label}
                </p>
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[rgba(var(--os-accent-rgb),0.14)]">
                  <Icon size={17} />
                </span>
              </div>
              <p className="mt-3 truncate text-xl font-semibold text-white">
                {card.value}
              </p>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold text-white">Open processes</h3>

        <div className="mt-4 space-y-2">
          {windows.length === 0 ? (
            <p className="text-slate-500">No running apps.</p>
          ) : (
            windows.map((windowItem) => (
              <div
                key={windowItem.instanceId}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-3 py-2"
              >
                <span>{t(appRegistry[windowItem.appId].titleKey)}</span>
                <span className="text-xs text-slate-500">
                  z-index {windowItem.zIndex}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
