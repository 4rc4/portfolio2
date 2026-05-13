"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import { appRegistry } from "@/config/appRegistry";
import type {
  OSWindow,
  WindowBounds,
  WindowPosition,
  WindowSize,
} from "@/types/window";

type WindowManagerState = {
  windows: OSWindow[];
  activeWindowId: string | null;
  zCounter: number;
};

type WindowManagerAction =
  | { type: "OPEN_APP"; appId: string }
  | { type: "FOCUS_WINDOW"; instanceId: string }
  | { type: "CLOSE_WINDOW"; instanceId: string }
  | { type: "MINIMIZE_WINDOW"; instanceId: string }
  | { type: "SHOW_DESKTOP" }
  | {
      type: "TOGGLE_MAXIMIZE_WINDOW";
      instanceId: string;
      maximizedBounds: WindowBounds;
    }
  | {
      type: "UPDATE_WINDOW_POSITION";
      instanceId: string;
      position: WindowPosition;
    }
  | {
      type: "UPDATE_WINDOW_SIZE";
      instanceId: string;
      size: WindowSize;
    };

type WindowManagerContextValue = {
  windows: OSWindow[];
  activeWindowId: string | null;

  openApp: (appId: string) => void;
  focusWindow: (instanceId: string) => void;
  closeWindow: (instanceId: string) => void;
  minimizeWindow: (instanceId: string) => void;
  showDesktop: () => void;
  toggleMaximizeWindow: (
    instanceId: string,
    maximizedBounds: WindowBounds
  ) => void;
  updateWindowPosition: (
    instanceId: string,
    position: WindowPosition
  ) => void;
  updateWindowSize: (instanceId: string, size: WindowSize) => void;
};

const initialState: WindowManagerState = {
  windows: [],
  activeWindowId: null,
  zCounter: 20,
};

const WindowManagerContext = createContext<WindowManagerContextValue | null>(
  null
);

