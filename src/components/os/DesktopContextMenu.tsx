"use client";

import { FolderPlus, Image, RefreshCcw, RotateCcw, Terminal } from "lucide-react";
import { motion } from "framer-motion";

import { useI18n } from "@/context/LanguageContext";

type DesktopContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
  onChangeWallpaper: () => void;
  onCreateFolder: () => void;
  onOpenTerminalHere: () => void;
  onResetIconPositions: () => void;
};

export function DesktopContextMenu({
  x,
  y,
  onClose,
  onChangeWallpaper,
  onCreateFolder,
  onOpenTerminalHere,
  onResetIconPositions,
}: DesktopContextMenuProps) {
  const { t } = useI18n();

  const menuItems = [
    {
      label: t("desktop.openTerminalHere"),
      icon: Terminal,
      action: onOpenTerminalHere,
    },
    {
      label: t("desktop.changeWallpaper"),
      icon: Image,
      action: onChangeWallpaper,
    },
    {
      label: t("desktop.newFolder"),
      icon: FolderPlus,
      action: onCreateFolder,
    },
    {
      label: t("desktop.resetIconPositions"),
      icon: RotateCcw,
      action: onResetIconPositions,
    },
    {
      label: t("desktop.refresh"),
      icon: RefreshCcw,
      action: onClose,
    },
  ];

  return (
    <motion.div
      className="fixed z-[10020] min-w-56 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/75 p-1 text-sm text-white shadow-2xl backdrop-blur-xl"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.96, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -4 }}
      transition={{ duration: 0.12 }}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.label}
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-slate-200 transition hover:bg-white/10 hover:text-white"
            onClick={() => {
              item.action();
              onClose();
            }}
          >
            <Icon size={16} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </motion.div>
  );
}
