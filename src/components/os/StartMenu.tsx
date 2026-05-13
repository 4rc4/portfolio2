"use client";

import { motion } from "framer-motion";
import { Power } from "lucide-react";

import { appRegistry } from "@/config/appRegistry";
import { useI18n } from "@/context/LanguageContext";
import { useWindowManager } from "@/context/WindowManagerContext";

type StartMenuProps = {
  onClose: () => void;
};

export function StartMenu({ onClose }: StartMenuProps) {
  const { t } = useI18n();
  const { openApp } = useWindowManager();

  const apps = Object.values(appRegistry).filter(
    (app) => app.showInStartMenu !== false
  );

  return (
    <motion.div
      className="absolute bottom-16 left-3 z-[10010] w-[340px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-4 text-white shadow-2xl backdrop-blur-xl max-sm:left-2 max-sm:right-2 max-sm:w-auto"
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 14, scale: 0.98 }}
      transition={{ duration: 0.16 }}
    >
      <div className="mb-4">
        <p className="text-sm font-semibold">{t("start.menuTitle")}</p>
        <p className="text-xs text-slate-400">{t("system.phase")}</p>
      </div>

      <div>
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-slate-400">
          {t("start.apps")}
        </p>

        <div className="grid grid-cols-3 gap-2">
          {apps.map((app) => {
            const Icon = app.icon;

            return (
              <button
                key={app.id}
                type="button"
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-xs transition hover:bg-white/10"
                onClick={() => {
                  openApp(app.id);
                  onClose();
                }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Icon size={21} />
                </span>
                <span className="line-clamp-2">{t(app.titleKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          <Power size={16} />
          <span>{t("start.shutdown")}</span>
        </button>
      </div>
    </motion.div>
  );
}
