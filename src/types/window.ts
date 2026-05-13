import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

import type { TranslationKey } from "@/i18n/translations";

export type WindowPosition = {
  x: number;
  y: number;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowBounds = {
  position: WindowPosition;
  size: WindowSize;
};

export type AppComponentProps = {
  windowId: string;
};

export type AppDefinition = {
  id: string;
  title: string;
  titleKey: TranslationKey;
  icon: LucideIcon;
  component: ComponentType<AppComponentProps>;

  defaultPosition?: WindowPosition;
  defaultSize: WindowSize;
  minSize?: WindowSize;

  resizable?: boolean;
  singleInstance?: boolean;
  showOnDesktop?: boolean;
  showInStartMenu?: boolean;
};

export type OSWindow = {
  instanceId: string;
  appId: string;
  title: string;

  position: WindowPosition;
  size: WindowSize;
  minSize: WindowSize;

  zIndex: number;

  minimized: boolean;
  maximized: boolean;
  previousBounds?: WindowBounds;
};
