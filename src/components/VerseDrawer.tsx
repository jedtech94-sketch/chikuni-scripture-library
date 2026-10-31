import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getBook, segmentsToText, type Verse } from "@/data/bible";
import { compareVerse } from "@/data/bibleDatabase";
import { setState, useAppState, verseKey, type HighlightColor } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const HL_CLASS: Record<HighlightColor, string> = {
  gold: "bg-hl-gold",
  rose: "bg-hl-rose",
  sage: "bg-hl-sage",
  sky: "bg-hl-sky",
};

export function VerseDrawer({ book, chapter, verse, onClose }: { book: string; chapter: number; verse: Verse | null; onClose: () => void }) {
  const notes = useAppState((s) => s.notes);
  const key = verse ? verseKey(book, chapter, verse.n) : "";
  const existing = notes[key];
  const [note, setNote] = useState("");
  const [color, setColor] = useState<HighlightColor | undefined>();
  useEffect(() => {
    setNote(existing?.note ?? "");
    setColor(existing?.color);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const b = getBook(book);
  const [compare, setCompare] = useState<Awaited<ReturnType<typeof compareVerse>> | null>(null);
  useEffect(() => {
    setCompare(null);
    if (!verse || !b) return;
    let live = true;
    compareVerse(b, chapter, verse.n).then((r) => live && setCompare(r));
    return () => { live = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const label = verse ? `${b?.name} ${chapter}:${verse.n}` : "";

  const save = () => {
    setState((s) => {
      const next = { ...s.notes };
      if (!note.trim() && !color) delete next[key];
      else next[key] = { key, label, note: note.trim() || undefined, color, updated: Date.now() };
      return { notes: next };
    });
    toast.success("Saved to your notes");
    onClose();
  };

  return (
    <Drawer open={!!verse} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="mx-auto max-h-[85vh] max-w-2xl">
        {verse && (
          <div className="overflow-y-auto px-4 pb-6">
            <DrawerHeader className="px-0 text-left">
              <DrawerTitle className="font-display text-2xl">{label}</DrawerTitle>
              <DrawerDescription className="font-reading text-base leading-relaxed text-foreground/80">{segmentsToText(verse.text)}</DrawerDescription>
            </DrawerHeader>
            <Tabs defaultValue="refs">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="refs">Refs</TabsTrigger>
                <TabsTrigger value="cmp">Compare</TabsTrigger>
                <TabsTrigger value="comm">Notes</TabsTrigger>
                <TabsTrigger value="note">Mine</TabsTrigger>
              </TabsList>
              <TabsContent value="cmp" className="space-y-2 pt-2">
                {compare === null ? <p className="py-6 text-center text-sm text-muted-foreground">Loading translations…</p>
                  : compare.every((c) => !c.text) ? <p className="py-6 text-center text-sm text-muted-foreground">Other translations aren't available for this book yet.</p>
                  : compare.filter((c) => c.text).map((c) => (
                    <div key={c.id} className="rounded-lg border bg-card p-3">
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary">{c.short} <span className="font-normal normal-case text-muted-foreground">· {c.name}</span></div>
                      <p className="font-reading text-sm leading-relaxed">{c.text}</p>
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="refs" className="space-y-2 pt-2">
                {verse.refs?.length ? verse.refs.map((r) => (
                  <Link key={r.label} to="/read/$book/$chapter" params={{ book: r.book, chapter: String(r.chapter) }} hash={`v${r.verse}`} onClick={onClose} className="block rounded-lg border bg-card p-3 transition hover:border-primary">
                    <div className="text-sm font-semibold text-primary">{r.label} <span className="font-normal text-muted-foreground">· {getBook(r.book)?.group === "eth" || getBook(r.book)?.group === "hist" ? "Ethiopian / Historical" : getBook(r.book)?.group === "nt" ? "New Testament" : "Old Testament"}</span></div>
                    <div className="font-reading text-sm text-foreground/80">{r.text}</div>
                  </Link>
                )) : <p className="py-6 text-center text-sm text-muted-foreground">No cross-references for this verse yet.</p>}
              </TabsContent>
              <TabsContent value="comm" className="space-y-3 pt-2">
                {verse.commentary?.length ? verse.commentary.map((c) => (
                  <div key={c.source} className="rounded-lg border bg-card p-3">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{c.source}</div>
                    <p className="font-reading text-sm leading-relaxed">{c.body}</p>
                    {c.lexical && (
                      <div className="mt-3 space-y-1.5">
                        {c.lexical.map((l) => (
                          <div key={l.translit} className="flex flex-wrap items-baseline gap-x-2 rounded bg-muted px-2 py-1.5 text-sm">
                            <span className="font-reading text-lg">{l.word}</span>
                            <span className="italic">{l.translit}</span>
                            <span className="text-xs text-muted-foreground">({l.lang})</span>
                            <span className="text-muted-foreground">— {l.meaning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )) : <p className="py-6 text-center text-sm text-muted-foreground">No commentary for this verse yet.</p>}
              </TabsContent>
              <TabsContent value="note" className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Highlight:</span>
                  {(Object.keys(HL_CLASS) as HighlightColor[]).map((c) => (
                    <button key={c} aria-label={`Highlight ${c}`} onClick={() => setColor(color === c ? undefined : c)} className={cn("h-8 w-8 rounded-full border-2 transition", HL_CLASS[c], color === c ? "scale-110 border-foreground" : "border-transparent")} />
                  ))}
                </div>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write a personal reflection…" rows={4} className="font-reading" />
                <Button onClick={save} className="w-full">Save note & highlight</Button>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
