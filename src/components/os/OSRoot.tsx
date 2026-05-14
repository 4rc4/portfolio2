"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState, type CSSProperties } from "react";

import { BootScreen } from "@/components/os/BootScreen";
import { CommandPalette } from "@/components/os/CommandPalette";
import { Desktop } from "@/components/os/Desktop";
import { DesktopWidgets } from "@/components/os/DesktopWidgets";
import { NotificationCenter } from "@/components/os/NotificationCenter";
import { Taskbar } from "@/components/os/Taskbar";
import { TaskSwitcher } from "@/components/os/TaskSwitcher";
import { PWARegister } from "@/components/os/PWARegister";
import { WindowManager } from "@/components/os/WindowManager";
import { useI18n } from "@/context/LanguageContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { NotificationProvider, useNotifications } from "@/context/NotificationContext";
import { OSSettingsProvider, useOSSettings } from "@/context/OSSettingsContext";
import { RecycleBinProvider } from "@/context/RecycleBinContext";
import { WindowManagerProvider } from "@/context/WindowManagerContext";

type OSStyle = CSSProperties & {
  "--os-accent": string;
  "--os-accent-rgb": string;
};

function OSDesktopShell() {
  const { t } = useI18n();
  const { notify } = useNotifications();
  const { wallpaperBackground, accentColor, themeMode } = useOSSettings();

  const [bootComplete, setBootComplete] = useState(false);

  useEffect(() => {
    if (bootComplete) {
      notify({
        title: t("notify.welcome"),
        message: t("command.hint"),
        tone: "success",
      });
    }
  }, [bootComplete, notify, t]);

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
      className="fixed inset-0 h-dvh w-dvw overflow-hidden transition-[background] duration-500"
      style={style}
    >
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="pointer-events-none fixed inset-0 bg-black/10" />

      {bootComplete && (
        <>
          <Desktop />
          <DesktopWidgets />
          <WindowManager />
          <Taskbar />
          <CommandPalette />
          <TaskSwitcher />
          <NotificationCenter />
          <PWARegister />
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
          <NotificationProvider>
            <RecycleBinProvider>
              <OSDesktopShell />
            </RecycleBinProvider>
          </NotificationProvider>
        </OSSettingsProvider>
      </WindowManagerProvider>
    </LanguageProvider>
  );
}
