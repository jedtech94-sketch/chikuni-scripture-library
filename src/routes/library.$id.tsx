import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getMinister, type MediaBook } from "@/data/library";

export const Route = createFileRoute("/library/$id")({
  loader: ({ params }) => {
    const m = getMinister(params.id);
    if (!m) throw notFound();
    return { m };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.m.name} — The Great Library` : "The Great Library";
    return {
      meta: [
        { title: t },
        { name: "description", content: loaderData?.m.bio ?? "Ministers and media." },
        { property: "og:title", content: t },
        { property: "og:description", content: loaderData?.m.tagline ?? "Ministers and media." },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: MinisterPage,
});

function MinisterPage() {
  const { m } = Route.useLoaderData();
  const [reading, setReading] = useState<MediaBook | null>(null);
  const [page, setPage] = useState(0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8">
      <Link to="/library" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ChevronLeft className="h-4 w-4" /> Library</Link>
      <div className="bg-hero mt-4 rounded-3xl border p-6 md:p-8">
        <h1 className="text-4xl font-semibold">{m.name}</h1>
        <p className="text-sm text-muted-foreground">{m.years} · {m.origin}</p>
        <p className="mt-3 font-reading leading-relaxed">{m.bio}</p>
      </div>
      <Tabs defaultValue="books" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="books">E-Books</TabsTrigger>
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="video">Video</TabsTrigger>
        </TabsList>
        <TabsContent value="books" className="space-y-2 pt-3">
          {m.books.map((b) => (
            <button key={b.title} onClick={() => { setReading(b); setPage(0); }} className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition hover:border-primary">
              <FileText className="h-8 w-8 text-primary" />
              <div><div className="font-semibold">{b.title}</div><div className="text-xs text-muted-foreground">{b.year} · {b.pages.length} page preview</div></div>
            </button>
          ))}
        </TabsContent>
        <TabsContent value="audio" className="space-y-3 pt-3">
          {m.audio.map((a) => (
            <div key={a.title} className="rounded-xl border bg-card p-4">
              <div className="mb-2 flex justify-between text-sm"><span className="font-semibold">{a.title}</span><span className="text-muted-foreground">{a.duration}</span></div>
              <audio controls preload="none" src={a.src} className="w-full" />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Sample audio is playing until sermon recordings are added.</p>
        </TabsContent>
        <TabsContent value="video" className="space-y-3 pt-3">
          {m.video.map((v) => (
            <div key={v.title} className="overflow-hidden rounded-xl border bg-card">
              <div className="aspect-video">
                <iframe className="h-full w-full" src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(v.query)}`} title={v.title} allowFullScreen loading="lazy" />
              </div>
              <div className="p-3 text-sm font-semibold">{v.title}</div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <Dialog open={!!reading} onOpenChange={(o) => !o && setReading(null)}>
        <DialogContent className="max-w-lg">
          {reading && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">{reading.title}</DialogTitle>
                <DialogDescription>{m.name} · Page {page + 1} of {reading.pages.length}</DialogDescription>
              </DialogHeader>
              <div className="min-h-56 rounded-lg border bg-background p-6 font-reading text-lg leading-relaxed shadow-inner">{reading.pages[page]}</div>
              <div className="flex justify-between">
                <Button variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button disabled={page === reading.pages.length - 1} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
