import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Headphones } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { getBook, getChapter, GROUP_LABEL, type Verse } from "@/data/bible";
import { setAudio, setState, useAppState, verseKey, type FontSize } from "@/lib/store";
import { HL_CLASS, VerseDrawer } from "@/components/VerseDrawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/read/$book/$chapter")({
  loader: ({ params }) => {
    const book = getBook(params.book);
    if (!book) throw notFound();
    return { book, chapter: Number(params.chapter) || 1 };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.book.name} ${loaderData.chapter} — Chikuni Study Bible` : "Chikuni Study Bible";
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData ? `Read ${loaderData.book.name} ${loaderData.chapter} with commentary and cross-references.` : "Read Scripture." },
        { property: "og:title", content: t },
        { property: "og:description", content: "Scripture with commentary, cross-references and audio." },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: Reader,
});

const SIZE: Record<FontSize, string> = {
  sm: "text-base leading-7",
  md: "text-lg leading-8",
  lg: "text-xl leading-9",
  xl: "text-2xl leading-10",
};

function Reader() {
  const { book, chapter } = Route.useLoaderData();
  const data = getChapter(book.slug, chapter);
  const fontSize = useAppState((s) => s.fontSize);
  const notes = useAppState((s) => s.notes);
  const bookmarks = useAppState((s) => s.bookmarks);
  const [active, setActive] = useState<Verse | null>(null);
  const bmKey = `${book.slug}:${chapter}`;
  const marked = bookmarks.some((b) => b.key === bmKey);

  useEffect(() => {
    if (data) setAudio({ book: book.slug, chapter, pos: 0, playing: false });
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  }, [book.slug, chapter, data]);

  const toggleBookmark = () =>
    setState((s) => ({
      bookmarks: marked ? s.bookmarks.filter((b) => b.key !== bmKey) : [...s.bookmarks, { key: bmKey, label: `${book.name} ${chapter}`, book: book.slug, chapter }],
    }));

  return (
    <article className="mx-auto max-w-2xl px-5 py-8 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{GROUP_LABEL[book.group]}</p>
          <h1 className="mt-1 text-4xl font-semibold md:text-5xl">{book.name} <span className="text-primary">{chapter}</span></h1>
        </div>
        <div className="flex items-center gap-1">
          <ToggleGroup type="single" value={fontSize} onValueChange={(v) => v && setState(() => ({ fontSize: v as FontSize }))} className="rounded-full border p-0.5" aria-label="Font size">
            {(["sm", "md", "lg", "xl"] as FontSize[]).map((s, i) => (
              <ToggleGroupItem key={s} value={s} aria-label={["Small", "Medium", "Large", "Extra large"][i]} className="h-8 w-8 rounded-full font-reading data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                <span style={{ fontSize: 11 + i * 2.5 }}>A</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Button variant="ghost" size="icon" onClick={toggleBookmark} aria-label="Bookmark chapter">
            {marked ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
          </Button>
        </div>
      </div>

      {!data ? (
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <p className="font-display text-xl">{book.name} {chapter} is being prepared</p>
          <p className="mt-2 text-sm text-muted-foreground">Full text in this preview: Genesis 1, John 1 and 1 Enoch 1.</p>
          <div className="mt-4 flex justify-center gap-2">
            {[["genesis", "Genesis 1"], ["john", "John 1"], ["1-enoch", "1 Enoch 1"]].map(([b, l]) => (
              <Link key={b} to="/read/$book/$chapter" params={{ book: b, chapter: "1" }} className="rounded-full bg-secondary px-3 py-1.5 text-sm hover:bg-muted">{l}</Link>
            ))}
          </div>
        </div>
      ) : (
        <>
          {data.intro && <p className="mb-8 border-l-2 border-accent pl-4 text-sm italic text-muted-foreground">{data.intro}</p>}
          <div className={cn("font-reading transition-all", SIZE[fontSize])}>
            {data.verses.map((v) => {
              const n = notes[verseKey(book.slug, chapter, v.n)];
              return (
                <span key={v.n}>
                  {v.heading && <h2 className="mb-3 mt-8 block font-display text-xl font-semibold first:mt-0">{v.heading}</h2>}
                  <span
                    id={`v${v.n}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActive(v)}
                    onKeyDown={(e) => e.key === "Enter" && setActive(v)}
                    className={cn("cursor-pointer rounded px-0.5 transition-colors hover:bg-muted", n?.color && HL_CLASS[n.color])}
                  >
                    <sup className="mr-1 font-sans text-[0.65em] font-bold text-primary">{v.n}</sup>
                    {v.text.map((seg, i) => typeof seg === "string" ? <span key={i}>{seg}</span> : <span key={i} className="text-red-600 dark:text-red-400">{seg.red}</span>)}
                    {n?.note && <span className="ml-1 align-super text-[0.6em]" title="Has note">✎</span>}
                  </span>{" "}
                </span>
              );
            })}
          </div>
          <p className="mt-8 flex items-center gap-2 text-xs text-muted-foreground"><Headphones className="h-3.5 w-3.5" /> Tap any verse for cross-references, commentary and notes.</p>
        </>
      )}

      <div className="mt-10 flex justify-between">
        {chapter > 1 ? (
          <Link to="/read/$book/$chapter" params={{ book: book.slug, chapter: String(chapter - 1) }} className="flex items-center gap-1 text-sm hover:text-primary"><ChevronLeft className="h-4 w-4" /> Chapter {chapter - 1}</Link>
        ) : <span />}
        {chapter < book.chapters && (
          <Link to="/read/$book/$chapter" params={{ book: book.slug, chapter: String(chapter + 1) }} className="flex items-center gap-1 text-sm hover:text-primary">Chapter {chapter + 1} <ChevronRight className="h-4 w-4" /></Link>
        )}
      </div>

      <VerseDrawer book={book.slug} chapter={chapter} verse={active} onClose={() => setActive(null)} />
    </article>
  );
}
