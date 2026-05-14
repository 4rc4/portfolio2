"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type RecycleBinItem = {
  id: string;
  name: string;
  kind: "folder" | "note" | "file";
  description?: string;
  deletedAt: string;
  payload?: Record<string, unknown>;
};

type RecycleBinContextValue = {
  items: RecycleBinItem[];
  addItem: (item: Omit<RecycleBinItem, "id" | "deletedAt">) => void;
  removeItem: (id: string) => void;
  emptyBin: () => void;
};

const STORAGE_KEY = "portfolio-os-recycle-bin";
const RecycleBinContext = createContext<RecycleBinContextValue | null>(null);

function readItems(): RecycleBinItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function RecycleBinProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<RecycleBinItem[]>([]);

  useEffect(() => {
    setItems(readItems());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: Omit<RecycleBinItem, "id" | "deletedAt">) => {
    setItems((current) => [
      {
        ...item,
        id: `trash-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        deletedAt: new Date().toISOString(),
      },
      ...current,
    ]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const emptyBin = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<RecycleBinContextValue>(
    () => ({ items, addItem, removeItem, emptyBin }),
    [addItem, emptyBin, items, removeItem]
  );

  return (
    <RecycleBinContext.Provider value={value}>
      {children}
    </RecycleBinContext.Provider>
  );
}

export function useRecycleBin() {
  const context = useContext(RecycleBinContext);

  if (!context) {
    throw new Error("useRecycleBin must be used inside RecycleBinProvider.");
  }

  return context;
}
