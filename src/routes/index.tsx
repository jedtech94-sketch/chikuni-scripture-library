import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Library, Bookmark } from "lucide-react";
import { CHAPTERS, getBook, GROUP_LABEL, segmentsToText } from "@/data/bible";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chikuni Study Bible — Scripture, Commentary & Sermons" },
      { name: "description", content: "Study Genesis, John, 1 Enoch and more with red letters, cross-references, Hebrew & Greek notes and audio." },
      { property: "og:title", content: "Chikuni Study Bible" },
      { property: "og:description", content: "Study Scripture with commentary, cross-references, audio and the Great Library of ministers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const john = CHAPTERS[1];
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <section className="bg-hero rounded-3xl border p-7 shadow-soft md:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Verse of the day</p>
        <blockquote className="mt-4 font-reading text-2xl leading-snug md:text-3xl">
          “{segmentsToText(john.verses[0].text)}”
        </blockquote>
        <p className="mt-3 text-sm font-semibold text-primary">John 1:1</p>
        <h1 className="mt-10 text-4xl font-semibold tracking-tight md:text-6xl">Chikuni Study Bible</h1>
        <p className="mt-3 max-w-lg text-muted-foreground">Read the canon, the Ethiopian books and the ancient writings side by side — with commentary, original-language notes and sermons from the great ministers.</p>
      </section>

      <h2 className="mt-12 mb-4 text-2xl font-semibold">Continue reading</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {CHAPTERS.map((c) => {
          const b = getBook(c.book)!;
          return (
            <Link key={c.book} to="/read/$book/$chapter" params={{ book: c.book, chapter: String(c.chapter) }} className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{GROUP_LABEL[b.group]}</div>
              <div className="mt-1 font-display text-2xl font-semibold group-hover:text-primary">{b.name} {c.chapter}</div>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{c.intro}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { to: "/read/$book/$chapter" as const, params: { book: "john", chapter: "1" }, icon: BookOpen, t: "Red-letter reading", d: "Words of Jesus in John 1" },
          { to: "/library" as const, icon: Library, t: "The Great Library", d: "Books, sermons and films" },
          { to: "/bookmarks" as const, icon: Bookmark, t: "Your notes", d: "Highlights & bookmarks" },
        ].map((x) => (
          <Link key={x.t} to={x.to} params={x.params as never} className="flex items-center gap-3 rounded-2xl bg-secondary p-4 transition hover:bg-muted">
            <x.icon className="h-5 w-5 text-primary" />
            <div><div className="font-semibold">{x.t}</div><div className="text-xs text-muted-foreground">{x.d}</div></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
