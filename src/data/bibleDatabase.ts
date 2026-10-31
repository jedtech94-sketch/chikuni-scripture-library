/**
 * Modular Bible database: one registry for every book across all four canons,
 * plus an open-source API adapter (bible-api.com, public-domain translations).
 * Local study chapters in `bible.ts` always win over remote text.
 */
import { ALL_BOOKS, ETHIOPIAN, HISTORICAL, NEW_TESTAMENT, OLD_TESTAMENT, getBook, getChapter, type Book, type Verse } from "@/data/bible";
import { getCachedChapter, saveCachedChapter } from "@/lib/offlineCache";

export const CANON = { ot: OLD_TESTAMENT, nt: NEW_TESTAMENT, eth: ETHIOPIAN, hist: HISTORICAL } as const;
export { ALL_BOOKS, getBook };

export type TranslationId = "kjv" | "web" | "asv" | "bbe" | "ylt" | "darby";
export const TRANSLATIONS: { id: TranslationId; name: string; short: string }[] = [
  { id: "kjv", short: "KJV", name: "King James Version" },
  { id: "web", short: "WEB", name: "World English Bible" },
  { id: "asv", short: "ASV", name: "American Standard Version" },
  { id: "bbe", short: "BBE", name: "Bible in Basic English" },
  { id: "ylt", short: "YLT", name: "Young's Literal Translation" },
  { id: "darby", short: "DBY", name: "Darby Translation" },
];

const API = "https://bible-api.com";
/** Only the Protestant canon is served by the open API today. */
export const hasRemoteText = (book: Book) => book.group === "ot" || book.group === "nt";

const cache = new Map<string, Promise<Verse[] | null>>();

export function fetchChapter(book: Book, chapter: number, tr: TranslationId = "kjv"): Promise<Verse[] | null> {
  if (!hasRemoteText(book)) return Promise.resolve(null);
  const k = `${tr}:${book.slug}:${chapter}`;
  if (!cache.has(k)) {
    cache.set(
      k,
      (async () => {
        const saved = await getCachedChapter<Verse[]>(k);
        if (saved) return saved;
        try {
          const r = await fetch(`${API}/${encodeURIComponent(`${book.name} ${chapter}`)}?translation=${tr}`);
          if (!r.ok) return null;
          const j = (await r.json()) as { verses?: { verse: number; text: string }[] };
          const vs = j.verses?.length ? j.verses.map((v) => ({ n: v.verse, text: [v.text.replace(/\s+/g, " ").trim()] })) : null;
          if (vs) void saveCachedChapter(k, vs);
          return vs;
        } catch {
          cache.delete(k);
          return null;
        }
      })(),
    );
  }
  return cache.get(k)!;
}

/** Local study edition for KJV when present, otherwise the API. */
export async function loadChapter(book: Book, chapter: number, tr: TranslationId) {
  const local = tr === "kjv" ? getChapter(book.slug, chapter) : undefined;
  if (local) return { source: "study" as const, intro: local.intro, verses: local.verses };
  const verses = await fetchChapter(book, chapter, tr);
  return verses ? { source: "api" as const, intro: undefined, verses } : null;
}

/** One verse in every translation, for the comparison drawer. */
export async function compareVerse(book: Book, chapter: number, verse: number) {
  return Promise.all(
    TRANSLATIONS.map(async (t) => {
      const vs = await fetchChapter(book, chapter, t.id);
      const v = vs?.find((x) => x.n === verse);
      return { ...t, text: v ? v.text.map((s) => (typeof s === "string" ? s : s.red)).join("") : null };
    }),
  );
}
