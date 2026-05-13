"use client";

import { AnimatePresence } from "framer-motion";
import { Folder } from "lucide-react";
import clsx from "clsx";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

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

type DesktopIconPosition = {
  x: number;
  y: number;
};

type DesktopIconItem = {
  id: string;
  kind: "app" | "folder";
  title: string;
  appId?: string;
  icon?: typeof Folder;
};

const FOLDERS_STORAGE_KEY = "portfolio-os-desktop-folders";
const ICON_POSITIONS_STORAGE_KEY = "portfolio-os-desktop-icon-positions";

const ICON_WIDTH = 96;
const ICON_HEIGHT = 104;
const ICON_GAP_X = 22;
const ICON_GAP_Y = 18;
const DESKTOP_PADDING = 22;
const TASKBAR_CLEARANCE = 86;

function readStoredFolders(): FolderItem[] {
  try {
    const rawValue = window.localStorage.getItem(FOLDERS_STORAGE_KEY);

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

function readStoredPositions(): Record<string, DesktopIconPosition> {
  try {
    const rawValue = window.localStorage.getItem(ICON_POSITIONS_STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue).filter((entry): entry is [string, DesktopIconPosition] => {
        const value = entry[1];

        return (
          typeof entry[0] === "string" &&
          typeof value === "object" &&
          value !== null &&
          typeof (value as DesktopIconPosition).x === "number" &&
          typeof (value as DesktopIconPosition).y === "number"
        );
      })
    );
  } catch {
    return {};
  }
}

function getDesktopBounds() {
  if (typeof window === "undefined") {
    return {
      width: 1280,
      height: 720,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight - TASKBAR_CLEARANCE,
  };
}

function clampIconPosition(position: DesktopIconPosition): DesktopIconPosition {
  const bounds = getDesktopBounds();

  return {
    x: Math.max(
      DESKTOP_PADDING,
      Math.min(position.x, Math.max(DESKTOP_PADDING, bounds.width - ICON_WIDTH - DESKTOP_PADDING))
    ),
    y: Math.max(
      DESKTOP_PADDING,
      Math.min(position.y, Math.max(DESKTOP_PADDING, bounds.height - ICON_HEIGHT - DESKTOP_PADDING))
    ),
  };
}

function getDefaultIconPosition(index: number): DesktopIconPosition {
  const bounds = getDesktopBounds();

  const usableHeight = Math.max(ICON_HEIGHT, bounds.height - DESKTOP_PADDING * 2);
  const rowHeight = ICON_HEIGHT + ICON_GAP_Y;
  const columnWidth = ICON_WIDTH + ICON_GAP_X;

  const itemsPerColumn = Math.max(1, Math.floor(usableHeight / rowHeight));
  const column = Math.floor(index / itemsPerColumn);
  const row = index % itemsPerColumn;

  return clampIconPosition({
    x: DESKTOP_PADDING + column * columnWidth,
    y: DESKTOP_PADDING + row * rowHeight,
  });
}

function isDoubleClick(lastClickTime: number) {
  return Date.now() - lastClickTime < 280;
}

export function Desktop() {
  const { t } = useI18n();
  const { openApp } = useWindowManager();
  const { nextWallpaper } = useOSSettings();

  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [iconPositions, setIconPositions] = useState<Record<string, DesktopIconPosition>>({});
  const [mounted, setMounted] = useState(false);

  const dragStateRef = useRef<{
    iconId: string;
    startX: number;
    startY: number;
    startPosition: DesktopIconPosition;
    moved: boolean;
  } | null>(null);

  const lastClickRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setFolders(readStoredFolders());
    setIconPositions(readStoredPositions());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders, mounted]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    window.localStorage.setItem(
      ICON_POSITIONS_STORAGE_KEY,
      JSON.stringify(iconPositions)
    );
  }, [iconPositions, mounted]);

  useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);

    window.addEventListener("click", closeContextMenu);
    window.addEventListener("keydown", closeContextMenu);

    return () => {
      window.removeEventListener("click", closeContextMenu);
      window.removeEventListener("keydown", closeContextMenu);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIconPositions((currentPositions) => {
        const nextPositions: Record<string, DesktopIconPosition> = {};

        Object.entries(currentPositions).forEach(([id, position]) => {
          nextPositions[id] = clampIconPosition(position);
        });

        return nextPositions;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const desktopItems = useMemo<DesktopIconItem[]>(() => {
    const appItems: DesktopIconItem[] = desktopAppIds.map((appId) => {
      const app = appRegistry[appId];

      return {
        id: app.id,
        kind: "app",
        title: t(app.titleKey),
        appId: app.id,
        icon: app.icon,
      };
    });

    const folderItems: DesktopIconItem[] = folders.map((folder) => ({
      id: folder.id,
      kind: "folder",
      title: folder.name,
      icon: Folder,
    }));

    return [...appItems, ...folderItems];
  }, [folders, t]);

  const getIconPosition = (itemId: string, index: number) => {
    return iconPositions[itemId] ?? getDefaultIconPosition(index);
  };

  const createFolder = () => {
    const nextNumber = folders.length + 1;
    const folderId = `folder-${Date.now()}`;

    setFolders((currentFolders) => [
      ...currentFolders,
      {
        id: folderId,
        name:
          nextNumber === 1
            ? t("desktop.folder")
            : `${t("desktop.folder")} ${nextNumber}`,
      },
    ]);

    setIconPositions((currentPositions) => ({
      ...currentPositions,
      [folderId]: getDefaultIconPosition(desktopItems.length),
    }));
  };

  const startIconDrag = (
    event: ReactPointerEvent<HTMLButtonElement>,
    item: DesktopIconItem,
    index: number
  ) => {
    event.stopPropagation();

    if (event.button !== 0) {
      return;
    }

    setSelectedItemId(item.id);

    const currentPosition = getIconPosition(item.id, index);

    dragStateRef.current = {
      iconId: item.id,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: currentPosition,
      moved: false,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dragState = dragStateRef.current;

      if (!dragState) {
        return;
      }

      const deltaX = moveEvent.clientX - dragState.startX;
      const deltaY = moveEvent.clientY - dragState.startY;

      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
        dragState.moved = true;
      }

      const nextPosition = clampIconPosition({
        x: dragState.startPosition.x + deltaX,
        y: dragState.startPosition.y + deltaY,
      });

      setIconPositions((currentPositions) => ({
        ...currentPositions,
        [dragState.iconId]: nextPosition,
      }));
    };

    const handlePointerUp = () => {
      const dragState = dragStateRef.current;

      if (dragState && !dragState.moved && item.kind === "app" && item.appId) {
        const previousClick = lastClickRef.current[item.id] ?? 0;

        if (isDoubleClick(previousClick)) {
          openApp(item.appId);
          lastClickRef.current[item.id] = 0;
        } else {
          lastClickRef.current[item.id] = Date.now();
        }
      }

      dragStateRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const resetIconPositions = () => {
    setIconPositions({});
  };

  return (
    <section
      className="fixed inset-0 z-0 overflow-auto px-0 pb-[96px] pt-0"
      aria-label={t("system.desktop")}
      onClick={() => setSelectedItemId(null)}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu({
          x: Math.min(event.clientX, window.innerWidth - 240),
          y: Math.min(event.clientY, window.innerHeight - 230),
        });
      }}
    >
      <div
        className="relative min-h-[calc(100dvh-86px)] min-w-full"
        style={{
          width: "max(100%, 920px)",
        }}
      >
        {desktopItems.map((item, index) => {
          const Icon = item.icon ?? Folder;
          const isSelected = selectedItemId === item.id;
          const position = getIconPosition(item.id, index);

          return (
            <button
              key={item.id}
              type="button"
              className={clsx(
                "absolute flex w-24 touch-none select-none flex-col items-center gap-2 rounded-2xl p-2 text-center text-white outline-none transition focus-visible:bg-white/10",
                isSelected ? "bg-white/15" : "hover:bg-white/10"
              )}
              style={{
                left: position.x,
                top: position.y,
              }}
              onPointerDown={(event) => startIconDrag(event, item, index)}
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();

                if (item.kind === "app" && item.appId) {
                  openApp(item.appId);
                }
              }}
              onKeyDown={(event) => {
                if (
                  (event.key === "Enter" || event.key === " ") &&
                  item.kind === "app" &&
                  item.appId
                ) {
                  openApp(item.appId);
                }
              }}
              title={item.kind === "folder" ? t("desktop.folderHint") : item.title}
            >
              <span
                className={clsx(
                  "flex h-14 w-14 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-md transition",
                  isSelected
                    ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.18)]"
                    : "border-white/10 bg-slate-950/35 hover:bg-white/15"
                )}
              >
                <Icon size={28} />
              </span>

              <span className="line-clamp-2 text-xs font-semibold drop-shadow">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {contextMenu && (
          <DesktopContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onChangeWallpaper={nextWallpaper}
            onCreateFolder={createFolder}
            onOpenTerminalHere={() =>
              openApp("terminal", { initialPath: "/home/yusuf-arca-cicek/desktop" })
            }
            onResetIconPositions={resetIconPositions}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
