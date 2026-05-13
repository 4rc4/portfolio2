"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import clsx from "clsx";

import { useNotifications, type NotificationTone } from "@/context/NotificationContext";

const toneIcon: Record<NotificationTone, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  error: XCircle,
};

export function NotificationCenter() {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[16000] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-3">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = toneIcon[notification.tone];

          return (
            <motion.div
              key={notification.id}
              className={clsx(
                "pointer-events-auto overflow-hidden rounded-2xl border bg-slate-950/75 p-4 text-white shadow-2xl backdrop-blur-xl",
                notification.tone === "success"
                  ? "border-emerald-300/25"
                  : notification.tone === "error"
                    ? "border-red-300/25"
                    : notification.tone === "warning"
                      ? "border-amber-300/25"
                      : "border-white/10"
              )}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.96 }}
              transition={{ duration: 0.16 }}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[rgba(var(--os-accent-rgb),0.14)]">
                  <Icon size={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{notification.title}</p>
                  {notification.message && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {notification.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  onClick={() => dismiss(notification.id)}
                >
                  <X size={15} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
