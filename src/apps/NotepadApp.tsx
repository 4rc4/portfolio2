"use client";

import { FileText, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { profile, education, experience, skillGroups } from "@/data/profile";
import { portfolioProjects } from "@/data/projects";
import { useI18n } from "@/context/LanguageContext";
import { useNotifications } from "@/context/NotificationContext";
import { useRecycleBin } from "@/context/RecycleBinContext";
import type { AppComponentProps } from "@/types/window";

type Note = {
  id: string;
  title: string;
  content: string;
  modifiedAt: string;
};

const storageKey = "portfolio-os-notes";

function readNotes(): Note[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function buildReadme(language: "tr" | "en") {
  const projectLines = portfolioProjects
    .map((project) => `- ${project.title}: ${project.description[language]}`)
    .join("\n");

  const skillLines = skillGroups
    .map((group) => `- ${group.title}: ${group.items.join(", ")}`)
    .join("\n");

  const educationLines = education
    .map((item) => `- ${item.date} — ${item.title}${item.place ? ` / ${item.place}` : ""}`)
    .join("\n");

  const experienceLines = experience
    .map((item) => `- ${item.date} — ${item.title}${item.place ? ` / ${item.place}` : ""}`)
    .join("\n");

  if (language === "tr") {
    return `README.txt\n\n${profile.name}\n${profile.role.tr}\n\nKısa Tanıtım\n${profile.summary.tr}\n\nOdak\n${profile.focus.tr}\n\nProjeler\n${projectLines}\n\nSkills\n${skillLines}\n\nEğitim\n${educationLines}\n\nİş Deneyimi\n${experienceLines}\n\nİletişim\nEmail: ${profile.contactEmail}\nGitHub: ${profile.githubUrl}\nLinkedIn: ${profile.linkedInUrl}\n`;
  }

  return `README.txt\n\n${profile.name}\n${profile.role.en}\n\nShort Introduction\n${profile.summary.en}\n\nFocus\n${profile.focus.en}\n\nProjects\n${projectLines}\n\nSkills\n${skillLines}\n\nEducation\n${educationLines}\n\nExperience\n${experienceLines}\n\nContact\nEmail: ${profile.contactEmail}\nGitHub: ${profile.githubUrl}\nLinkedIn: ${profile.linkedInUrl}\n`;
}

export function NotepadApp({ launchData }: AppComponentProps) {
  const { language } = useI18n();
  const { notify } = useNotifications();
  const { addItem } = useRecycleBin();

  const launchContent = typeof launchData?.content === "string" ? launchData.content : null;
  const launchFileName = typeof launchData?.fileName === "string" ? launchData.fileName : null;

  const defaultReadme = useMemo(() => buildReadme(language), [language]);

  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [fileName, setFileName] = useState(launchFileName ?? "README.txt");
  const [content, setContent] = useState(launchContent ?? defaultReadme);

  useEffect(() => {
    const storedNotes = readNotes();
    setNotes(storedNotes);

    if (!launchContent && storedNotes[0]) {
      setActiveNoteId(storedNotes[0].id);
      setFileName(storedNotes[0].title);
      setContent(storedNotes[0].content);
    }
  }, [launchContent]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes]);

  const newNote = () => {
    setActiveNoteId(null);
    setFileName("untitled.txt");
    setContent("");
  };

  const save = () => {
    const note: Note = {
      id: activeNoteId ?? `note-${Date.now()}`,
      title: fileName.trim() || "untitled.txt",
      content,
      modifiedAt: new Date().toISOString(),
    };

    setNotes((currentNotes) => {
      const exists = currentNotes.some((item) => item.id === note.id);
      return exists
        ? currentNotes.map((item) => (item.id === note.id ? note : item))
        : [note, ...currentNotes];
    });

    setActiveNoteId(note.id);
    setFileName(note.title);
    notify({ title: "Notepad saved", message: note.title, tone: "success" });
  };

  const deleteCurrent = () => {
    const title = fileName.trim() || "untitled.txt";

    addItem({
      name: title,
      kind: "note",
      description: content.slice(0, 180),
      payload: { title, content },
    });

    if (activeNoteId) {
      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== activeNoteId));
    }

    newNote();
    notify({ title: "Moved to Recycle Bin", message: title, tone: "success" });
  };

  const loadReadme = () => {
    setActiveNoteId(null);
    setFileName("README.txt");
    setContent(defaultReadme);
  };

  const loadProjectNotes = () => {
    setActiveNoteId(null);
    setFileName("project-notes.txt");
    setContent(
      portfolioProjects
        .map((project) => {
          const built = project.whatBuilt.map((item) => `  - ${item[language]}`).join("\n");
          const learned = project.whatLearned.map((item) => `  - ${item[language]}`).join("\n");

          return `${project.title}\n\n${project.description[language]}\n\nWhat I built:\n${built}\n\nWhat I learned:\n${learned}`;
        })
        .join("\n\n---\n\n")
    );
  };

  const openNote = (note: Note) => {
    setActiveNoteId(note.id);
    setFileName(note.title);
    setContent(note.content);
  };

  return (
    <div className="grid h-full min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45 text-sm text-slate-200 md:grid-cols-[220px_1fr]">
      <aside className="min-h-0 overflow-auto border-b border-white/10 bg-black/15 p-3 md:border-b-0 md:border-r">
        <button
          type="button"
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.35)] bg-[rgba(var(--os-accent-rgb),0.12)] px-3 py-2 text-xs text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.22)]"
          onClick={newNote}
        >
          <Plus size={15} />
          New note
        </button>

        <div className="space-y-2">
          {notes.map((note) => (
            <button
              key={note.id}
              type="button"
              className={`w-full rounded-2xl border p-3 text-left transition ${
                activeNoteId === note.id
                  ? "border-[rgba(var(--os-accent-rgb),0.45)] bg-[rgba(var(--os-accent-rgb),0.14)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              onClick={() => openNote(note)}
            >
              <p className="truncate font-medium text-white">{note.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-500">{note.content}</p>
            </button>
          ))}

          {notes.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/10 p-4 text-center text-xs text-slate-500">
              No saved notes yet.
            </p>
          )}
        </div>
      </aside>

      <div className="flex min-h-0 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.035] p-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <FileText size={17} className="text-slate-400" />
            <input
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              className="min-w-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-white outline-none"
            />
          </div>

          <button type="button" className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10" onClick={loadReadme}>
            README
          </button>

          <button type="button" className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10" onClick={loadProjectNotes}>
            Project Notes
          </button>

          <button type="button" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-red-100 transition hover:bg-red-500/20" onClick={deleteCurrent}>
            <Trash2 size={15} />
            Delete
          </button>

          <button type="button" className="flex items-center gap-2 rounded-2xl border border-[rgba(var(--os-accent-rgb),0.35)] bg-[rgba(var(--os-accent-rgb),0.12)] px-3 py-2 text-xs text-white transition hover:bg-[rgba(var(--os-accent-rgb),0.22)]" onClick={save}>
            <Save size={15} />
            Save
          </button>
        </div>

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-0 flex-1 resize-none bg-black/35 p-4 font-mono text-sm leading-relaxed text-slate-100 outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
