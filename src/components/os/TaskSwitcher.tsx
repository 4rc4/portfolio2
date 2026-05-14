"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { appRegistry } from "@/config/appRegistry";
import { useI18n } from "@/context/LanguageContext";
import { useWindowManager } from "@/context/WindowManagerContext";

export function TaskSwitcher() {
  const { t } = useI18n();
  const { windows, activeWindowId, focusWindow } = useWindowManager();
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const switchableWindows = useMemo(() => windows, [windows]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.altKey || event.key !== "Tab" || switchableWindows.length === 0) {
        return;
      }

      event.preventDefault();

      const activeIndex = Math.max(0, switchableWindows.findIndex((windowItem) => windowItem.instanceId === activeWindowId));
      const nextIndex = visible
        ? (selectedIndex + 1) % switchableWindows.length
        : (activeIndex + 1) % switchableWindows.length;

      setVisible(true);
      setSelectedIndex(nextIndex);
      focusWindow(switchableWindows[nextIndex].instanceId);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Alt") {
        setVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [activeWindowId, focusWindow, selectedIndex, switchableWindows, visible]);

  return (
    <AnimatePresence>
      {visible && switchableWindows.length > 0 && (
        <motion.div
          className="fixed left-1/2 top-1/2 z-[17500] w-[520px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/10 bg-slate-950/85 p-4 text-white shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-500">Alt + Tab</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {switchableWindows.map((windowItem, index) => {
              const app = appRegistry[windowItem.appId];
              const Icon = app.icon;
              const selected = index === selectedIndex;

              return (
                <div
                  key={windowItem.instanceId}
                  className={`rounded-2xl border p-3 text-center ${
                    selected
                      ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.16)]"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <Icon className="mx-auto" size={22} />
                  <p className="mt-2 truncate text-xs font-medium">{t(app.titleKey)}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
