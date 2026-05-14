"use client";

import { motion } from "framer-motion";
import { Maximize2, Minus, Square, X } from "lucide-react";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import clsx from "clsx";

import { appRegistry } from "@/config/appRegistry";
import { useI18n } from "@/context/LanguageContext";
import { useWindowManager } from "@/context/WindowManagerContext";
import type { OSWindow, WindowBounds, WindowPosition, WindowSize } from "@/types/window";

type WindowProps = {
  osWindow: OSWindow;
};

const TASKBAR_HEIGHT = 64;
const SCREEN_PADDING = 10;
const EDGE_SNAP_SIZE = 10;
const CORNER_SNAP_SIZE = 120;

function clampWindowPosition(position: WindowPosition, size: WindowSize) {
  if (typeof window === "undefined") {
    return position;
  }

  return {
    x: Math.max(0, Math.min(position.x, Math.max(0, window.innerWidth - Math.min(size.width, 160)))),
    y: Math.max(0, Math.min(position.y, Math.max(0, window.innerHeight - TASKBAR_HEIGHT - 44))),
  };
}

function getWorkArea() {
  return {
    x: SCREEN_PADDING,
    y: SCREEN_PADDING,
    width: Math.max(320, window.innerWidth - SCREEN_PADDING * 2),
    height: Math.max(240, window.innerHeight - TASKBAR_HEIGHT - SCREEN_PADDING * 2),
  };
}

function getSnapBounds(clientX: number, clientY: number): { bounds: WindowBounds; maximized?: boolean } | null {
  const area = getWorkArea();
  const rightEdge = window.innerWidth - EDGE_SNAP_SIZE;
  const bottomEdge = window.innerHeight - TASKBAR_HEIGHT - EDGE_SNAP_SIZE;

  if (clientX <= EDGE_SNAP_SIZE && clientY <= CORNER_SNAP_SIZE) {
    return { bounds: { position: { x: area.x, y: area.y }, size: { width: area.width / 2, height: area.height / 2 } } };
  }

  if (clientX >= rightEdge && clientY <= CORNER_SNAP_SIZE) {
    return { bounds: { position: { x: area.x + area.width / 2, y: area.y }, size: { width: area.width / 2, height: area.height / 2 } } };
  }

  if (clientX <= EDGE_SNAP_SIZE && clientY >= bottomEdge - CORNER_SNAP_SIZE) {
    return { bounds: { position: { x: area.x, y: area.y + area.height / 2 }, size: { width: area.width / 2, height: area.height / 2 } } };
  }

  if (clientX >= rightEdge && clientY >= bottomEdge - CORNER_SNAP_SIZE) {
    return { bounds: { position: { x: area.x + area.width / 2, y: area.y + area.height / 2 }, size: { width: area.width / 2, height: area.height / 2 } } };
  }

  if (clientY <= EDGE_SNAP_SIZE) {
    return { bounds: { position: { x: area.x, y: area.y }, size: { width: area.width, height: area.height } }, maximized: true };
  }

  if (clientX <= EDGE_SNAP_SIZE) {
    return { bounds: { position: { x: area.x, y: area.y }, size: { width: area.width / 2, height: area.height } } };
  }

  if (clientX >= rightEdge) {
    return { bounds: { position: { x: area.x + area.width / 2, y: area.y }, size: { width: area.width / 2, height: area.height } } };
  }

  return null;
}

