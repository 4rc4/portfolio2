"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Cpu, Loader2, Volume2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/context/LanguageContext";

type BootScreenProps = {
  onComplete: () => void;
};

type AudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function playStartupSound() {
  try {
    const audioWindow = window as AudioWindow;
    const AudioContextClass =
      audioWindow.AudioContext ?? audioWindow.webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    const gainNode = audioContext.createGain();

    gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.7);

    gainNode.connect(audioContext.destination);

    const notes = [392, 523.25, 659.25];

    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime + index * 0.12
      );
      oscillator.connect(gainNode);
      oscillator.start(audioContext.currentTime + index * 0.12);
      oscillator.stop(audioContext.currentTime + index * 0.12 + 0.22);
    });

    window.setTimeout(() => {
      void audioContext.close();
    }, 900);
  } catch {
    // Browser audio restrictions should not block the OS boot.
  }
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const { t } = useI18n();

  const bootMessages = useMemo(
    () => [
      t("boot.loadingKernel"),
      t("boot.mountingVfs"),
      t("boot.startingWindowManager"),
      t("boot.loadingApps"),
      t("boot.ready"),
    ],
    [t]
  );

  const [booting, setBooting] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!booting) {
      return;
    }

    const messageTimers = bootMessages.map((_, index) =>
      window.setTimeout(() => {
        setMessageIndex(index);
      }, index * 360)
    );

    const completeTimer = window.setTimeout(() => {
      onComplete();
    }, 2100);

    return () => {
      messageTimers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(completeTimer);
    };
  }, [bootMessages, booting, onComplete]);

  const startBoot = () => {
    setBooting(true);
    playStartupSound();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[20000] flex items-center justify-center overflow-hidden bg-slate-950 text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.35 }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(var(--os-accent-rgb),0.22),transparent_34%),radial-gradient(circle_at_80%_30%,rgba(167,139,250,0.18),transparent_30%),linear-gradient(135deg,#020617,#0f172a,#020617)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:54px_54px]" />

      <motion.div
        className="relative mx-5 w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.055] p-6 shadow-2xl backdrop-blur-xl"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.16)]">
            {booting ? (
              <Loader2 className="animate-spin" size={30} />
            ) : (
              <Cpu size={31} />
            )}
          </div>

          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("boot.title")}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {t("boot.subtitle")}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-4 font-mono text-sm">
          {booting ? (
            <div className="space-y-2">
              {bootMessages.slice(0, messageIndex + 1).map((message, index) => (
                <motion.div
                  key={message}
                  className="flex items-center gap-2 text-emerald-300"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {index === bootMessages.length - 1 ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-[rgb(var(--os-accent-rgb))]" />
                  )}
                  <span>{message}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400">
              <p>Portfolio OS</p>
              <p className="mt-1">Press start to enter the portfolio.</p>
            </div>
          )}
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[rgb(var(--os-accent-rgb))]"
            initial={{ width: "0%" }}
            animate={{ width: booting ? "100%" : "8%" }}
            transition={{ duration: booting ? 2.05 : 0.3, ease: "easeInOut" }}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Volume2 size={14} />
            <span>{t("boot.skipSound")}</span>
          </p>

          <button
            type="button"
            className="rounded-2xl border border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.16)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={startBoot}
            disabled={booting}
          >
            {t("boot.start")}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
