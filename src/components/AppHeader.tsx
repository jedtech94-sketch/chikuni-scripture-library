import { useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Mic, Moon, Search, Sun, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AppNav } from "./AppNav";
import { setState, useAppState } from "@/lib/store";
import { toast } from "sonner";

export function AppHeader() {
  const [open, setOpen] = useState(false);
  const theme = useAppState((s) => s.theme);
  const navigate = useNavigate();
  const loc = useRouterState({ select: (s) => s.location });
  const urlQ = loc.pathname === "/search" ? ((loc.search as { q?: string }).q ?? "") : "";
  const [q, setQ] = useState(urlQ);

  const submit = (value: string) => {
    setQ(value);
    navigate({ to: "/search", search: (prev: { f?: string }) => ({ q: value, f: prev.f ?? "all" }) as never, replace: loc.pathname === "/search" });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 border-b bg-background/85 px-3 py-2.5 backdrop-blur md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => submit(e.target.value)}
          placeholder="Search scripture, commentary, sermons…"
          aria-label="Search"
          className="h-10 w-full rounded-full border bg-card pl-9 pr-20 text-sm outline-none transition focus:ring-2 focus:ring-ring/40"
        />
        <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center">
          {q && (
            <button aria-label="Clear search" onClick={() => submit("")} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
          )}
          <button aria-label="Voice search" onClick={() => toast("Voice search is coming soon")} className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"><Mic className="h-4 w-4" /></button>
        </div>
      </div>
      <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setState((s) => ({ theme: s.theme === "dark" ? "light" : "dark" }))}>
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </header>
  );
}
