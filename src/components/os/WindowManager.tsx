"use client";

import { AnimatePresence } from "framer-motion";

import { Window } from "@/components/os/Window";
import { useWindowManager } from "@/context/WindowManagerContext";

export function WindowManager() {
  const { windows } = useWindowManager();

  return (
    <AnimatePresence>
      {windows.map((osWindow) => (
        <Window key={osWindow.instanceId} osWindow={osWindow} />
      ))}
    </AnimatePresence>
  );
}
