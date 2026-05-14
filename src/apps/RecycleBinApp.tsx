"use client";

import { RotateCcw, Trash2 } from "lucide-react";

import { useI18n } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationContext";
import { useRecycleBin } from "@/context/RecycleBinContext";

export function RecycleBinApp() {
  const { language } = useI18n();
  const { notify } = useNotifications();
  const { items, removeItem, emptyBin } = useRecycleBin();

  const labels = {
    title: language === "tr" ? "Geri Dönüşüm Kutusu" : "Recycle Bin",
    empty: language === "tr" ? "Kutu boş." : "The bin is empty.",
    restore: language === "tr" ? "Kayıttan kaldır" : "Remove from bin",
    emptyBin: language === "tr" ? "Kutuyu boşalt" : "Empty bin",
    note: language === "tr"
      ? "Bu sanal kutu masaüstü klasörleri ve notları takip eder."
      : "This virtual bin tracks desktop folders and notes.",
  };

  return (
    <div className="space-y-4 text-sm text-slate-200">
      <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(var(--os-accent-rgb),0.20),transparent_35%),rgba(255,255,255,0.05)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">System</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{labels.title}</h2>
            <p className="mt-2 text-slate-400">{labels.note}</p>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-2xl border border-red-300/20 bg-red-500/10 px-4 py-2 text-red-100 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={items.length === 0}
            onClick={() => {
              emptyBin();
              notify({ title: labels.emptyBin, tone: "success" });
            }}
          >
            <Trash2 size={16} />
            {labels.emptyBin}
          </button>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="flex h-48 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-slate-500">
          {labels.empty}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{item.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{item.kind}</p>
                  {item.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-400">
                      {item.description}
                    </p>
                  )}
                  <p className="mt-3 text-xs text-slate-600">
                    {new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(item.deletedAt))}
                  </p>
                </div>

                <button
                  type="button"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                  onClick={() => removeItem(item.id)}
                  title={labels.restore}
                >
                  <RotateCcw size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
