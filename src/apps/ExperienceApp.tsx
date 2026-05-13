"use client";

import { Briefcase, GraduationCap } from "lucide-react";

import { education, experience } from "@/data/profile";
import { useI18n } from "@/context/LanguageContext";

export function ExperienceApp() {
  const { language, t } = useI18n();

  return (
    <div className="space-y-5 text-sm text-slate-200">
      <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(var(--os-accent-rgb),0.20),transparent_35%),rgba(255,255,255,0.05)] p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
          {t("experience.heading")}
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {t("experience.description")}
        </h2>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <GraduationCap size={18} />
            {t("about.education")}
          </h3>

          <div className="mt-5 space-y-5">
            {education.map((item) => (
              <article key={`${item.date}-${item.title}`} className="relative border-l border-[rgba(var(--os-accent-rgb),0.28)] pl-5">
                <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-[rgb(var(--os-accent-rgb))]" />
                <p className="text-xs text-slate-500">{item.date}</p>
                <h4 className="mt-1 font-medium text-white">{item.title}</h4>
                {item.place && <p className="text-xs text-slate-400">{item.place}</p>}
                <p className="mt-2 leading-relaxed text-slate-300">
                  {item.description[language]}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <Briefcase size={18} />
            {t("about.experience")}
          </h3>

          <div className="mt-5 space-y-5">
            {experience.map((item) => (
              <article key={`${item.date}-${item.title}`} className="relative border-l border-white/10 pl-5">
                <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full bg-white/40" />
                <p className="text-xs text-slate-500">{item.date}</p>
                <h4 className="mt-1 font-medium text-white">{item.title}</h4>
                {item.place && <p className="text-xs text-slate-400">{item.place}</p>}
                <p className="mt-2 leading-relaxed text-slate-300">
                  {item.description[language]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
