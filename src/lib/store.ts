import { useSyncExternalStore } from "react";

export type FontSize = "sm" | "md" | "lg" | "xl";
export type HighlightColor = "gold" | "rose" | "sage" | "sky";
export type VerseNote = { key: string; label: string; color?: HighlightColor | undefined; note?: string | undefined; updated: number };

export type AppState = {
  theme: "light" | "dark";
  fontSize: FontSize;
  translation: "kjv" | "web" | "asv" | "bbe" | "ylt" | "darby";
  notes: Record<string, VerseNote>;
  bookmarks: { key: string; label: string; book: string; chapter: number }[];
  audio: { book: string; chapter: number; playing: boolean; pos: number; speed: number };
};

const DEFAULT: AppState = {
  theme: "light",
  fontSize: "md",
  translation: "kjv",
  notes: {},
  bookmarks: [],
  audio: { book: "genesis", chapter: 1, playing: false, pos: 0, speed: 1 },
};

const KEY = "chikuni-study-bible";
let state: AppState = DEFAULT;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      state = { ...DEFAULT, ...saved, audio: { ...DEFAULT.audio, ...saved.audio, playing: false } };
    }
  } catch {
    /* ignore */
  }
}

export function setState(fn: (s: AppState) => Partial<AppState>) {
  load();
  state = { ...state, ...fn(state) };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function setAudio(patch: Partial<AppState["audio"]>) {
  setState((s) => ({ audio: { ...s.audio, ...patch } }));
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useAppState<T>(sel: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return sel(state);
    },
    () => sel(DEFAULT),
  );
}

export const verseKey = (book: string, chapter: number, verse: number) => `${book}:${chapter}:${verse}`;
