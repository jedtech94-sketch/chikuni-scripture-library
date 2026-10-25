import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { highlightParts, search, type SearchFilter, type SearchHit } from "@/lib/search";
import { cn } from "@/lib/utils";

const FILTERS: { id: SearchFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ot", label: "Old Testament" },
  { id: "nt", label: "New Testament" },
  { id: "eth", label: "Ethiopian & Historical" },
  { id: "commentary", label: "Commentaries" },
  { id: "media", label: "Media" },
];

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({
    q: typeof s["q"] === "string" ? s["q"] : "",
    f: (FILTERS.some((x) => x.id === s["f"]) ? s["f"] : "all") as SearchFilter,
  }),
  head: () => ({
    meta: [
      { title: "Search — Chikuni Study Bible" },
      { name: "description", content: "Search Scripture, commentaries and sermons across the Chikuni Study Bible." },
      { property: "og:title", content: "Search — Chikuni Study Bible" },
      { property: "og:description", content: "Instant search across Scripture, commentary and media." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

function Hl({ text, q }: { text: string; q: string }) {
  return <>{highlightParts(text, q).map((p, i) => (p.hit ? <mark key={i}>{p.t}</mark> : <span key={i}>{p.t}</span>))}</>;
}

function SearchPage() {
  const { q, f } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const hits = search(q, f);
  const groups = hits.reduce<Record<string, SearchHit[]>>((acc, h) => ((acc[h.group] ??= []).push(h), acc), {});

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
        {FILTERS.map((x) => (
          <button key={x.id} onClick={() => navigate({ search: { q, f: x.id }, replace: true })} className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition", f === x.id ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}>
            {x.label}
          </button>
        ))}
      </div>
      {q.trim().length < 2 ? (
        <p className="py-16 text-center text-muted-foreground">Type at least two letters above. Try “light”, “Lamb”, “Logos” or “Holy Spirit”.</p>
      ) : hits.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No results for “{q}”.</p>
      ) : (
        <div className="mt-4 space-y-8">
          <p className="text-sm text-muted-foreground">{hits.length} result{hits.length > 1 && "s"}</p>
          {Object.entries(groups).map(([g, items]) => (
            <section key={g}>
              <h2 className="mb-2 text-lg font-semibold">{g}</h2>
              <div className="space-y-2">
                {items.map((h, i) => {
                  const body = (
                    <>
                      <div className="text-sm font-semibold text-primary">{h.title}</div>
                      <p className="line-clamp-3 font-reading text-sm leading-relaxed"><Hl text={h.snippet} q={q} /></p>
                    </>
                  );
                  const cls = "block rounded-xl border bg-card p-3.5 transition hover:border-primary";
                  return h.to.minister ? (
                    <Link key={i} to="/library/$id" params={{ id: h.to.minister }} className={cls}>{body}</Link>
                  ) : (
                    <Link key={i} to="/read/$book/$chapter" params={{ book: h.to.book!, chapter: String(h.to.chapter) }} hash={`v${h.to.verse}`} className={cls}>{body}</Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
