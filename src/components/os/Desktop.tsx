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
import { useRecycleBin } from "@/context/RecycleBinContext";
import { useOSSettings } from "@/context/OSSettingsContext";
import { useWindowManager } from "@/context/WindowManagerContext";
import { DesktopContextMenu } from "@/components/os/DesktopContextMenu";

type FolderItem = { id: string; name: string };
type ContextMenuState = { x: number; y: number } | null;
type DesktopIconCell = { column: number; row: number };
type DesktopIconItem = { id: string; kind: "app" | "folder"; title: string; appId?: string; icon?: typeof Folder };

const FOLDERS_STORAGE_KEY = "portfolio-os-desktop-folders";
const ICON_CELLS_STORAGE_KEY = "portfolio-os-desktop-icon-cells";
const DESKTOP_CELL_WIDTH = 118;
const DESKTOP_CELL_HEIGHT = 122;
const ICON_WIDTH = 96;
const DESKTOP_PADDING_X = 22;
const DESKTOP_PADDING_Y = 22;
const TASKBAR_CLEARANCE = 96;

function readStoredFolders(): FolderItem[] {
  try {
    const rawValue = window.localStorage.getItem(FOLDERS_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is FolderItem => typeof item?.id === "string" && typeof item?.name === "string")
      : [];
  } catch {
    return [];
  }
}

function readStoredCells(): Record<string, DesktopIconCell> {
  try {
    const rawValue = window.localStorage.getItem(ICON_CELLS_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : {};

    if (!parsedValue || typeof parsedValue !== "object") return {};

    return Object.fromEntries(
      Object.entries(parsedValue).filter((entry): entry is [string, DesktopIconCell] => {
        const value = entry[1];
        return typeof entry[0] === "string" && typeof value === "object" && value !== null && Number.isInteger((value as DesktopIconCell).column) && Number.isInteger((value as DesktopIconCell).row);
      })
    );
  } catch {
    return {};
  }
}

function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < 640;
}

