import type { Book, Verse } from "@/data/bible";

/** Fetches a public-domain KJV chapter (OT/NT only) from bible-api.com. */
export async function fetchKjvChapter(book: Book, chapter: number): Promise<Verse[] | null> {
  if (book.group !== "ot" && book.group !== "nt") return null;
  try {
    const res = await fetch(`https://bible-api.com/${encodeURIComponent(`${book.name} ${chapter}`)}?translation=kjv`);
    if (!res.ok) return null;
    const json = (await res.json()) as { verses?: { verse: number; text: string }[] };
    if (!json.verses?.length) return null;
    return json.verses.map((v) => ({ n: v.verse, text: [v.text.replace(/\s+/g, " ").trim()] }));
  } catch {
    return null;
  }
}
