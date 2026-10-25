import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { setState, useAppState } from "@/lib/store";
import { HL_CLASS } from "@/components/VerseDrawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bookmarks")({
  head: () => ({
    meta: [
      { title: "Bookmarks & Notes — Chikuni Study Bible" },
      { name: "description", content: "Your saved chapters, highlights and personal reflections." },
      { property: "og:title", content: "Bookmarks & Notes — Chikuni Study Bible" },
      { property: "og:description", content: "Saved chapters, highlights and notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookmarksPage,
});

function BookmarksPage() {
  const bookmarks = useAppState((s) => s.bookmarks);
  const notesMap = useAppState((s) => s.notes);
  const notes = Object.values(notesMap).sort((a, b) => b.updated - a.updated);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
      <h1 className="text-4xl font-semibold">🔖 Bookmarks & Notes</h1>
      <h2 className="mt-8 mb-3 text-xl font-semibold">Chapters</h2>
      {bookmarks.length === 0 ? <p className="text-sm text-muted-foreground">Tap the bookmark icon on any chapter to save it here.</p> : (
        <div className="flex flex-wrap gap-2">
          {bookmarks.map((b) => (
            <Link key={b.key} to="/read/$book/$chapter" params={{ book: b.book, chapter: String(b.chapter) }} className="rounded-full border bg-card px-4 py-2 text-sm hover:border-primary">{b.label}</Link>
          ))}
        </div>
      )}
      <h2 className="mt-10 mb-3 text-xl font-semibold">Highlights & notes</h2>
      {notes.length === 0 ? <p className="text-sm text-muted-foreground">Tap a verse while reading and open “My Note” to add one.</p> : (
        <div className="space-y-2">
          {notes.map((n) => {
            const [book = "", ch = "1", v = "1"] = n.key.split(":");
            return (
              <div key={n.key} className={cn("flex items-start gap-3 rounded-xl border bg-card p-4", n.color && HL_CLASS[n.color])}>
                <Link to="/read/$book/$chapter" params={{ book, chapter: ch }} hash={`v${v}`} className="flex-1">
                  <div className="text-sm font-semibold text-primary">{n.label}</div>
                  {n.note && <p className="mt-1 font-reading">{n.note}</p>}
                </Link>
                <button aria-label="Delete note" onClick={() => setState((s) => { const x = { ...s.notes }; delete x[n.key]; return { notes: x }; })} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