function getGridMetrics() {
  if (typeof window === "undefined") return { columns: 6, rows: 6 };

  const usableWidth = Math.max(1, window.innerWidth - DESKTOP_PADDING_X * 2);
  const usableHeight = Math.max(1, window.innerHeight - TASKBAR_CLEARANCE - DESKTOP_PADDING_Y * 2);

  return {
    columns: Math.max(1, Math.floor(usableWidth / DESKTOP_CELL_WIDTH)),
    rows: Math.max(1, Math.floor(usableHeight / DESKTOP_CELL_HEIGHT)),
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
  return { column: Math.floor(index / metrics.rows), row: index % metrics.rows };
}

function cellToPosition(cell: DesktopIconCell) {
  const clampedCell = clampCell(cell);
  return {
    x: DESKTOP_PADDING_X + clampedCell.column * DESKTOP_CELL_WIDTH,
    y: DESKTOP_PADDING_Y + clampedCell.row * DESKTOP_CELL_HEIGHT,
  };
}

function pointerToCell(clientX: number, clientY: number): DesktopIconCell {
  return clampCell({
    column: Math.round((clientX - DESKTOP_PADDING_X - ICON_WIDTH / 2) / DESKTOP_CELL_WIDTH),
    row: Math.round((clientY - DESKTOP_PADDING_Y - 52) / DESKTOP_CELL_HEIGHT),
  });
}

function isDoubleClick(lastClickTime: number) {
  return Date.now() - lastClickTime < 280;
}

function findFreeCell(preferredCell: DesktopIconCell, occupied: Set<string>): DesktopIconCell {
  const metrics = getGridMetrics();
  const first = clampCell(preferredCell);
  if (!occupied.has(`${first.column}:${first.row}`)) return first;

  for (let column = 0; column < metrics.columns; column += 1) {
    for (let row = 0; row < metrics.rows; row += 1) {
      if (!occupied.has(`${column}:${row}`)) return { column, row };
    }
  }

  return first;
}

function normalizeDesktopCells(items: DesktopIconItem[], cells: Record<string, DesktopIconCell>) {
  const nextCells: Record<string, DesktopIconCell> = {};
  const occupied = new Set<string>();

  items.forEach((item, index) => {
    const wantedCell = cells[item.id] ? clampCell(cells[item.id]) : getDefaultIconCell(index);
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
  const { addItem } = useRecycleBin();

  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [iconCells, setIconCells] = useState<Record<string, DesktopIconCell>>({});
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [layoutTick, setLayoutTick] = useState(0);

  const dragStateRef = useRef<{ iconId: string; startX: number; startY: number; startCell: DesktopIconCell; moved: boolean } | null>(null);
  const lastClickRef = useRef<Record<string, number>>({});

  const desktopItems = useMemo<DesktopIconItem[]>(() => {
    const appItems = desktopAppIds.map((appId) => {
      const app = appRegistry[appId];
      return { id: app.id, kind: "app" as const, title: t(app.titleKey), appId: app.id, icon: app.icon };
    });
    const folderItems = folders.map((folder) => ({ id: folder.id, kind: "folder" as const, title: folder.name, icon: Folder }));
    return [...appItems, ...folderItems];
  }, [folders, t]);

  useEffect(() => {
    setFolders(readStoredFolders());
    setIconCells(readStoredCells());
    setMobile(isMobileViewport());
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setMobile(isMobileViewport());
      setLayoutTick((current) => current + 1);
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!mounted || mobile) return;
    setIconCells((currentCells) => normalizeDesktopCells(desktopItems, currentCells));
  }, [desktopItems, layoutTick, mobile, mounted]);

  useEffect(() => {
    if (mounted) window.localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders, mounted]);

  useEffect(() => {
    if (mounted && !mobile) window.localStorage.setItem(ICON_CELLS_STORAGE_KEY, JSON.stringify(iconCells));
  }, [iconCells, mobile, mounted]);

  useEffect(() => {
    const closeContextMenu = () => setContextMenu(null);
    window.addEventListener("click", closeContextMenu);
    window.addEventListener("keydown", closeContextMenu);
    return () => {
      window.removeEventListener("click", closeContextMenu);
      window.removeEventListener("keydown", closeContextMenu);
    };
  }, []);

  const getIconCell = (itemId: string, index: number) => clampCell(iconCells[itemId] ?? getDefaultIconCell(index));

  const createFolder = () => {
    const nextNumber = folders.length + 1;
    const folderId = `folder-${Date.now()}`;
    const occupied = new Set(desktopItems.map((item, index) => {
      const cell = getIconCell(item.id, index);
      return `${cell.column}:${cell.row}`;
    }));
    const newCell = findFreeCell(getDefaultIconCell(desktopItems.length), occupied);
    setFolders((currentFolders) => [...currentFolders, { id: folderId, name: nextNumber === 1 ? t("desktop.folder") : `${t("desktop.folder")} ${nextNumber}` }]);
    setIconCells((currentCells) => ({ ...currentCells, [folderId]: newCell }));
  };

  const moveSelectedFolderToRecycleBin = () => {
    const folder = folders.find((item) => item.id === selectedItemId);
    if (!folder) return;
    addItem({ name: folder.name, kind: "folder", description: t("desktop.folderHint") });
    setFolders((currentFolders) => currentFolders.filter((item) => item.id !== folder.id));
    setSelectedItemId(null);
  };

  const openItem = (item: DesktopIconItem) => {
    if (item.kind === "app" && item.appId) openApp(item.appId);
  };

  const startIconDrag = (event: ReactPointerEvent<HTMLButtonElement>, item: DesktopIconItem, index: number) => {
    event.stopPropagation();
    if (event.button !== 0) return;
    setSelectedItemId(item.id);
    if (mobile) return;
    const currentCell = getIconCell(item.id, index);
    dragStateRef.current = { iconId: item.id, startX: event.clientX, startY: event.clientY, startCell: currentCell, moved: false };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState) return;
      const deltaX = moveEvent.clientX - dragState.startX;
      const deltaY = moveEvent.clientY - dragState.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) dragState.moved = true;
      const previewCell = pointerToCell(moveEvent.clientX, moveEvent.clientY);
      setIconCells((currentCells) => ({ ...currentCells, [dragState.iconId]: previewCell }));
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (dragState && dragState.moved) {
        const occupied = new Set<string>();
        desktopItems.forEach((desktopItem, itemIndex) => {
          if (desktopItem.id === dragState.iconId) return;
          const cell = getIconCell(desktopItem.id, itemIndex);
          occupied.add(`${cell.column}:${cell.row}`);
        });
        const finalCell = findFreeCell(pointerToCell(upEvent.clientX, upEvent.clientY), occupied);
        setIconCells((currentCells) => ({ ...currentCells, [dragState.iconId]: finalCell }));
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
    setIconCells(normalizeDesktopCells(desktopItems, {}));
  };

  const metrics = mounted ? getGridMetrics() : { columns: 6, rows: 6 };
  const requiredColumns = Math.max(metrics.columns, Math.ceil(desktopItems.length / Math.max(metrics.rows, 1)));
  const desktopWidth = DESKTOP_PADDING_X * 2 + requiredColumns * DESKTOP_CELL_WIDTH;
  const desktopHeight = DESKTOP_PADDING_Y * 2 + metrics.rows * DESKTOP_CELL_HEIGHT;

  return (
    <section
      className="fixed inset-0 z-0 overflow-auto px-0 pb-[96px] pt-0"
      aria-label={t("system.desktop")}
      onClick={() => setSelectedItemId(null)}
      onContextMenu={(event) => {
        event.preventDefault();
        setContextMenu({ x: Math.min(event.clientX, window.innerWidth - 240), y: Math.min(event.clientY, window.innerHeight - 250) });
      }}
    >
      {mobile ? (
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 px-8 pb-28 pt-8">
          {desktopItems.map((item) => {
            const Icon = item.icon ?? Folder;
            const isSelected = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={clsx("flex min-h-[132px] w-full select-none flex-col items-center justify-start gap-3 rounded-3xl p-2 text-center text-white outline-none transition focus-visible:bg-white/10", isSelected ? "bg-white/15" : "hover:bg-white/10")}
                onClick={(event) => { event.stopPropagation(); setSelectedItemId(item.id); openItem(item); }}
                title={item.kind === "folder" ? t("desktop.folderHint") : item.title}
              >
                <span className={clsx("flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-md transition", isSelected ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.18)]" : "border-white/10 bg-slate-950/35 hover:bg-white/15")}>
                  <Icon size={30} />
                </span>
                <span className="max-w-[128px] text-center text-base font-semibold leading-tight drop-shadow">{item.title}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="relative" style={{ width: Math.max(window.innerWidth, desktopWidth), minHeight: Math.max(window.innerHeight - TASKBAR_CLEARANCE, desktopHeight) }}>
          {desktopItems.map((item, index) => {
            const Icon = item.icon ?? Folder;
            const isSelected = selectedItemId === item.id;
            const position = cellToPosition(getIconCell(item.id, index));
            return (
              <button
                key={item.id}
                type="button"
                className={clsx("absolute flex w-24 touch-none select-none flex-col items-center gap-2 rounded-2xl p-2 text-center text-white outline-none transition-[background,border-color,box-shadow,left,top] duration-100 focus-visible:bg-white/10", isSelected ? "bg-white/15" : "hover:bg-white/10")}
                style={{ left: position.x, top: position.y }}
                onPointerDown={(event) => startIconDrag(event, item, index)}
                onDoubleClick={(event) => { event.preventDefault(); event.stopPropagation(); openItem(item); }}
                onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openItem(item); }}
                title={item.kind === "folder" ? t("desktop.folderHint") : item.title}
              >
                <span className={clsx("flex h-14 w-14 items-center justify-center rounded-2xl border shadow-xl backdrop-blur-md transition", isSelected ? "border-[rgba(var(--os-accent-rgb),0.55)] bg-[rgba(var(--os-accent-rgb),0.18)]" : "border-white/10 bg-slate-950/35 hover:bg-white/15")}>
                  <Icon size={28} />
                </span>
                <span className="line-clamp-2 text-xs font-semibold drop-shadow">{item.title}</span>
              </button>
            );
          })}
        </div>
      )}
      <AnimatePresence>
        {contextMenu && (
          <DesktopContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onChangeWallpaper={nextWallpaper}
            onCreateFolder={createFolder}
            onOpenTerminalHere={() => openApp("terminal", { initialPath: "/home/yusuf-arca-cicek/desktop" })}
            onResetIconPositions={resetIconPositions}
            onMoveSelectedToRecycleBin={moveSelectedFolderToRecycleBin}
            canMoveSelectedToRecycleBin={folders.some((folder) => folder.id === selectedItemId)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
