import {
  Activity,
  Briefcase,
  Globe2,
  Code2,
  FileText,
  FolderKanban,
  HardDrive,
  Info,
  Mail,
  Settings,
  Terminal,
  Trash2,
} from "lucide-react";

import { AboutApp } from "@/apps/AboutApp";
import { BrowserApp } from "@/apps/BrowserApp";
import { ContactApp } from "@/apps/ContactApp";
import { CVApp } from "@/apps/CVApp";
import { NotepadApp } from "@/apps/NotepadApp";
import { RecycleBinApp } from "@/apps/RecycleBinApp";
import { ExperienceApp } from "@/apps/ExperienceApp";
import { FileExplorerApp } from "@/apps/FileExplorerApp";
import { ProjectsApp } from "@/apps/ProjectsApp";
import { SettingsApp } from "@/apps/SettingsApp";
import { SkillsApp } from "@/apps/SkillsApp";
import { SystemMonitorApp } from "@/apps/SystemMonitorApp";
import { TerminalApp } from "@/apps/TerminalApp";
import type { AppDefinition } from "@/types/window";

export const appRegistry: Record<string, AppDefinition> = {
  about: {
    id: "about",
    title: "Yusuf Arca Çiçek",
    titleKey: "app.about.title",
    icon: Info,
    component: AboutApp,
    defaultPosition: { x: 90, y: 60 },
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
    defaultPosition: { x: 140, y: 70 },
    defaultSize: { width: 1040, height: 660 },
    minSize: { width: 700, height: 480 },
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
    defaultPosition: { x: 150, y: 90 },
    defaultSize: { width: 900, height: 590 },
    minSize: { width: 580, height: 400 },
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
    defaultSize: { width: 740, height: 480 },
    minSize: { width: 480, height: 340 },
    resizable: true,
    singleInstance: false,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  cv: {
    id: "cv",
    title: "CV",
    titleKey: "app.cv.title",
    icon: FileText,
    component: CVApp,
    defaultPosition: { x: 190, y: 80 },
    defaultSize: { width: 860, height: 640 },
    minSize: { width: 580, height: 420 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  skills: {
    id: "skills",
    title: "Skills",
    titleKey: "app.skills.title",
    icon: Code2,
    component: SkillsApp,
    defaultPosition: { x: 230, y: 110 },
    defaultSize: { width: 820, height: 580 },
    minSize: { width: 540, height: 380 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  experience: {
    id: "experience",
    title: "Experience",
    titleKey: "app.experience.title",
    icon: Briefcase,
    component: ExperienceApp,
    defaultPosition: { x: 260, y: 100 },
    defaultSize: { width: 860, height: 600 },
    minSize: { width: 560, height: 400 },
    resizable: true,
    singleInstance: true,
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


  browser: {
    id: "browser",
    title: "Browser",
    titleKey: "app.browser.title",
    icon: Globe2,
    component: BrowserApp,
    defaultPosition: { x: 180, y: 80 },
    defaultSize: { width: 980, height: 650 },
    minSize: { width: 580, height: 420 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  notepad: {
    id: "notepad",
    title: "Notepad",
    titleKey: "app.notepad.title",
    icon: FileText,
    component: NotepadApp,
    defaultPosition: { x: 210, y: 100 },
    defaultSize: { width: 760, height: 560 },
    minSize: { width: 460, height: 340 },
    resizable: true,
    singleInstance: false,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  systemMonitor: {
    id: "systemMonitor",
    title: "System Monitor",
    titleKey: "app.systemMonitor.title",
    icon: Activity,
    component: SystemMonitorApp,
    defaultPosition: { x: 320, y: 120 },
    defaultSize: { width: 760, height: 540 },
    minSize: { width: 520, height: 360 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },

  recycleBin: {
    id: "recycleBin",
    title: "Recycle Bin",
    titleKey: "app.recycleBin.title",
    icon: Trash2,
    component: RecycleBinApp,
    defaultPosition: { x: 340, y: 120 },
    defaultSize: { width: 680, height: 500 },
    minSize: { width: 460, height: 340 },
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
    defaultPosition: { x: 300, y: 100 },
    defaultSize: { width: 820, height: 620 },
    minSize: { width: 540, height: 400 },
    resizable: true,
    singleInstance: true,
    showOnDesktop: true,
    showInStartMenu: true,
  },
};

export const desktopAppIds = Object.values(appRegistry)
  .filter((app) => app.showOnDesktop !== false)
  .map((app) => app.id);
