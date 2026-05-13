"use client";

import { AnimatePresence } from "framer-motion";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";

import { appRegistry, desktopAppIds } from "@/config/appRegistry";
import { useI18n } from "@/context/LanguageContext";
import { useOSSettings } from "@/context/OSSettingsContext";
import { useWindowManager } from "@/context/WindowManagerContext";
import { DesktopContextMenu } from "@/components/os/DesktopContextMenu";

type FolderItem = {
  id: string;
  name: string;
};

type ContextMenuState = {
  x: number;
  y: number;
} | null;

const STORAGE_KEY = "portfolio-os-desktop-folders";

function readStoredFolders(): FolderItem[] {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (item): item is FolderItem =>
        typeof item?.id === "string" && typeof item?.name === "string"
    );
  } catch {
    return [];
  }
}

export function Desktop() {
  const { t } = useI18n();
  const { openApp } = useWindowManager();
  const { nextWallpaper } = useOSSettings();

  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);

  useEffect(() => {
    setFolders(readStoredFolders());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);

    window.addEventListener("click", closeContextMenu);
    window.addEventListener("keydown", closeContextMenu);

    return () => {
      window.removeEventListener("click", closeContextMenu);
      window.removeEventListener("keydown", closeContextMenu);
    };
  }, []);

  const createFolder = () => {
    const nextNumber = folders.length + 1;

    setFolders((currentFolders) => [
      ...currentFolders,
      {
        id: `folder-${Date.now()}`,
        name:
          nextNumber === 1
            ? t("desktop.folder")
            : `${t("desktop.folder")} ${nextNumber}`,
      },
    ]);
  };

  return (
    <section
      className="absolute inset-0 z-0 px-6 pb-24 pt-6 max-sm:px-3 max-sm:pt-4"
      aria-label={t("system.desktop")}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu({
          x: Math.min(event.clientX, window.innerWidth - 240),
          y: Math.min(event.clientY, window.innerHeight - 190),
        });
      }}
    >
      <div className="grid w-fit grid-cols-1 gap-4 max-sm:grid-cols-4 max-sm:gap-2">
        {desktopAppIds.map((appId) => {
          const app = appRegistry[appId];
          const Icon = app.icon;

          return (
            <button
              key={app.id}
              type="button"
              className="group flex w-24 flex-col items-center gap-2 rounded-2xl p-2 text-center text-white outline-none transition hover:bg-white/10 focus-visible:bg-white/10 max-sm:w-20"
              onDoubleClick={() => openApp(app.id)}
              onClick={() => openApp(app.id)}
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/35 shadow-xl backdrop-blur-md transition group-hover:scale-105 group-hover:bg-white/15 max-sm:h-12 max-sm:w-12">
                <Icon size={28} />
              </span>

              <span className="line-clamp-2 text-xs font-medium drop-shadow max-sm:text-[11px]">
                {t(app.titleKey)}
              </span>
            </button>
          );
        })}

        {folders.map((folder) => (
          <button
            key={folder.id}
            type="button"
            className="group flex w-24 flex-col items-center gap-2 rounded-2xl p-2 text-center text-white outline-none transition hover:bg-white/10 focus-visible:bg-white/10 max-sm:w-20"
            title={t("desktop.folderHint")}
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/35 shadow-xl backdrop-blur-md transition group-hover:scale-105 group-hover:bg-white/15 max-sm:h-12 max-sm:w-12">
              <Folder size={30} />
            </span>

            <span className="line-clamp-2 text-xs font-medium drop-shadow max-sm:text-[11px]">
              {folder.name}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {contextMenu && (
          <DesktopContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onChangeWallpaper={nextWallpaper}
            onCreateFolder={createFolder}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
