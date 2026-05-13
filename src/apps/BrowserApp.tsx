"use client";

import { ExternalLink, Globe2, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { portfolioProjects } from "@/data/projects";
import { profile } from "@/data/profile";
import { useI18n } from "@/context/LanguageContext";
import type { AppComponentProps } from "@/types/window";

const defaultUrls = [
  {
    label: "Portfolio",
    url: "https://4rc4.github.io/portfolio/",
  },
  {
    label: "Catudy",
    url: "https://4rc4.github.io/Catudy-Site/",
  },
  {
    label: "GitHub",
    url: "https://github.com/4rc4",
  },
];

function normalizeUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return defaultUrls[0].url;
  }

  if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

export function BrowserApp({ launchData }: AppComponentProps) {
  const { language } = useI18n();

  const initialUrl =
    typeof launchData?.url === "string" ? launchData.url : defaultUrls[0].url;

  const [address, setAddress] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);

  const quickLinks = useMemo(() => {
    const projectLinks = portfolioProjects
      .filter((project) => project.liveUrl || project.repoUrl)
      .map((project) => ({
        label: project.title,
        url: project.liveUrl ?? project.repoUrl ?? "",
      }));

    return [
      ...defaultUrls,
      {
        label: "CV",
        url: profile.cvUrl,
      },
      ...projectLinks,
    ];
  }, []);

  const navigate = (nextUrl: string) => {
    const normalizedUrl = normalizeUrl(nextUrl);

    setAddress(normalizedUrl);
    setCurrentUrl(normalizedUrl);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 text-sm text-slate-200">
      <form
        className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.035] p-3"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(address);
        }}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          <Globe2 size={16} className="shrink-0 text-slate-400" />
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
            placeholder="https://4rc4.github.io/portfolio/"
          />
        </div>

        <button
          type="submit"
          className="rounded-2xl border border-[rgba(var(--os-accent-rgb),0.35)] bg-[rgba(var(--os-accent-rgb),0.12)] px-4 py-2 text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.22)]"
        >
          Go
        </button>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          onClick={() => navigate(currentUrl)}
          title="Reload"
        >
          <RotateCcw size={16} />
        </button>

        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          title="Open in new tab"
        >
          <ExternalLink size={16} />
        </a>
      </form>

      <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-white/10 p-2">
        {quickLinks.map((link) => (
          <button
            key={`${link.label}-${link.url}`}
            type="button"
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
            onClick={() => navigate(link.url)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 bg-white">
        <iframe
          title="Portfolio browser"
          src={currentUrl}
          className="h-full w-full bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      <div className="shrink-0 border-t border-white/10 bg-slate-950/85 px-3 py-2 text-xs text-slate-500">
        {language === "tr"
          ? "Bazı siteler iframe içinde açılmayı engelleyebilir. Sağdaki butonla yeni sekmede açabilirsin."
          : "Some sites may block iframe previews. Use the button on the right to open in a new tab."}
      </div>
    </div>
  );
}
