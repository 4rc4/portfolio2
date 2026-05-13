"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type NotificationTone = "info" | "success" | "warning" | "error";

export type OSNotification = {
  id: string;
  title: string;
  message?: string;
  tone: NotificationTone;
};

type NotificationContextValue = {
  notifications: OSNotification[];
  notify: (notification: Omit<OSNotification, "id">) => void;
  dismiss: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<OSNotification[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (notification: Omit<OSNotification, "id">) => {
      const id = `notification-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setNotifications((current) => [
        ...current.slice(-3),
        {
          id,
          ...notification,
        },
      ]);

      window.setTimeout(() => {
        dismiss(id);
      }, 3600);
    },
    [dismiss]
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      notifications,
      notify,
      dismiss,
    }),
    [dismiss, notifications, notify]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider.");
  }

  return context;
}
