"use client";

import { Image, Languages, Monitor, Palette, Settings, Sun } from "lucide-react";
import clsx from "clsx";

import { accentColors } from "@/config/accentColors";
import { wallpapers } from "@/config/wallpapers";
import { useI18n } from "@/context/LanguageContext";
import { useOSSettings } from "@/context/OSSettingsContext";
import { useWindowManager } from "@/context/WindowManagerContext";

type ControlCenterProps = {
  onClose: () => void;
};

export function ControlCenter({ onClose }: ControlCenterProps) {
  const { language, setLanguage } = useI18n();
  const {
    themeMode,
    setThemeMode,
    accentColorId,
    setAccentColorId,
    wallpaperId,
    setWallpaperId,
  } = useOSSettings();
  const { openApp } = useWindowManager();

  const quickWallpapers = wallpapers.slice(0, 4);

  return (
    <div className="fixed bottom-16 right-3 z-[10020] w-[360px] max-w-[calc(100vw-1.5rem)] rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-white shadow-2xl backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Control Center</p>
          <p className="text-xs text-slate-400">Theme, language and appearance</p>
        </div>

        <button
          type="button"
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
          onClick={() => {
            openApp("settings");
            onClose();
          }}
        >
          <Settings size={15} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className={clsx(
            "rounded-2xl border p-3 text-left transition",
            themeMode === "dark"
              ? "border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.14)]"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          )}
          onClick={() => setThemeMode("dark")}
        >
          <Sun size={18} />
          <p className="mt-2 text-sm font-medium">Dark</p>
        </button>

        <button
          type="button"
          className={clsx(
            "rounded-2xl border p-3 text-left transition",
            themeMode === "light"
              ? "border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.14)]"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          )}
          onClick={() => setThemeMode("light")}
        >
          <Sun size={18} />
          <p className="mt-2 text-sm font-medium">Light</p>
        </button>

        <button
          type="button"
          className={clsx(
            "rounded-2xl border p-3 text-left transition",
            language === "tr"
              ? "border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.14)]"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          )}
          onClick={() => setLanguage("tr")}
        >
          <Languages size={18} />
          <p className="mt-2 text-sm font-medium">Türkçe</p>
        </button>

        <button
          type="button"
          className={clsx(
            "rounded-2xl border p-3 text-left transition",
            language === "en"
              ? "border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.14)]"
              : "border-white/10 bg-white/5 hover:bg-white/10"
          )}
          onClick={() => setLanguage("en")}
        >
          <Languages size={18} />
          <p className="mt-2 text-sm font-medium">English</p>
        </button>
      </div>

      <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          <Palette size={15} />
          Accent
        </div>

        <div className="flex flex-wrap gap-2">
          {accentColors.map((accent) => (
            <button
              key={accent.id}
              type="button"
              className={clsx(
                "h-8 w-8 rounded-full border transition",
                accentColorId === accent.id
                  ? "border-white scale-110"
                  : "border-white/20 hover:scale-105"
              )}
              style={{ backgroundColor: accent.hex }}
              onClick={() => setAccentColorId(accent.id)}
              title={accent.name}
            />
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          <Image size={15} />
          Wallpaper
        </div>

        <div className="grid grid-cols-4 gap-2">
          {quickWallpapers.map((wallpaper) => (
            <button
              key={wallpaper.id}
              type="button"
              className={clsx(
                "h-12 rounded-xl border bg-cover bg-center transition",
                wallpaperId === wallpaper.id
                  ? "border-white"
                  : "border-white/10 hover:border-white/35"
              )}
              style={{ background: wallpaper.background }}
              onClick={() => setWallpaperId(wallpaper.id)}
              title={wallpaper.name}
            />
          ))}
        </div>
      </section>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10"
        onClick={() => {
          openApp("systemMonitor");
          onClose();
        }}
      >
        <Monitor size={16} />
        System Monitor
      </button>
    </div>
  );
}
