import { Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ETHIOPIAN, HISTORICAL, NEW_TESTAMENT, OLD_TESTAMENT, getChapter, type Book } from "@/data/bible";

const SECTIONS: { id: string; icon: string; label: string; books: Book[] }[] = [
  { id: "ot", icon: "📜", label: "Old Testament", books: OLD_TESTAMENT },
  { id: "nt", icon: "✝️", label: "New Testament", books: NEW_TESTAMENT },
  { id: "eth", icon: "🇪🇹", label: "Ethiopian Orthodox Canon", books: ETHIOPIAN },
  { id: "hist", icon: "🏛️", label: "Historical & Lost Books", books: HISTORICAL },
];

export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex h-full flex-col gap-1 overflow-y-auto p-3 text-sm">
      <Link to="/" onClick={onNavigate} className="mb-2 px-2 py-3">
        <div className="font-display text-xl font-semibold leading-tight text-primary">Chikuni</div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Study Bible</div>
      </Link>
      <Accordion type="multiple" defaultValue={["ot"]}>
        {SECTIONS.map((s) => (
          <AccordionItem key={s.id} value={s.id} className="border-none">
            <AccordionTrigger className="rounded-md px-2 py-2.5 hover:bg-sidebar-accent hover:no-underline">
              <span className="flex items-center gap-2"><span>{s.icon}</span>{s.label}<span className="text-xs text-muted-foreground">({s.books.length})</span></span>
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <div className="grid grid-cols-2 gap-0.5 pl-2">
                {s.books.map((b) => (
                  <Link
                    key={b.slug}
                    to="/read/$book/$chapter"
                    params={{ book: b.slug, chapter: "1" }}
                    onClick={onNavigate}
                    className="truncate rounded px-2 py-1.5 text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                    activeProps={{ className: "bg-sidebar-accent text-foreground font-medium" }}
                  >
                    {b.name}
                    {getChapter(b.slug, 1) && <span className="ml-1 text-primary">•</span>}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Link to="/library" onClick={onNavigate} className="rounded-md px-2 py-2.5 hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent font-medium" }}>
        📚 The Great Library
      </Link>
      <Link to="/bookmarks" onClick={onNavigate} className="rounded-md px-2 py-2.5 hover:bg-sidebar-accent" activeProps={{ className: "bg-sidebar-accent font-medium" }}>
        🔖 Bookmarks & Notes
      </Link>
      <p className="mt-auto px-2 pt-6 text-xs text-muted-foreground"><span className="text-primary">•</span> Study edition with commentary · all Old & New Testament books in KJV</p>
    </nav>
  );
}
