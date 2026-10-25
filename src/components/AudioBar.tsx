import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Pause, Play, RotateCcw, RotateCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CHAPTERS, getBook, segmentsToText } from "@/data/bible";
import { setAudio, useAppState } from "@/lib/store";

const SPEEDS = [0.75, 1, 1.25, 1.5];
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/** Simulated narration timeline (≈2.6 words/sec) until recorded audio is added. */
export function AudioBar() {
  const audio = useAppState((s) => s.audio);
  const navigate = useNavigate();
  const chapter = CHAPTERS.find((c) => c.book === audio.book && c.chapter === audio.chapter) ?? CHAPTERS[0];
  const duration = useMemo(
    () => Math.round(chapter.verses.reduce((n, v) => n + segmentsToText(v.text).split(" ").length, 0) / 2.6),
    [chapter],
  );

  useEffect(() => {
    if (!audio.playing) return;
    const id = setInterval(() => {
      const next = audio.pos + 0.25 * audio.speed;
      if (next >= duration) setAudio({ pos: duration, playing: false });
      else setAudio({ pos: next });
    }, 250);
    return () => clearInterval(id);
  }, [audio.playing, audio.pos, audio.speed, duration]);

  const seek = (d: number) => setAudio({ pos: Math.max(0, Math.min(duration, audio.pos + d)) });
  const book = getBook(chapter.book)!;
  const pct = duration ? (audio.pos / duration) * 100 : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 shadow-soft backdrop-blur lg:left-72">
      <div className="h-1 w-full cursor-pointer bg-muted" onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setAudio({ pos: ((e.clientX - r.left) / r.width) * duration });
      }}>
        <div className="h-full bg-primary transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <div className="mx-auto flex max-w-4xl items-center gap-2 px-3 py-2">
        <Select
          value={`${chapter.book}|${chapter.chapter}`}
          onValueChange={(v) => {
            const [b, c] = v.split("|");
            setAudio({ book: b, chapter: Number(c), pos: 0 });
            navigate({ to: "/read/$book/$chapter", params: { book: b, chapter: c } });
          }}
        >
          <SelectTrigger className="h-9 w-28 shrink-0 border-none bg-transparent px-2 text-xs sm:w-40 sm:text-sm" aria-label="Chapter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHAPTERS.map((c) => (
              <SelectItem key={`${c.book}|${c.chapter}`} value={`${c.book}|${c.chapter}`}>{getBook(c.book)!.name} {c.chapter}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex flex-1 items-center justify-center gap-1">
          <button aria-label="Rewind 15 seconds" onClick={() => seek(-15)} className="relative rounded-full p-2 hover:bg-muted">
            <RotateCcw className="h-5 w-5" /><span className="absolute inset-0 grid place-items-center text-[8px] font-bold">15</span>
          </button>
          <button aria-label={audio.playing ? "Pause" : "Play"} onClick={() => setAudio({ playing: !audio.playing, pos: audio.pos >= duration ? 0 : audio.pos })} className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105">
            {audio.playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
          </button>
          <button aria-label="Forward 15 seconds" onClick={() => seek(15)} className="relative rounded-full p-2 hover:bg-muted">
            <RotateCw className="h-5 w-5" /><span className="absolute inset-0 grid place-items-center text-[8px] font-bold">15</span>
          </button>
        </div>
        <span className="hidden w-20 text-right text-xs tabular-nums text-muted-foreground sm:block">{fmt(audio.pos)} / {fmt(duration)}</span>
        <button
          aria-label="Playback speed"
          onClick={() => setAudio({ speed: SPEEDS[(SPEEDS.indexOf(audio.speed) + 1) % SPEEDS.length] })}
          className="w-12 shrink-0 rounded-full border px-2 py-1 text-xs font-semibold tabular-nums hover:bg-muted"
        >
          {audio.speed}x
        </button>
      </div>
      <Link to="/read/$book/$chapter" params={{ book: chapter.book, chapter: String(chapter.chapter) }} className="sr-only">Open {book.name}</Link>
    </div>
  );
}
