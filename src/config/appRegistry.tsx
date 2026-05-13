import {
  FolderKanban,
  HardDrive,
  Info,
  Mail,
  Settings,
  Terminal,
} from "lucide-react";

import { AboutApp } from "@/apps/AboutApp";
import { ContactApp } from "@/apps/ContactApp";
import { FileExplorerApp } from "@/apps/FileExplorerApp";
import { ProjectsApp } from "@/apps/ProjectsApp";
import { SettingsApp } from "@/apps/SettingsApp";
import { TerminalApp } from "@/apps/TerminalApp";
import type { AppDefinition } from "@/types/window";

export const appRegistry: Record<string, AppDefinition> = {
  about: {
    id: "about",
    title: "Yusuf Arca Çiçek",
    titleKey: "app.about.title",
    icon: Info,
    component: AboutApp,
    defaultPosition: { x: 120, y: 70 },
    defaultSize: { width: 820, height: 620 },
    minSize: { width: 560, height: 420 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  projects: {
    id: "projects",
    title: "Projects",
    titleKey: "app.projects.title",
    icon: FolderKanban,
    component: ProjectsApp,
    defaultPosition: { x: 170, y: 90 },
    defaultSize: { width: 980, height: 640 },
    minSize: { width: 680, height: 460 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  fileExplorer: {
    id: "fileExplorer",
    title: "My Computer",
    titleKey: "app.fileExplorer.title",
    icon: HardDrive,
    component: FileExplorerApp,
    defaultPosition: { x: 130, y: 80 },
    defaultSize: { width: 860, height: 560 },
    minSize: { width: 560, height: 380 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  terminal: {
    id: "terminal",
    title: "Terminal.exe",
    titleKey: "app.terminal.title",
    icon: Terminal,
    component: TerminalApp,
    defaultPosition: { x: 220, y: 130 },
    defaultSize: { width: 700, height: 460 },
    minSize: { width: 460, height: 320 },
    resizable: true,
    singleInstance: false,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  contact: {
    id: "contact",
    title: "Contact",
    titleKey: "app.contact.title",
    icon: Mail,
    component: ContactApp,
    defaultPosition: { x: 280, y: 120 },
    defaultSize: { width: 620, height: 460 },
    minSize: { width: 420, height: 320 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  settings: {
    id: "settings",
    title: "Settings",
    titleKey: "app.settings.title",
    icon: Settings,
    component: SettingsApp,
    defaultPosition: { x: 260, y: 110 },
    defaultSize: { width: 760, height: 560 },
    minSize: { width: 520, height: 380 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },
};

export const desktopAppIds = Object.values(appRegistry)
  .filter((app) => app.showOnDesktop !== false)
  .map((app) => app.id);