export function Window({ osWindow }: WindowProps) {
  const { t } = useI18n();

  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    setWindowBounds,
    toggleMaximizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager();

  const dragStateRef = useRef<{
    startX: number;
    startY: number;
    startPosition: WindowPosition;
    moved: boolean;
  } | null>(null);

  const resizeStateRef = useRef<{
    startX: number;
    startY: number;
    startSize: WindowSize;
  } | null>(null);

  const app = appRegistry[osWindow.appId];
  const AppComponent = app.component;

  const isActive = activeWindowId === osWindow.instanceId;
  const isResizable = app.resizable !== false && !osWindow.maximized;

  const Icon = app.icon;
  const title = app.titleKey ? t(app.titleKey) : osWindow.title;

  const getMaximizedBounds = () => {
    const area = getWorkArea();

    return {
      position: { x: area.x, y: area.y },
      size: { width: area.width, height: area.height },
    };
  };

  const handleToggleMaximize = () => {
    toggleMaximizeWindow(osWindow.instanceId, getMaximizedBounds());
  };

  const handleTitlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    focusWindow(osWindow.instanceId);

    if (osWindow.maximized || event.button !== 0) {
      return;
    }

    event.preventDefault();

    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startPosition: osWindow.position,
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

      const nextPosition = clampWindowPosition(
        { x: dragState.startPosition.x + deltaX, y: dragState.startPosition.y + deltaY },
        osWindow.size
      );

      updateWindowPosition(osWindow.instanceId, nextPosition);
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      const dragState = dragStateRef.current;

      if (dragState?.moved) {
        const snap = getSnapBounds(upEvent.clientX, upEvent.clientY);

        if (snap) {
          setWindowBounds(osWindow.instanceId, snap.bounds, snap.maximized);
        }
      }

      dragStateRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleResizePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isResizable) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    focusWindow(osWindow.instanceId);

    resizeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startSize: osWindow.size,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const resizeState = resizeStateRef.current;

      if (!resizeState) {
        return;
      }

      const maxWidth = window.innerWidth - osWindow.position.x - SCREEN_PADDING;
      const maxHeight = window.innerHeight - osWindow.position.y - TASKBAR_HEIGHT - SCREEN_PADDING;

      const nextWidth = Math.min(
        resizeState.startSize.width + (moveEvent.clientX - resizeState.startX),
        maxWidth
      );

      const nextHeight = Math.min(
        resizeState.startSize.height + (moveEvent.clientY - resizeState.startY),
        maxHeight
      );

      updateWindowSize(osWindow.instanceId, { width: nextWidth, height: nextHeight });
    };

    const handlePointerUp = () => {
      resizeStateRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  if (osWindow.minimized) {
    return null;
  }

  return (
    <motion.div
      className={clsx(
        "fixed flex overflow-hidden rounded-2xl border shadow-2xl",
        "bg-slate-950/50 text-white backdrop-blur-md",
        "max-sm:!left-0 max-sm:!top-0 max-sm:!h-[calc(100dvh-64px)] max-sm:!w-dvw max-sm:rounded-none",
        isActive
          ? "border-[rgba(var(--os-accent-rgb),0.45)] shadow-[0_30px_100px_rgba(var(--os-accent-rgb),0.16)]"
          : "border-white/10 shadow-black/30"
      )}
      style={{
        left: osWindow.position.x,
        top: osWindow.position.y,
        width: osWindow.size.width,
        height: osWindow.size.height,
        zIndex: osWindow.zIndex,
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: isActive ? 1 : 0.985 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.16 }}
      onPointerDown={() => focusWindow(osWindow.instanceId)}
    >
      <div className="flex h-full min-w-0 w-full flex-col">
        <div
          className={clsx(
            "flex h-11 shrink-0 items-center justify-between border-b px-3",
            "border-white/10 bg-white/10",
            osWindow.maximized ? "cursor-default" : "cursor-move"
          )}
          onPointerDown={handleTitlePointerDown}
          onDoubleClick={handleToggleMaximize}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(var(--os-accent-rgb),0.16)] text-white">
              <Icon size={16} />
            </div>

            <span className="truncate text-sm font-medium text-slate-100">{title}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1" onPointerDown={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label={t("window.minimize")}
              title={t("window.minimize")}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={() => minimizeWindow(osWindow.instanceId)}
            >
              <Minus size={15} />
            </button>

            <button
              type="button"
              aria-label={osWindow.maximized ? t("window.restore") : t("window.maximize")}
              title={osWindow.maximized ? t("window.restore") : t("window.maximize")}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={handleToggleMaximize}
            >
              {osWindow.maximized ? <Square size={14} /> : <Maximize2 size={14} />}
            </button>

            <button
              type="button"
              aria-label={t("window.close")}
              title={t("window.close")}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-500/80 hover:text-white"
              onClick={() => closeWindow(osWindow.instanceId)}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 min-w-0 flex-1 overflow-auto p-4">
          <AppComponent windowId={osWindow.instanceId} launchData={osWindow.launchData} />
        </div>
      </div>

      {isResizable && (
        <div
          className="absolute bottom-1 right-1 h-5 w-5 cursor-nwse-resize rounded-br-2xl max-sm:hidden"
          onPointerDown={handleResizePointerDown}
        >
          <div className="absolute bottom-1 right-1 h-3 w-3 border-b-2 border-r-2 border-white/30" />
        </div>
      )}
    </motion.div>
  );
}
