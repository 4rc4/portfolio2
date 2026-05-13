"use client";

import { useEffect, useRef, useState } from "react";

import { profile } from "@/data/profile";
import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";
import { useOSSettings } from "@/context/OSSettingsContext";
import { useWindowManager } from "@/context/WindowManagerContext";
import { getNodeByPath, resolvePath } from "@/lib/vfs";
import type { AppComponentProps } from "@/types/window";

type TerminalLine = {
  id: string;
  kind: "input" | "output" | "error";
  text: string;
};

function createLine(kind: TerminalLine["kind"], text: string): TerminalLine {
  return {
    id: `${kind}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    kind,
    text,
  };
}

export function TerminalApp({ launchData }: AppComponentProps) {
  const { language, t } = useI18n();
  const { setThemeMode, setWallpaperId, setAccentColorId } = useOSSettings();
  const { openApp } = useWindowManager();

  const initialPath =
    typeof launchData?.initialPath === "string"
      ? launchData.initialPath
      : "/home/yusuf-arca-cicek";

  const [currentPath, setCurrentPath] = useState(initialPath);
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    createLine("output", "Portfolio OS Terminal v0.7"),
    createLine("output", "Type `help` or `neofetch` to start."),
  ]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const pushLines = (...nextLines: TerminalLine[]) => {
    setLines((currentLines) => [...currentLines, ...nextLines]);
  };

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim();

    if (!command) {
      return;
    }

    const promptLine = createLine(
      "input",
      `${t("terminal.prompt")}:${currentPath}$ ${command}`
    );

    const [commandName, ...args] = command.split(/\s+/);
    const normalizedCommand = commandName.toLowerCase();
    const joinedArgs = args.join(" ").toLowerCase();

    if (normalizedCommand === "clear") {
      setLines([]);
      return;
    }

    if (normalizedCommand === "help") {
      pushLines(promptLine, createLine("output", t("terminal.help")));
      return;
    }

    if (normalizedCommand === "whoami") {
      pushLines(promptLine, createLine("output", t("terminal.whoami")));
      return;
    }

    if (normalizedCommand === "neofetch") {
      pushLines(
        promptLine,
        createLine(
          "output",
          [
            "guest@portfolio-os",
            "------------------",
            `Name: ${profile.name}`,
            `Role: ${profile.role[language]}`,
            `Base: ${profile.base}`,
            `Focus: ${profile.focus[language]}`,
            `Status: ${profile.status[language]}`,
            `Stack: ${profile.coreTools.join(", ")}`,
          ].join("\n")
        )
      );
      return;
    }

    if (normalizedCommand === "projects") {
      pushLines(
        promptLine,
        createLine(
          "output",
          portfolioProjects.map((project) => `- ${project.title}`).join("\n")
        )
      );
      openApp("projects");
      return;
    }

    if (normalizedCommand === "skills") {
      pushLines(promptLine, createLine("output", profile.coreTools.join("  ")));
      openApp("skills");
      return;
    }

    if (normalizedCommand === "contact") {
      pushLines(
        promptLine,
        createLine(
          "output",
          [
            `Email: ${profile.contactEmail}`,
            `GitHub: ${profile.githubUrl}`,
            `LinkedIn: ${profile.linkedInUrl}`,
          ].join("\n")
        )
      );
      openApp("contact");
      return;
    }

    if (normalizedCommand === "cv") {
      pushLines(promptLine, createLine("output", profile.cvUrl));
      openApp("cv");
      return;
    }

    if (normalizedCommand === "about") {
      pushLines(promptLine, createLine("output", profile.summary[language]));
      openApp("about");
      return;
    }

    if (normalizedCommand === "socials") {
      pushLines(
        promptLine,
        createLine(
          "output",
          [`GitHub: ${profile.githubUrl}`, `LinkedIn: ${profile.linkedInUrl}`].join("\n")
        )
      );
      return;
    }

    if (normalizedCommand === "open") {
      if (joinedArgs.includes("catudy")) {
        openApp("projects", { projectId: "catudy-app" });
        pushLines(promptLine, createLine("output", "Opening Catudy..."));
        return;
      }

      if (joinedArgs.includes("project")) {
        openApp("projects");
        pushLines(promptLine, createLine("output", "Opening Projects..."));
        return;
      }

      if (joinedArgs.includes("contact")) {
        openApp("contact");
        pushLines(promptLine, createLine("output", "Opening Contact..."));
        return;
      }

      if (joinedArgs.includes("cv")) {
        openApp("cv");
        pushLines(promptLine, createLine("output", "Opening CV..."));
        return;
      }

      if (joinedArgs.includes("skills")) {
        openApp("skills");
        pushLines(promptLine, createLine("output", "Opening Skills..."));
        return;
      }

      pushLines(promptLine, createLine("error", "open catudy | open projects | open contact | open cv | open skills"));
      return;
    }

    if (normalizedCommand === "pwd") {
      pushLines(promptLine, createLine("output", currentPath));
      return;
    }

    if (normalizedCommand === "ls") {
      const targetPath = args[0]
        ? resolvePath(currentPath, args[0])
        : currentPath;

      const node = getNodeByPath(targetPath);

      if (!node) {
        pushLines(
          promptLine,
          createLine("error", `${t("terminal.notFound")}: ${targetPath}`)
        );
        return;
      }

      if (node.type !== "folder") {
        pushLines(
          promptLine,
          createLine("output", `${node.name} ${node.size ?? ""}`)
        );
        return;
      }

      const output =
        node.children && node.children.length > 0
          ? node.children
              .map((child) => (child.type === "folder" ? `${child.name}/` : child.name))
              .join("    ")
          : "(empty)";

      pushLines(promptLine, createLine("output", output));
      return;
    }

    if (normalizedCommand === "cd") {
      const targetPath = resolvePath(currentPath, args[0] ?? "~");
      const node = getNodeByPath(targetPath);

      if (!node) {
        pushLines(
          promptLine,
          createLine("error", `${t("terminal.notFound")}: ${targetPath}`)
        );
        return;
      }

      if (node.type !== "folder") {
        pushLines(
          promptLine,
          createLine("error", `${t("terminal.notFolder")}: ${targetPath}`)
        );
        return;
      }

      setCurrentPath(targetPath);
      pushLines(promptLine);
      return;
    }

    if (normalizedCommand === "theme") {
      const option = args[0];

      if (option === "--dark") {
        setThemeMode("dark");
        setWallpaperId("midnight-grid");
        setAccentColorId("cyan");
        pushLines(promptLine, createLine("output", t("terminal.themeDark")));
        return;
      }

      if (option === "--light") {
        setThemeMode("light");
        setWallpaperId("warm-dusk");
        setAccentColorId("amber");
        pushLines(promptLine, createLine("output", t("terminal.themeLight")));
        return;
      }

      if (option === "--violet") {
        setThemeMode("dark");
        setWallpaperId("violet-glass");
        setAccentColorId("violet");
        pushLines(promptLine, createLine("output", t("terminal.themeViolet")));
        return;
      }

      pushLines(
        promptLine,
        createLine("output", "theme --dark | theme --light | theme --violet")
      );
      return;
    }

    pushLines(
      promptLine,
      createLine("error", `${t("terminal.unknown")}: ${commandName}`)
    );
  };

  return (
    <div
      className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-lg bg-black/70 p-4 font-mono text-sm text-emerald-300"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-3 shrink-0 border-b border-emerald-300/20 pb-3">
        <p>{t("terminal.heading")}</p>
        <p className="mt-1 text-xs text-slate-400">{t("terminal.placeholder")}</p>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto pr-1">
        {lines.map((line) => (
          <div
            key={line.id}
            className={
              line.kind === "error"
                ? "whitespace-pre-wrap break-words text-red-300"
                : line.kind === "input"
                  ? "whitespace-pre-wrap break-words text-cyan-200"
                  : "whitespace-pre-wrap break-words text-emerald-300"
            }
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        className="mt-3 shrink-0 border-t border-emerald-300/20 pt-3"
        onSubmit={(event) => {
          event.preventDefault();
          runCommand(input);
          setInput("");
        }}
      >
        <label className="sr-only" htmlFor="terminal-input">
          {t("terminal.inputLabel")}
        </label>

        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="max-w-full break-all text-cyan-200">
            {t("terminal.prompt")}:{currentPath}$
          </span>

          <input
            id="terminal-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="min-w-[160px] flex-1 bg-transparent text-emerald-100 outline-none placeholder:text-slate-600"
            placeholder="neofetch"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </form>
    </div>
  );
}
