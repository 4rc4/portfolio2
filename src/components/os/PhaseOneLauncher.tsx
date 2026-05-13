"use client";

import { appRegistry } from "@/config/appRegistry";
import { useWindowManager } from "@/context/WindowManagerContext";

export function PhaseOneLauncher() {
  const { openApp } = useWindowManager();

  return (
    <div className="absolute left-6 top-6 z-10 w-72 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-white shadow-2xl backdrop-blur-md">
      <p className="text-sm font-semibold">Portfolio OS — Faz 1</p>
      <p className="mt-1 text-xs text-slate-300">
        Şimdilik masaüstü yerine test launcher kullanıyoruz. Faz 2&apos;de bu
        alan gerçek desktop grid ve taskbar ile değişecek.
      </p>

      <div className="mt-4 space-y-2">
        {Object.values(appRegistry).map((app) => {
          const Icon = app.icon;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => openApp(app.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm transition hover:bg-white/10"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Icon size={17} />
              </span>

              <span>{app.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
