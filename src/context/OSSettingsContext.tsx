"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { accentColors } from "@/config/accentColors";
import { wallpapers } from "@/config/wallpapers";

export type ThemeMode = "dark" | "light";

type OSSettingsContextValue = {
  wallpaperId: string;
  wallpaperBackground: string;
  setWallpaperId: (wallpaperId: string) => void;
  nextWallpaper: () => void;

  customWallpaperDataUrl: string | null;
  setCustomWallpaperDataUrl: (dataUrl: string | null) => void;

  accentColorId: string;
  accentColor: (typeof accentColors)[number];
  setAccentColorId: (accentColorId: string) => void;

  themeMode: ThemeMode;
  setThemeMode: (themeMode: ThemeMode) => void;
};

const OSSettingsContext = createContext<OSSettingsContextValue | null>(null);

const STORAGE_KEY = "portfolio-os-settings";

type StoredSettings = {
  wallpaperId?: string;
  customWallpaperDataUrl?: string | null;
  accentColorId?: string;
  themeMode?: ThemeMode;
};

function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}

function readStoredSettings(): StoredSettings {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    return JSON.parse(rawValue) as StoredSettings;
  } catch {
    return {};
  }
}

export function OSSettingsProvider({ children }: { children: ReactNode }) {
  const [wallpaperId, setWallpaperIdState] = useState(wallpapers[0].id);
  const [customWallpaperDataUrl, setCustomWallpaperDataUrlState] = useState<string | null>(null);
  const [accentColorId, setAccentColorIdState] = useState(accentColors[0].id);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const storedSettings = readStoredSettings();

    if (
      storedSettings.wallpaperId &&
      (storedSettings.wallpaperId === "custom" ||
        wallpapers.some((wallpaper) => wallpaper.id === storedSettings.wallpaperId))
    ) {
      setWallpaperIdState(storedSettings.wallpaperId);
    }

    if (typeof storedSettings.customWallpaperDataUrl === "string") {
      setCustomWallpaperDataUrlState(storedSettings.customWallpaperDataUrl);
    }

    if (
      storedSettings.accentColorId &&
      accentColors.some((accent) => accent.id === storedSettings.accentColorId)
    ) {
      setAccentColorIdState(storedSettings.accentColorId);
    }

    if (isThemeMode(storedSettings.themeMode)) {
      setThemeModeState(storedSettings.themeMode);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        wallpaperId,
        customWallpaperDataUrl,
        accentColorId,
        themeMode,
      })
    );
  }, [accentColorId, customWallpaperDataUrl, themeMode, wallpaperId]);

  const activeWallpaper =
    wallpapers.find((wallpaper) => wallpaper.id === wallpaperId) ??
    wallpapers[0];

  const accentColor =
    accentColors.find((accent) => accent.id === accentColorId) ??
    accentColors[0];

  const wallpaperBackground =
    wallpaperId === "custom" && customWallpaperDataUrl
      ? `linear-gradient(rgba(2, 6, 23, 0.18), rgba(2, 6, 23, 0.38)), url("${customWallpaperDataUrl}") center / cover no-repeat`
      : activeWallpaper.background;

  const setWallpaperId = (nextWallpaperId: string) => {
    if (
      nextWallpaperId === "custom" ||
      wallpapers.some((wallpaper) => wallpaper.id === nextWallpaperId)
    ) {
      setWallpaperIdState(nextWallpaperId);
    }
  };

  const setCustomWallpaperDataUrl = (dataUrl: string | null) => {
    setCustomWallpaperDataUrlState(dataUrl);

    if (dataUrl) {
      setWallpaperIdState("custom");
    } else if (wallpaperId === "custom") {
      setWallpaperIdState(wallpapers[0].id);
    }
  };

  const setAccentColorId = (nextAccentColorId: string) => {
    if (accentColors.some((accent) => accent.id === nextAccentColorId)) {
      setAccentColorIdState(nextAccentColorId);
    }
  };

  const setThemeMode = (nextThemeMode: ThemeMode) => {
    setThemeModeState(nextThemeMode);
  };

  const nextWallpaper = () => {
    const availableIds = customWallpaperDataUrl
      ? [...wallpapers.map((wallpaper) => wallpaper.id), "custom"]
      : wallpapers.map((wallpaper) => wallpaper.id);

    const currentIndex = availableIds.indexOf(wallpaperId);
    const nextIndex = (currentIndex + 1) % availableIds.length;

    setWallpaperId(availableIds[nextIndex]);
  };

  const value = useMemo<OSSettingsContextValue>(
    () => ({
      wallpaperId,
      wallpaperBackground,
      setWallpaperId,
      nextWallpaper,

      customWallpaperDataUrl,
      setCustomWallpaperDataUrl,

      accentColorId,
      accentColor,
      setAccentColorId,

      themeMode,
      setThemeMode,
    }),
    [
      accentColor,
      accentColorId,
      customWallpaperDataUrl,
      themeMode,
      wallpaperBackground,
      wallpaperId,
    ]
  );

  return (
    <OSSettingsContext.Provider value={value}>
      {children}
    </OSSettingsContext.Provider>
  );
}

export function useOSSettings() {
  const context = useContext(OSSettingsContext);

  if (!context) {
    throw new Error("useOSSettings must be used inside OSSettingsProvider.");
  }

  return context;
}