function createInstanceId(appId: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${appId}-${crypto.randomUUID()}`;
  }

  return `${appId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getTopWindowId(windows: OSWindow[]) {
  const visibleWindows = windows.filter((windowItem) => !windowItem.minimized);

  if (visibleWindows.length === 0) {
    return null;
  }

  return visibleWindows.reduce((topWindow, currentWindow) => {
    return currentWindow.zIndex > topWindow.zIndex
      ? currentWindow
      : topWindow;
  }).instanceId;
}

function clampSize(size: WindowSize, minSize: WindowSize): WindowSize {
  return {
    width: Math.max(size.width, minSize.width),
    height: Math.max(size.height, minSize.height),
  };
}

function windowManagerReducer(
  state: WindowManagerState,
  action: WindowManagerAction
): WindowManagerState {
  switch (action.type) {
    case "OPEN_APP": {
      const app = appRegistry[action.appId];

      if (!app) {
        return state;
      }

      const existingWindow = state.windows.find(
        (windowItem) => windowItem.appId === action.appId
      );

      const nextZ = state.zCounter + 1;

      if (app.singleInstance && existingWindow) {
        return {
          ...state,
          zCounter: nextZ,
          activeWindowId: existingWindow.instanceId,
          windows: state.windows.map((windowItem) =>
            windowItem.instanceId === existingWindow.instanceId
              ? {
                  ...windowItem,
                  minimized: false,
                  zIndex: nextZ,
                }
              : windowItem
          ),
        };
      }

      const offset = state.windows.length * 28;

      const newWindow: OSWindow = {
        instanceId: createInstanceId(app.id),
        appId: app.id,
        title: app.title,

        position: app.defaultPosition
          ? {
              x: app.defaultPosition.x + offset,
              y: app.defaultPosition.y + offset,
            }
          : {
              x: 120 + offset,
              y: 80 + offset,
            },

        size: app.defaultSize,
        minSize: app.minSize ?? { width: 320, height: 220 },

        zIndex: nextZ,

        minimized: false,
        maximized: false,
      };

      return {
        ...state,
        zCounter: nextZ,
        activeWindowId: newWindow.instanceId,
        windows: [...state.windows, newWindow],
      };
    }

    case "FOCUS_WINDOW": {
      const targetWindow = state.windows.find(
        (windowItem) => windowItem.instanceId === action.instanceId
      );

      if (!targetWindow) {
        return state;
      }

      if (state.activeWindowId === action.instanceId && !targetWindow.minimized) {
        return state;
      }

      const nextZ = state.zCounter + 1;

      return {
        ...state,
        zCounter: nextZ,
        activeWindowId: action.instanceId,
        windows: state.windows.map((windowItem) =>
          windowItem.instanceId === action.instanceId
            ? {
                ...windowItem,
                minimized: false,
                zIndex: nextZ,
              }
            : windowItem
        ),
      };
    }

    case "CLOSE_WINDOW": {
      const nextWindows = state.windows.filter(
        (windowItem) => windowItem.instanceId !== action.instanceId
      );

      return {
        ...state,
        windows: nextWindows,
        activeWindowId: getTopWindowId(nextWindows),
      };
    }

    case "MINIMIZE_WINDOW": {
      const nextWindows = state.windows.map((windowItem) =>
        windowItem.instanceId === action.instanceId
          ? {
              ...windowItem,
              minimized: true,
            }
          : windowItem
      );

      return {
        ...state,
        windows: nextWindows,
        activeWindowId: getTopWindowId(nextWindows),
      };
    }

    case "SHOW_DESKTOP": {
      return {
        ...state,
        activeWindowId: null,
        windows: state.windows.map((windowItem) => ({
          ...windowItem,
          minimized: true,
        })),
      };
    }

    case "TOGGLE_MAXIMIZE_WINDOW": {
      const nextZ = state.zCounter + 1;

      return {
        ...state,
        zCounter: nextZ,
        activeWindowId: action.instanceId,
        windows: state.windows.map((windowItem) => {
          if (windowItem.instanceId !== action.instanceId) {
            return windowItem;
          }

          if (windowItem.maximized && windowItem.previousBounds) {
            return {
              ...windowItem,
              maximized: false,
              position: windowItem.previousBounds.position,
              size: windowItem.previousBounds.size,
              previousBounds: undefined,
              zIndex: nextZ,
            };
          }

          return {
            ...windowItem,
            maximized: true,
            previousBounds: {
              position: windowItem.position,
              size: windowItem.size,
            },
            position: action.maximizedBounds.position,
            size: action.maximizedBounds.size,
            zIndex: nextZ,
            minimized: false,
          };
        }),
      };
    }

    case "UPDATE_WINDOW_POSITION": {
      return {
        ...state,
        windows: state.windows.map((windowItem) =>
          windowItem.instanceId === action.instanceId && !windowItem.maximized
            ? {
                ...windowItem,
                position: action.position,
              }
            : windowItem
        ),
      };
    }

    case "UPDATE_WINDOW_SIZE": {
      return {
        ...state,
        windows: state.windows.map((windowItem) =>
          windowItem.instanceId === action.instanceId && !windowItem.maximized
            ? {
                ...windowItem,
                size: clampSize(action.size, windowItem.minSize),
              }
            : windowItem
        ),
      };
    }

    default:
      return state;
  }
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(windowManagerReducer, initialState);

  const value = useMemo<WindowManagerContextValue>(
    () => ({
      windows: state.windows,
      activeWindowId: state.activeWindowId,

      openApp: (appId) => dispatch({ type: "OPEN_APP", appId }),

      focusWindow: (instanceId) =>
        dispatch({ type: "FOCUS_WINDOW", instanceId }),

      closeWindow: (instanceId) =>
        dispatch({ type: "CLOSE_WINDOW", instanceId }),

      minimizeWindow: (instanceId) =>
        dispatch({ type: "MINIMIZE_WINDOW", instanceId }),

      showDesktop: () => dispatch({ type: "SHOW_DESKTOP" }),

      toggleMaximizeWindow: (instanceId, maximizedBounds) =>
        dispatch({
          type: "TOGGLE_MAXIMIZE_WINDOW",
          instanceId,
          maximizedBounds,
        }),

      updateWindowPosition: (instanceId, position) =>
        dispatch({
          type: "UPDATE_WINDOW_POSITION",
          instanceId,
          position,
        }),

      updateWindowSize: (instanceId, size) =>
        dispatch({
          type: "UPDATE_WINDOW_SIZE",
          instanceId,
          size,
        }),
    }),
    [state.activeWindowId, state.windows]
  );

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager() {
  const context = useContext(WindowManagerContext);

  if (!context) {
    throw new Error(
      "useWindowManager must be used inside WindowManagerProvider."
    );
  }

  return context;
}
