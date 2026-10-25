import { CHAPTERS, getBook, segmentsToText, type Testament } from "@/data/bible";
import { MINISTERS } from "@/data/library";

export type SearchFilter = "all" | "ot" | "nt" | "eth" | "commentary" | "media";
export type SearchHit = {
  kind: "verse" | "commentary" | "media";
  group: string;
  title: string;
  snippet: string;
  to: { book?: string; chapter?: number; verse?: number; minister?: string };
};

const matchGroup = (g: Testament, f: SearchFilter) =>
  f === "all" || (f === "ot" && g === "ot") || (f === "nt" && g === "nt") || (f === "eth" && (g === "eth" || g === "hist"));

export function search(q: string, filter: SearchFilter): SearchHit[] {
  const term = q.trim().toLowerCase();
  if (term.length < 2) return [];
  const hits: SearchHit[] = [];
  for (const ch of CHAPTERS) {
    const book = getBook(ch.book)!;
    const groupLabel = `${book.name} ${ch.chapter}`;
    for (const v of ch.verses) {
      const text = segmentsToText(v.text);
      if (matchGroup(book.group, filter) && text.toLowerCase().includes(term)) {
        hits.push({ kind: "verse", group: groupLabel, title: `${book.name} ${ch.chapter}:${v.n}`, snippet: text, to: { book: ch.book, chapter: ch.chapter, verse: v.n } });
      }
      if (filter === "all" || filter === "commentary") {
        for (const c of v.commentary ?? []) {
          const body = [c.body, ...(c.lexical ?? []).map((l) => `${l.translit} — ${l.meaning}`)].join(" · ");
          if (body.toLowerCase().includes(term)) {
            hits.push({ kind: "commentary", group: `Commentary · ${groupLabel}`, title: `${c.source} on ${book.name} ${ch.chapter}:${v.n}`, snippet: body, to: { book: ch.book, chapter: ch.chapter, verse: v.n } });
          }
        }
      }
    }
  }
  if (filter === "all" || filter === "media") {
    for (const m of MINISTERS) {
      const items = [
        ...m.books.map((b) => ({ t: `E-Book: ${b.title}`, s: b.pages.join(" ") })),
        ...m.audio.map((a) => ({ t: `Audio: ${a.title}`, s: a.title })),
        ...m.video.map((v) => ({ t: `Video: ${v.title}`, s: v.title })),
        { t: m.name, s: `${m.tagline}. ${m.bio}` },
      ];
      for (const it of items) {
        if (`${it.t} ${it.s}`.toLowerCase().includes(term)) {
          hits.push({ kind: "media", group: `Library · ${m.name}`, title: it.t, snippet: it.s, to: { minister: m.id } });
        }
      }
    }
  }
  return hits;
}

/** Splits text into parts, flagging case-insensitive matches of `term`. */
export function highlightParts(text: string, term: string): { t: string; hit: boolean }[] {
  const q = term.trim();
  if (!q) return [{ t: text, hit: false }];
  const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.split(new RegExp(`(${esc})`, "gi")).filter(Boolean).map((t) => ({ t, hit: t.toLowerCase() === q.toLowerCase() }));
}
