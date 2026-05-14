"use client";

import { ArrowLeft, ArrowRight, ExternalLink, Globe2, Home, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { portfolioProjects } from "@/data/projects";
import { profile } from "@/data/profile";
import { useI18n } from "@/context/LanguageContext";
import type { AppComponentProps } from "@/types/window";

const homeUrl = "https://4rc4.github.io/portfolio/";

const defaultUrls = [
  { label: "Portfolio", url: homeUrl },
  { label: "Catudy", url: "https://4rc4.github.io/Catudy-Site/" },
  { label: "GitHub", url: "https://github.com/4rc4" },
  { label: "LinkedIn", url: profile.linkedInUrl },
];

const blockedHosts = ["google.", "github.com", "linkedin.com", "youtube.com", "x.com", "twitter.com"];

function looksLikeUrl(value: string) {
  return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}/i.test(value.trim());
}

function normalizeUrl(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return homeUrl;
  }

  if (trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

function isBlocked(url: string) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return blockedHosts.some((blockedHost) => host.includes(blockedHost));
  } catch {
    return false;
  }
}

function buildGoogleSearchUrl(query: string) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function BrowserApp({ launchData }: AppComponentProps) {
  const { language } = useI18n();

  const initialUrl = typeof launchData?.url === "string" ? launchData.url : homeUrl;

  const [address, setAddress] = useState(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const currentUrl = history[historyIndex] ?? initialUrl;
  const blocked = searchQuery ? false : isBlocked(currentUrl);

  const quickLinks = useMemo(() => {
    const projectLinks = portfolioProjects
      .filter((project) => project.liveUrl || project.repoUrl)
      .map((project) => ({ label: project.title, url: project.liveUrl ?? project.repoUrl ?? "" }));

    return [...defaultUrls, { label: "CV", url: profile.cvUrl }, ...projectLinks];
  }, []);

  const navigate = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    if (!looksLikeUrl(trimmed)) {
      const searchUrl = buildGoogleSearchUrl(trimmed);
      setSearchQuery(trimmed);
      setAddress(trimmed);
      setHistory((current) => [...current.slice(0, historyIndex + 1), searchUrl]);
      setHistoryIndex((current) => current + 1);
      return;
    }

    const normalizedUrl = normalizeUrl(trimmed);
    setSearchQuery(null);
    setAddress(normalizedUrl);
    setHistory((current) => [...current.slice(0, historyIndex + 1), normalizedUrl]);
    setHistoryIndex((current) => current + 1);
  };

  const goBack = () => {
    setHistoryIndex((current) => Math.max(0, current - 1));
    setSearchQuery(null);
  };

  const goForward = () => {
    setHistoryIndex((current) => Math.min(history.length - 1, current + 1));
    setSearchQuery(null);
  };

  const reload = () => setReloadKey((current) => current + 1);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/40 text-sm text-slate-200">
      <form
        className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.035] p-3"
        onSubmit={(event) => {
          event.preventDefault();
          navigate(address);
        }}
      >
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:opacity-35"
          onClick={goBack}
          disabled={historyIndex === 0}
        >
          <ArrowLeft size={16} />
        </button>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 disabled:opacity-35"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
        >
          <ArrowRight size={16} />
        </button>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
          onClick={() => navigate(homeUrl)}
        >
          <Home size={16} />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
          <Globe2 size={16} className="shrink-0 text-slate-400" />
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-500"
            placeholder="Search Google or enter URL"
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
          onClick={reload}
          title="Reload"
        >
          <RotateCcw size={16} />
        </button>

        <a
          href={searchQuery ? buildGoogleSearchUrl(searchQuery) : currentUrl}
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
        {searchQuery ? (
          <div className="flex h-full items-center justify-center bg-slate-100 p-6 text-slate-900">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-center gap-3">
                <Search size={24} />
                <div>
                  <p className="text-sm text-slate-500">Google search</p>
                  <h2 className="text-2xl font-semibold">{searchQuery}</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                {language === "tr"
                  ? "Google arama sonuçları güvenlik nedeniyle bu pencerenin içine gömülmez. Sonuçları gerçek Google sekmesinde açabilirsin."
                  : "Google results are not embedded inside this window for browser security reasons. You can open the real search in a new tab."}
              </p>
              <a
                href={buildGoogleSearchUrl(searchQuery)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white"
              >
                Open in Google
              </a>
            </div>
          </div>
        ) : blocked ? (
          <div className="flex h-full items-center justify-center bg-slate-100 p-6 text-slate-900">
            <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl">
              <p className="text-sm text-slate-500">Embedded preview blocked</p>
              <h2 className="mt-2 text-2xl font-semibold">This site blocks iframe previews</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {language === "tr"
                  ? "Bazı siteler başka sitelerin içinde açılmayı güvenlik nedeniyle engeller. Bu normaldir."
                  : "Some websites block being opened inside another site for security reasons. This is normal."}
              </p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white"
              >
                Open in new tab
              </a>
            </div>
          </div>
        ) : (
          <iframe
            key={`${currentUrl}-${reloadKey}`}
            title="Portfolio browser"
            src={currentUrl}
            className="h-full w-full bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        )}
      </div>
    </div>
  );
}
