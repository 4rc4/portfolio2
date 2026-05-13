"use client";

import { motion, useDragControls, type PanInfo } from "framer-motion";
import { Maximize2, Minus, Square, X } from "lucide-react";
import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";
import clsx from "clsx";

import { appRegistry } from "@/config/appRegistry";
import { useI18n } from "@/context/LanguageContext";
import { useWindowManager } from "@/context/WindowManagerContext";
import type { OSWindow, WindowSize } from "@/types/window";

type WindowProps = {
  osWindow: OSWindow;
};

export function Window({ osWindow }: WindowProps) {
  const { t } = useI18n();

  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager();

  const dragControls = useDragControls();
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

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      updateWindowPosition(osWindow.instanceId, {
        x: osWindow.position.x + info.offset.x,
        y: osWindow.position.y + info.offset.y,
      });
    },
    [
      updateWindowPosition,
      osWindow.instanceId,
      osWindow.position.x,
      osWindow.position.y,
    ]
  );

  const getMaximizedBounds = () => {
    return {
      position: { x: 16, y: 16 },
      size: {
        width: Math.max(globalThis.innerWidth - 32, osWindow.minSize.width),
        height: Math.max(globalThis.innerHeight - 96, osWindow.minSize.height),
      },
    };
  };

  const handleToggleMaximize = () => {
    toggleMaximizeWindow(osWindow.instanceId, getMaximizedBounds());
  };

  const handleResizePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
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

      const nextWidth =
        resizeState.startSize.width + (moveEvent.clientX - resizeState.startX);

      const nextHeight =
        resizeState.startSize.height + (moveEvent.clientY - resizeState.startY);

      updateWindowSize(osWindow.instanceId, {
        width: nextWidth,
        height: nextHeight,
      });
    };

    const handlePointerUp = () => {
      resizeStateRef.current = null;
      globalThis.removeEventListener("pointermove", handlePointerMove);
      globalThis.removeEventListener("pointerup", handlePointerUp);
    };

    globalThis.addEventListener("pointermove", handlePointerMove);
    globalThis.addEventListener("pointerup", handlePointerUp);
  };

  if (osWindow.minimized) {
    return null;
  }

  return (
    <motion.div
      className={clsx(
        "absolute left-0 top-0 flex overflow-hidden rounded-2xl border shadow-2xl",
        "bg-slate-950/50 text-white backdrop-blur-md",
        "max-sm:!left-0 max-sm:!top-0 max-sm:!h-[calc(100vh-64px)] max-sm:!w-screen max-sm:!translate-x-0 max-sm:!translate-y-0 max-sm:rounded-none",
        isActive
          ? "border-[rgba(var(--os-accent-rgb),0.45)] shadow-[0_30px_100px_rgba(var(--os-accent-rgb),0.16)]"
          : "border-white/10 shadow-black/30"
      )}
      style={{
        x: osWindow.position.x,
        y: osWindow.position.y,
        width: osWindow.size.width,
        height: osWindow.size.height,
        zIndex: osWindow.zIndex,
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{
        opacity: 1,
        scale: isActive ? 1 : 0.985,
      }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.16 }}
      drag={!osWindow.maximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragStart={() => focusWindow(osWindow.instanceId)}
      onDragEnd={handleDragEnd}
      onPointerDown={() => focusWindow(osWindow.instanceId)}
    >
      <div className="flex h-full w-full flex-col">
        <div
          className={clsx(
            "flex h-11 shrink-0 items-center justify-between border-b px-3",
            "border-white/10 bg-white/10",
            osWindow.maximized ? "cursor-default" : "cursor-move"
          )}
          onPointerDown={(event) => {
            focusWindow(osWindow.instanceId);

            if (!osWindow.maximized) {
              dragControls.start(event);
            }
          }}
          onDoubleClick={handleToggleMaximize}
        >
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgba(var(--os-accent-rgb),0.16)] text-white">
              <Icon size={16} />
            </div>

            <span className="truncate text-sm font-medium text-slate-100">
              {title}
            </span>
          </div>

          <div
            className="flex items-center gap-1"
            onPointerDown={(event) => event.stopPropagation()}
          >
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
              aria-label={
                osWindow.maximized ? t("window.restore") : t("window.maximize")
              }
              title={
                osWindow.maximized ? t("window.restore") : t("window.maximize")
              }
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

        <div className="relative min-h-0 flex-1 overflow-auto p-4">
          <AppComponent windowId={osWindow.instanceId} />
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
