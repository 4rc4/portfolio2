"use client";

import { Briefcase, GraduationCap, Languages, MapPin, Sparkles } from "lucide-react";

import {
  education,
  experience,
  profile,
  skillGroups,
} from "@/data/profile";
import { useI18n } from "@/context/LanguageContext";

export function AboutApp() {
  const { language, t } = useI18n();

  return (
    <div className="space-y-5 text-sm text-slate-200">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055]">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(var(--os-accent-rgb),0.22),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            Software Engineering Student / Web / Mobile / Interactive
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {profile.heroTitle[language]}
          </h1>

          <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
            {profile.summary[language]}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {profile.coreTools.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {t("about.profile")}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              {profile.name}
            </h2>
          </div>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">{t("about.role")}</dt>
              <dd className="text-white">{profile.role[language]}</dd>
            </div>

            <div>
              <dt className="text-slate-500">{t("about.base")}</dt>
              <dd className="flex items-center gap-2 text-white">
                <MapPin size={15} />
                {profile.base}
              </dd>
            </div>

            <div>
              <dt className="text-slate-500">{t("about.focus")}</dt>
              <dd className="text-white">{profile.focus[language]}</dd>
            </div>

            <div>
              <dt className="text-slate-500">{t("about.status")}</dt>
              <dd className="text-white">{profile.status[language]}</dd>
            </div>
          </dl>
        </aside>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {t("about.quickIntro")}
          </p>

          <div className="mt-3 space-y-3 leading-relaxed text-slate-300">
            {profile.intro[language].map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.28)] bg-[rgba(var(--os-accent-rgb),0.08)] p-4">
            <div className="flex items-center gap-2 font-medium text-white">
              <Sparkles size={17} />
              {t("about.currentFocus")}
            </div>

            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {t("about.currentFocusText")}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <GraduationCap size={18} />
            {t("about.education")}
          </h3>

          <div className="mt-4 space-y-4">
            {education.map((item) => (
              <article key={`${item.date}-${item.title}`} className="border-l border-white/10 pl-4">
                <p className="text-xs text-slate-500">{item.date}</p>
                <h4 className="mt-1 font-medium text-white">{item.title}</h4>
                {item.place && <p className="text-xs text-slate-400">{item.place}</p>}
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
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

          <div className="mt-4 space-y-4">
            {experience.map((item) => (
              <article key={`${item.date}-${item.title}`} className="border-l border-white/10 pl-4">
                <p className="text-xs text-slate-500">{item.date}</p>
                <h4 className="mt-1 font-medium text-white">{item.title}</h4>
                {item.place && <p className="text-xs text-slate-400">{item.place}</p>}
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {item.description[language]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold text-white">{t("about.skills")}</h3>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {skillGroups.map((group) => (
            <article
              key={group.title}
              className="rounded-2xl border border-white/10 bg-black/10 p-4"
            >
              <h4 className="font-medium text-white">{group.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                {group.description[language]}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="flex items-center gap-2 font-semibold text-white">
            <Languages size={18} />
            {t("about.languages")}
          </h3>

          <div className="mt-4 space-y-2">
            {profile.languages.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <span>{item.name}</span>
                <span className="text-slate-400">{item.level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold text-white">{t("about.hobbies")}</h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {profile.hobbies.map((hobby) => (
              <span
                key={hobby}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
