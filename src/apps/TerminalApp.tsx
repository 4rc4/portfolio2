"use client";

import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/context/LanguageContext";
import { useOSSettings } from "@/context/OSSettingsContext";
import { getNodeByPath, resolvePath } from "@/lib/vfs";

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

export function TerminalApp() {
  const { t } = useI18n();
  const { setThemeMode, setWallpaperId, setAccentColorId } = useOSSettings();

  const [currentPath, setCurrentPath] = useState("/home/user");
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    createLine("output", "Portfolio OS Terminal v0.4"),
    createLine("output", "Type `help` to see available commands."),
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
      className="flex h-full min-h-0 flex-col rounded-lg bg-black/70 p-4 font-mono text-sm text-emerald-300"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="mb-3 border-b border-emerald-300/20 pb-3">
        <p>{t("terminal.heading")}</p>
        <p className="mt-1 text-xs text-slate-400">{t("terminal.placeholder")}</p>
      </div>

      <div className="min-h-0 flex-1 overflow-auto pr-1">
        {lines.map((line) => (
          <div
            key={line.id}
            className={
              line.kind === "error"
                ? "whitespace-pre-wrap text-red-300"
                : line.kind === "input"
                  ? "whitespace-pre-wrap text-cyan-200"
                  : "whitespace-pre-wrap text-emerald-300"
            }
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        className="mt-3 flex items-center gap-2 border-t border-emerald-300/20 pt-3"
        onSubmit={(event) => {
          event.preventDefault();
          runCommand(input);
          setInput("");
        }}
      >
        <label className="sr-only" htmlFor="terminal-input">
          {t("terminal.inputLabel")}
        </label>

        <span className="shrink-0 text-cyan-200">
          {t("terminal.prompt")}:{currentPath}$
        </span>

        <input
          id="terminal-input"
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-emerald-100 outline-none placeholder:text-slate-600"
          placeholder="help"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
