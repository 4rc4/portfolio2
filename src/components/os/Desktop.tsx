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

type DesktopIconCell = {
  column: number;
  row: number;
};

type DesktopIconItem = {
  id: string;
  kind: "app" | "folder";
  title: string;
  appId?: string;
  icon?: typeof Folder;
};

const FOLDERS_STORAGE_KEY = "portfolio-os-desktop-folders";
const ICON_CELLS_STORAGE_KEY = "portfolio-os-desktop-icon-cells";

const DESKTOP_CELL_WIDTH = 118;
const DESKTOP_CELL_HEIGHT = 122;
const MOBILE_CELL_WIDTH = 150;
const MOBILE_CELL_HEIGHT = 132;

const ICON_WIDTH = 108;
const ICON_HEIGHT = 116;
const DESKTOP_PADDING_X = 22;
const DESKTOP_PADDING_Y = 22;
const MOBILE_PADDING_X = 22;
const MOBILE_PADDING_Y = 26;
const TASKBAR_CLEARANCE = 96;

function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < 640;
}

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

function readStoredCells(): Record<string, DesktopIconCell> {
  try {
    const rawValue = window.localStorage.getItem(ICON_CELLS_STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);

    if (!parsedValue || typeof parsedValue !== "object") {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsedValue).filter((entry): entry is [string, DesktopIconCell] => {
        const value = entry[1];

        return (
          typeof entry[0] === "string" &&
          typeof value === "object" &&
          value !== null &&
          Number.isInteger((value as DesktopIconCell).column) &&
          Number.isInteger((value as DesktopIconCell).row)
        );
      })
    );
  } catch {
    return {};
  }
}

function getGridMetrics() {
  if (typeof window === "undefined") {
    return {
      columns: 4,
      rows: 6,
      cellWidth: DESKTOP_CELL_WIDTH,
      cellHeight: DESKTOP_CELL_HEIGHT,
      paddingX: DESKTOP_PADDING_X,
      paddingY: DESKTOP_PADDING_Y,
      isMobile: false,
    };
  }

  const mobile = window.innerWidth < 640;
  const cellWidth = mobile ? MOBILE_CELL_WIDTH : DESKTOP_CELL_WIDTH;
  const cellHeight = mobile ? MOBILE_CELL_HEIGHT : DESKTOP_CELL_HEIGHT;
  const paddingX = mobile ? MOBILE_PADDING_X : DESKTOP_PADDING_X;
  const paddingY = mobile ? MOBILE_PADDING_Y : DESKTOP_PADDING_Y;

  const usableWidth = Math.max(1, window.innerWidth - paddingX * 2);
  const usableHeight = Math.max(1, window.innerHeight - TASKBAR_CLEARANCE - paddingY * 2);

  return {
    columns: Math.max(1, Math.floor(usableWidth / cellWidth)),
    rows: Math.max(1, Math.floor(usableHeight / cellHeight)),
    cellWidth,
    cellHeight,
    paddingX,
    paddingY,
    isMobile: mobile,
  };
}

function clampCell(cell: DesktopIconCell): DesktopIconCell {
  const metrics = getGridMetrics();

  return {
    column: Math.max(0, Math.min(cell.column, metrics.columns - 1)),
    row: Math.max(0, Math.min(cell.row, metrics.rows - 1)),
  };
}

function getDefaultIconCell(index: number): DesktopIconCell {
  const metrics = getGridMetrics();

  return {
    column: Math.floor(index / metrics.rows),
    row: index % metrics.rows,
  };
}

function cellToPosition(cell: DesktopIconCell) {
  const metrics = getGridMetrics();
  const clampedCell = clampCell(cell);

  return {
    x: metrics.paddingX + clampedCell.column * metrics.cellWidth,
    y: metrics.paddingY + clampedCell.row * metrics.cellHeight,
  };
}

function pointerToCell(clientX: number, clientY: number): DesktopIconCell {
  const metrics = getGridMetrics();

  return clampCell({
    column: Math.round((clientX - metrics.paddingX - ICON_WIDTH / 2) / metrics.cellWidth),
    row: Math.round((clientY - metrics.paddingY - ICON_HEIGHT / 2) / metrics.cellHeight),
  });
}

function isDoubleClick(lastClickTime: number) {
  return Date.now() - lastClickTime < 280;
}

function findFreeCell(
  preferredCell: DesktopIconCell,
  occupied: Set<string>
): DesktopIconCell {
  const metrics = getGridMetrics();
  const first = clampCell(preferredCell);

  if (!occupied.has(`${first.column}:${first.row}`)) {
    return first;
  }

  for (let column = 0; column < metrics.columns; column += 1) {
    for (let row = 0; row < metrics.rows; row += 1) {
      const key = `${column}:${row}`;

      if (!occupied.has(key)) {
        return { column, row };
      }
    }
  }

  return first;
}

