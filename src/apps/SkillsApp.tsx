"use client";

import { Code2, Palette, Smartphone, Server } from "lucide-react";

import { profile, skillGroups } from "@/data/profile";
import { useI18n } from "@/context/LanguageContext";

const icons = [Code2, Smartphone, Server, Palette];

export function SkillsApp() {
  const { language, t } = useI18n();

  return (
    <div className="space-y-5 text-sm text-slate-200">
      <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(var(--os-accent-rgb),0.20),transparent_35%),rgba(255,255,255,0.05)] p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
          {t("skills.heading")}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {t("skills.description")}
        </h2>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {skillGroups.map((group, index) => {
          const Icon = icons[index] ?? Code2;

          return (
            <article
              key={group.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(var(--os-accent-rgb),0.14)]">
                  <Icon size={21} />
                </span>
                <h3 className="font-semibold text-white">{group.title}</h3>
              </div>

              <p className="mt-3 leading-relaxed text-slate-300">
                {group.description[language]}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold text-white">{t("about.languages")}</h3>
          <div className="mt-4 space-y-2">
            {profile.languages.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-3 py-2"
              >
                <span>{item.name}</span>
                <span className="text-slate-400">{item.level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold text-white">Core tools</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.coreTools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-slate-300"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold text-white">Strengths</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.softStrengths.map((strength) => (
              <span
                key={strength}
                className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-slate-300"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
