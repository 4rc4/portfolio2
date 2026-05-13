"use client";

import { AnimatePresence } from "framer-motion";
import { useState, type CSSProperties } from "react";

import { BootScreen } from "@/components/os/BootScreen";
import { Desktop } from "@/components/os/Desktop";
import { Taskbar } from "@/components/os/Taskbar";
import { WindowManager } from "@/components/os/WindowManager";
import { LanguageProvider } from "@/context/LanguageContext";
import { OSSettingsProvider, useOSSettings } from "@/context/OSSettingsContext";
import { WindowManagerProvider } from "@/context/WindowManagerContext";

type OSStyle = CSSProperties & {
  "--os-accent": string;
  "--os-accent-rgb": string;
};

function OSDesktopShell() {
  const { wallpaperBackground, accentColor, themeMode } = useOSSettings();

  const [bootComplete, setBootComplete] = useState(false);

  const background =
    themeMode === "light"
      ? "radial-gradient(circle at top left, rgba(255,255,255,0.65), transparent 35%), linear-gradient(135deg, #dbeafe, #fef3c7, #f5d0fe)"
      : wallpaperBackground;

  const style: OSStyle = {
    background,
    "--os-accent": accentColor.hex,
    "--os-accent-rgb": accentColor.rgb,
  };

  return (
    <main
      className="relative h-screen w-screen overflow-hidden transition-[background] duration-500"
      style={style}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none absolute inset-0 bg-black/10" />

      {bootComplete && (
        <>
          <Desktop />
          <WindowManager />
          <Taskbar />
        </>
      )}

      <AnimatePresence>
        {!bootComplete && (
          <BootScreen onComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>
    </main>
  );
}

export function OSRoot() {
  return (
    <LanguageProvider>
      <WindowManagerProvider>
        <OSSettingsProvider>
          <OSDesktopShell />
        </OSSettingsProvider>
      </WindowManagerProvider>
    </LanguageProvider>
  );
}