function normalizeIconCells(
  items: DesktopIconItem[],
  cells: Record<string, DesktopIconCell>
): Record<string, DesktopIconCell> {
  const metrics = getGridMetrics();
  const nextCells: Record<string, DesktopIconCell> = {};
  const occupied = new Set<string>();

  items.forEach((item, index) => {
    const storedCell = cells[item.id];
    const wantedCell =
      metrics.isMobile
        ? getDefaultIconCell(index)
        : storedCell
          ? clampCell(storedCell)
          : getDefaultIconCell(index);

    const finalCell = findFreeCell(wantedCell, occupied);

    nextCells[item.id] = finalCell;
    occupied.add(`${finalCell.column}:${finalCell.row}`);
  });

  return nextCells;
}

export function Desktop() {
  const { t } = useI18n();
  const { openApp } = useWindowManager();
  const { nextWallpaper } = useOSSettings();

  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [iconCells, setIconCells] = useState<Record<string, DesktopIconCell>>({});
  const [mounted, setMounted] = useState(false);
  const [layoutTick, setLayoutTick] = useState(0);

  const dragStateRef = useRef<{
    iconId: string;
    startX: number;
    startY: number;
    startCell: DesktopIconCell;
    moved: boolean;
  } | null>(null);

  const lastClickRef = useRef<Record<string, number>>({});

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

  useEffect(() => {
    setFolders(readStoredFolders());
    setIconCells(readStoredCells());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    setIconCells((currentCells) => normalizeIconCells(desktopItems, currentCells));
  }, [desktopItems, layoutTick, mounted]);

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
      ICON_CELLS_STORAGE_KEY,
      JSON.stringify(iconCells)
    );
  }, [iconCells, mounted]);

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
      setLayoutTick((current) => current + 1);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const getIconCell = (itemId: string, index: number) => {
    return clampCell(iconCells[itemId] ?? getDefaultIconCell(index));
  };

  const createFolder = () => {
    const nextNumber = folders.length + 1;
    const folderId = `folder-${Date.now()}`;

    const occupied = new Set(
      desktopItems.map((item, index) => {
        const cell = getIconCell(item.id, index);
        return `${cell.column}:${cell.row}`;
      })
    );

    const newCell = findFreeCell(getDefaultIconCell(desktopItems.length), occupied);

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

    setIconCells((currentCells) => ({
      ...currentCells,
      [folderId]: newCell,
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

    const currentCell = getIconCell(item.id, index);

    dragStateRef.current = {
      iconId: item.id,
      startX: event.clientX,
      startY: event.clientY,
      startCell: currentCell,
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

      const previewCell = pointerToCell(moveEvent.clientX, moveEvent.clientY);

      setIconCells((currentCells) => ({
        ...currentCells,
        [dragState.iconId]: previewCell,
      }));
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      const dragState = dragStateRef.current;

      if (dragState && dragState.moved) {
        const occupied = new Set<string>();

        desktopItems.forEach((desktopItem, itemIndex) => {
          if (desktopItem.id === dragState.iconId) {
            return;
          }

          const cell = getIconCell(desktopItem.id, itemIndex);
          occupied.add(`${cell.column}:${cell.row}`);
        });

        const finalCell = findFreeCell(
          pointerToCell(upEvent.clientX, upEvent.clientY),
          occupied
        );

        setIconCells((currentCells) => ({
          ...currentCells,
          [dragState.iconId]: finalCell,
        }));
      }

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
    window.localStorage.removeItem(ICON_CELLS_STORAGE_KEY);
    setIconCells(normalizeIconCells(desktopItems, {}));
  };

  const metrics = mounted ? getGridMetrics() : {
    columns: 2,
    rows: 5,
    cellWidth: MOBILE_CELL_WIDTH,
    cellHeight: MOBILE_CELL_HEIGHT,
    paddingX: MOBILE_PADDING_X,
    paddingY: MOBILE_PADDING_Y,
    isMobile: true,
  };

  const requiredColumns = Math.max(
    metrics.columns,
    Math.ceil(desktopItems.length / Math.max(metrics.rows, 1))
  );

  const desktopWidth =
    metrics.paddingX * 2 + requiredColumns * metrics.cellWidth;

  const desktopHeight =
    metrics.paddingY * 2 + metrics.rows * metrics.cellHeight;

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
        className="relative"
        style={{
          width: Math.max(window.innerWidth, desktopWidth),
          minHeight: Math.max(window.innerHeight - TASKBAR_CLEARANCE, desktopHeight),
        }}
      >
        {desktopItems.map((item, index) => {
          const Icon = item.icon ?? Folder;
          const isSelected = selectedItemId === item.id;
          const cell = getIconCell(item.id, index);
          const position = cellToPosition(cell);

          return (
            <button
              key={item.id}
              type="button"
              className={clsx(
                "absolute flex w-[108px] touch-none select-none flex-col items-center gap-2 rounded-2xl p-2 text-center text-white outline-none transition-[background,border-color,box-shadow,left,top] duration-100 focus-visible:bg-white/10",
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
                  "flex h-16 w-16 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-md transition",
                  isSelected
                    ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.18)]"
                    : "border-white/10 bg-slate-950/35 hover:bg-white/15"
                )}
              >
                <Icon size={30} />
              </span>

              <span className="line-clamp-2 text-sm font-semibold leading-tight drop-shadow">
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
