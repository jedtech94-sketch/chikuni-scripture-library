import { createFileRoute, Link } from "@tanstack/react-router";
import { MINISTERS } from "@/data/library";

export const Route = createFileRoute("/library/")({
  head: () => ({
    meta: [
      { title: "The Great Library — Chikuni Study Bible" },
      { name: "description", content: "Books, audio sermons and films from Benson Idahosa, Benny Hinn, T.L. Osborn and Oral Roberts." },
      { property: "og:title", content: "The Great Library — Ministers & Media" },
      { property: "og:description", content: "E-books, audio sermons and video from great men of God." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">📚 Ministers & Media</p>
      <h1 className="mt-1 text-4xl font-semibold md:text-5xl">The Great Library</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {MINISTERS.map((m) => (
          <Link key={m.id} to="/library/$id" params={{ id: m.id }} className="group flex gap-4 rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-hero font-display text-2xl font-semibold text-primary ring-1 ring-border">
              {m.name.split(" ").map((w) => w[0]).join("").replace(".", "")}
            </div>
            <div className="min-w-0">
              <div className="font-display text-xl font-semibold group-hover:text-primary">{m.name}</div>
              <div className="text-xs text-muted-foreground">{m.years} · {m.origin}</div>
              <p className="mt-1 text-sm">{m.tagline}</p>
              <p className="mt-2 text-xs text-muted-foreground">{m.books.length} books · {m.audio.length} audio · {m.video.length} video</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
