"use client";

import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";

import { profile } from "@/data/profile";
import { useI18n } from "@/context/LanguageContext";

export function ContactApp() {
  const { t } = useI18n();

  const contactItems = [
    {
      label: t("contact.email"),
      value: profile.contactEmail,
      href: `mailto:${profile.contactEmail}`,
      icon: Mail,
    },
    {
      label: t("contact.github"),
      value: "github.com/4rc4",
      href: profile.githubUrl,
      icon: Github,
    },
    {
      label: t("contact.linkedin"),
      value: "LinkedIn profile",
      href: profile.linkedInUrl,
      icon: Linkedin,
    },
    {
      label: t("contact.cv"),
      value: "Yusuf-Arca-Cicek-CV.pdf",
      href: profile.cvUrl,
      icon: Download,
    },
  ];

  return (
    <div className="space-y-5 text-sm text-slate-200">
      <section className="rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(var(--os-accent-rgb),0.20),transparent_35%),rgba(255,255,255,0.05)] p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
          {t("contact.heading")}
        </p>

        <h2 className="mt-3 text-2xl font-semibold text-white">
          {t("contact.description")}
        </h2>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate-300">
          {t("contact.message")}
        </p>

        <div className="mt-4 flex items-center gap-2 text-slate-300">
          <MapPin size={16} />
          <span>
            {t("contact.location")}: {profile.base}
          </span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {contactItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
              className="group rounded-3xl border border-white/10 bg-white/5 p-4 transition hover:border-[rgba(var(--os-accent-rgb),0.45)] hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(var(--os-accent-rgb),0.14)] text-white">
                  <Icon size={20} />
                </span>

                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 truncate font-medium text-white">
                    {item.value}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </section>
    </div>
  );
}
