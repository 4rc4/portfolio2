"use client";

import clsx from "clsx";

import { accentColors } from "@/config/accentColors";
import { wallpapers } from "@/config/wallpapers";
import { useI18n } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationContext";
import { useOSSettings } from "@/context/OSSettingsContext";

export function SettingsApp() {
  const { language, setLanguage, t } = useI18n();
  const { notify } = useNotifications();

  const {
    wallpaperId,
    setWallpaperId,
    customWallpaperDataUrl,
    setCustomWallpaperDataUrl,
    accentColorId,
    setAccentColorId,
    themeMode,
    setThemeMode,
  } = useOSSettings();

  const notifySaved = () => {
    notify({
      title: t("notify.settingsSaved"),
      tone: "success",
    });
  };

  const handleWallpaperUpload = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomWallpaperDataUrl(reader.result);
        notifySaved();
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 text-sm text-slate-200">
      <div>
        <h2 className="text-xl font-semibold text-white">
          {t("settings.heading")}
        </h2>
        <p className="mt-1 text-slate-400">{t("settings.description")}</p>
        <p className="mt-2 text-xs text-slate-500">{t("settings.saved")}</p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-medium text-white">{t("settings.theme")}</h3>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {(["dark", "light"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={clsx(
                "rounded-2xl border p-4 text-left transition",
                themeMode === mode
                  ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.16)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              )}
              onClick={() => {
                setThemeMode(mode);
                notifySaved();
              }}
            >
              <p className="font-medium text-white">
                {mode === "dark" ? t("settings.dark") : t("settings.light")}
              </p>
              {themeMode === mode && (
                <p className="mt-1 text-xs text-slate-300">
                  {t("settings.current")}
                </p>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-medium text-white">{t("settings.wallpaper")}</h3>

        <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {wallpapers.map((wallpaper) => (
            <button
              key={wallpaper.id}
              type="button"
              className={clsx(
                "overflow-hidden rounded-2xl border text-left transition",
                wallpaperId === wallpaper.id
                  ? "border-[rgba(var(--os-accent-rgb),0.7)]"
                  : "border-white/10 hover:border-white/25"
              )}
              onClick={() => {
                setWallpaperId(wallpaper.id);
                notifySaved();
              }}
            >
              <span
                className="block h-20"
                style={{ background: wallpaper.background }}
              />
              <span className="block px-3 py-2 text-xs text-slate-200">
                {wallpaper.name}
              </span>
            </button>
          ))}

          {customWallpaperDataUrl && (
            <button
              type="button"
              className={clsx(
                "overflow-hidden rounded-2xl border text-left transition",
                wallpaperId === "custom"
                  ? "border-[rgba(var(--os-accent-rgb),0.7)]"
                  : "border-white/10 hover:border-white/25"
              )}
              onClick={() => {
                setWallpaperId("custom");
                notifySaved();
              }}
            >
              <span
                className="block h-20 bg-cover bg-center"
                style={{ backgroundImage: `url("${customWallpaperDataUrl}")` }}
              />
              <span className="block px-3 py-2 text-xs text-slate-200">
                Custom
              </span>
            </button>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 p-4">
          <h4 className="font-medium text-white">{t("settings.customWallpaper")}</h4>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="cursor-pointer rounded-2xl border border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.12)] px-4 py-2 text-sm text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.22)]">
              {t("settings.uploadWallpaper")}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => handleWallpaperUpload(event.target.files?.[0])}
              />
            </label>

            {customWallpaperDataUrl && (
              <button
                type="button"
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
                onClick={() => {
                  setCustomWallpaperDataUrl(null);
                  notifySaved();
                }}
              >
                {t("settings.clearCustomWallpaper")}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-medium text-white">{t("settings.accent")}</h3>

        <div className="mt-3 flex flex-wrap gap-3">
          {accentColors.map((accent) => (
            <button
              key={accent.id}
              type="button"
              className={clsx(
                "flex items-center gap-2 rounded-2xl border px-3 py-2 transition",
                accentColorId === accent.id
                  ? "border-white/40 bg-white/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              )}
              onClick={() => {
                setAccentColorId(accent.id);
                notifySaved();
              }}
            >
              <span
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: accent.hex }}
              />
              <span>{accent.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-medium text-white">{t("settings.language")}</h3>

        <div className="mt-3 flex gap-3">
          <button
            type="button"
            className={clsx(
              "rounded-2xl border px-4 py-2 transition",
              language === "tr"
                ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.16)]"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            )}
            onClick={() => {
              setLanguage("tr");
              notifySaved();
            }}
          >
            Türkçe
          </button>

          <button
            type="button"
            className={clsx(
              "rounded-2xl border px-4 py-2 transition",
              language === "en"
                ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.16)]"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            )}
            onClick={() => {
              setLanguage("en");
              notifySaved();
            }}
          >
            English
          </button>
        </div>
      </section>
    </div>
  );
}
