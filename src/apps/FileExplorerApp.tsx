"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  Folder,
  HardDrive,
  Home,
  Maximize2,
  Terminal,
  X,
} from "lucide-react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

import { useI18n } from "@/context/LanguageContext";
import { useWindowManager } from "@/context/WindowManagerContext";
import type { VFSNode } from "@/data/vfs";
import {
  getBreadcrumbs,
  getNodeByPath,
  getParentPath,
  joinPath,
  normalizePath,
} from "@/lib/vfs";

function getPreviewText(node: VFSNode) {
  if (node.name.endsWith(".json")) {
    return JSON.stringify(
      {
        name: node.name,
        type: node.type,
        size: node.size,
        modified: node.modified,
        description: node.description,
      },
      null,
      2
    );
  }

  if (node.name.endsWith(".url")) {
    return node.description ?? "No link data.";
  }

  if (node.name.endsWith(".md") || node.name.endsWith(".txt")) {
    return node.description ?? "No markdown preview.";
  }

  return node.description ?? "No preview available.";
}

export function FileExplorerApp() {
  const { t } = useI18n();
  const { openApp } = useWindowManager();

  const [currentPath, setCurrentPath] = useState("/");
  const [backStack, setBackStack] = useState<string[]>([]);
  const [forwardStack, setForwardStack] = useState<string[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [previewNode, setPreviewNode] = useState<VFSNode | null>(null);

  const currentNode = getNodeByPath(currentPath);
  const children = currentNode?.children ?? [];

  const selectedNode = useMemo(() => {
    return children.find((child) => child.id === selectedNodeId) ?? null;
  }, [children, selectedNodeId]);

  const breadcrumbs = getBreadcrumbs(currentPath);

  const navigateTo = (nextPath: string) => {
    const normalizedPath = normalizePath(nextPath);

    if (normalizedPath === currentPath) {
      return;
    }

    setBackStack((stack) => [...stack, currentPath]);
    setForwardStack([]);
    setCurrentPath(normalizedPath);
    setSelectedNodeId(null);
  };

  const goBack = () => {
    const previousPath = backStack.at(-1);

    if (!previousPath) {
      return;
    }

    setBackStack((stack) => stack.slice(0, -1));
    setForwardStack((stack) => [currentPath, ...stack]);
    setCurrentPath(previousPath);
    setSelectedNodeId(null);
  };

  const goForward = () => {
    const nextPath = forwardStack[0];

    if (!nextPath) {
      return;
    }

    setForwardStack((stack) => stack.slice(1));
    setBackStack((stack) => [...stack, currentPath]);
    setCurrentPath(nextPath);
    setSelectedNodeId(null);
  };

  const goUp = () => {
    navigateTo(getParentPath(currentPath));
  };

  const openNode = (node: VFSNode) => {
    if (node.type === "folder") {
      navigateTo(joinPath(currentPath, node.name));
    } else {
      setPreviewNode(node);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] text-sm text-slate-200">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.04] p-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={goBack}
          disabled={backStack.length === 0}
          title={t("explorer.back")}
        >
          <ChevronLeft size={17} />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={goForward}
          disabled={forwardStack.length === 0}
          title={t("explorer.forward")}
        >
          <ChevronRight size={17} />
        </button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={goUp}
          disabled={currentPath === "/"}
          title={t("explorer.up")}
        >
          <ChevronUp size={17} />
        </button>

        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-slate-300 transition hover:bg-white/10"
          onClick={() => navigateTo("/")}
          title={t("explorer.home")}
        >
          <Home size={16} />
          <span className="hidden sm:inline">{t("explorer.home")}</span>
        </button>

        <button
          type="button"
          className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-slate-300 transition hover:bg-white/10"
          onClick={() => openApp("terminal", { initialPath: currentPath })}
          title={t("desktop.openTerminalHere")}
        >
          <Terminal size={16} />
          <span className="hidden lg:inline">{t("desktop.openTerminalHere")}</span>
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-slate-300">
          <span className="text-slate-500">{t("explorer.path")}:</span>

          {breadcrumbs.map((breadcrumb, index) => (
            <span key={breadcrumb.path} className="flex items-center gap-1">
              {index > 0 && <span className="text-slate-600">/</span>}
              <button
                type="button"
                className="rounded-md px-1 text-cyan-100 transition hover:bg-white/10"
                onClick={() => navigateTo(breadcrumb.path)}
              >
                {breadcrumb.label}
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[1fr_260px]">
        <div className="min-h-0 overflow-auto p-3">
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
            <HardDrive size={15} />
            <span>{t("explorer.currentFolder")}</span>
            <span className="font-mono text-slate-300">{currentPath}</span>
            <span>·</span>
            <span>
              {children.length} {t("explorer.items")}
            </span>
          </div>

          {children.length === 0 ? (
            <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-white/10 text-slate-500">
              {t("explorer.empty")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {children.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const Icon = node.type === "folder" ? Folder : FileText;

                return (
                  <button
                    key={node.id}
                    type="button"
                    className={clsx(
                      "group flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition",
                      isSelected
                        ? "border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.14)]"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    )}
                    onClick={() => setSelectedNodeId(node.id)}
                    onDoubleClick={() => openNode(node)}
                    title={
                      node.type === "folder"
                        ? t("explorer.openFolderHint")
                        : t("explorer.filePreview")
                    }
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 transition group-hover:scale-105">
                      <Icon size={30} />
                    </span>

                    <span className="line-clamp-2 text-xs font-medium text-white">
                      {node.name}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      {node.type === "folder"
                        ? t("explorer.folder")
                        : node.size ?? t("explorer.file")}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="min-h-0 border-t border-white/10 bg-black/10 p-4 md:border-l md:border-t-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {t("explorer.selected")}
          </p>

          {selectedNode ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  {selectedNode.type === "folder" ? (
                    <Folder size={25} />
                  ) : (
                    <FileText size={25} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">
                    {selectedNode.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedNode.type === "folder"
                      ? t("explorer.folder")
                      : t("explorer.file")}
                  </p>
                </div>
              </div>

              <dl className="space-y-2 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{t("explorer.type")}</dt>
                  <dd className="text-slate-300">
                    {selectedNode.type === "folder"
                      ? t("explorer.folder")
                      : t("explorer.file")}
                  </dd>
                </div>

                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{t("explorer.size")}</dt>
                  <dd className="text-slate-300">
                    {selectedNode.size ?? "—"}
                  </dd>
                </div>

                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">{t("explorer.modified")}</dt>
                  <dd className="text-slate-300">{selectedNode.modified}</dd>
                </div>
              </dl>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs leading-relaxed text-slate-300">
                {selectedNode.description ?? t("explorer.previewUnavailable")}
              </div>

              {selectedNode.type === "folder" ? (
                <button
                  type="button"
                  className="w-full rounded-2xl border border-[rgba(var(--os-accent-rgb),0.3)] bg-[rgba(var(--os-accent-rgb),0.1)] px-3 py-2 text-sm text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.2)]"
                  onClick={() => openNode(selectedNode)}
                >
                  {t("desktop.open")}
                </button>
              ) : (
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.3)] bg-[rgba(var(--os-accent-rgb),0.1)] px-3 py-2 text-sm text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.2)]"
                  onClick={() => setPreviewNode(selectedNode)}
                >
                  <Maximize2 size={15} />
                  {t("explorer.openPreview")}
                </button>
              )}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              {t("explorer.noSelection")}
            </p>
          )}
        </aside>
      </div>

      <AnimatePresence>
        {previewNode && (
          <motion.div
            className="absolute inset-4 z-20 flex overflow-hidden rounded-2xl border border-white/10 bg-slate-950/92 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
          >
            <div className="flex min-h-0 w-full flex-col">
              <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="font-semibold text-white">{previewNode.name}</p>
                  <p className="text-xs text-slate-500">{previewNode.modified}</p>
                </div>

                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300 transition hover:bg-white/15 hover:text-white"
                  onClick={() => setPreviewNode(null)}
                  aria-label={t("explorer.closePreview")}
                >
                  <X size={18} />
                </button>
              </div>

              <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-sm leading-relaxed text-slate-200">
                {getPreviewText(previewNode)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
