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
  const [accentColorId, setAccentColorIdState] = useState(accentColors[0].id);
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const storedSettings = readStoredSettings();

    if (
      storedSettings.wallpaperId &&
      wallpapers.some((wallpaper) => wallpaper.id === storedSettings.wallpaperId)
    ) {
      setWallpaperIdState(storedSettings.wallpaperId);
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
        accentColorId,
        themeMode,
      })
    );
  }, [accentColorId, themeMode, wallpaperId]);

  const activeWallpaper =
    wallpapers.find((wallpaper) => wallpaper.id === wallpaperId) ??
    wallpapers[0];

  const accentColor =
    accentColors.find((accent) => accent.id === accentColorId) ??
    accentColors[0];

  const setWallpaperId = (nextWallpaperId: string) => {
    if (wallpapers.some((wallpaper) => wallpaper.id === nextWallpaperId)) {
      setWallpaperIdState(nextWallpaperId);
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
    const currentIndex = wallpapers.findIndex(
      (wallpaper) => wallpaper.id === wallpaperId
    );

    const nextIndex = (currentIndex + 1) % wallpapers.length;
    setWallpaperId(wallpapers[nextIndex].id);
  };

  const value = useMemo<OSSettingsContextValue>(
    () => ({
      wallpaperId,
      wallpaperBackground: activeWallpaper.background,
      setWallpaperId,
      nextWallpaper,

      accentColorId,
      accentColor,
      setAccentColorId,

      themeMode,
      setThemeMode,
    }),
    [
      accentColor,
      accentColorId,
      activeWallpaper.background,
      themeMode,
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
