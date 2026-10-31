<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Scripture, cross-refs, commentary and library content live as typed mock data in `src/data/`; search reads only from there (`src/lib/search.ts`), so new content becomes searchable automatically.
- User state (theme, font size, notes, highlights, bookmarks, audio position) lives in the localStorage store `src/lib/store.ts`; selectors must return existing slices, never new objects (useSyncExternalStore).
- Audio bar is a simulated narration timeline until real recordings exist.
- Book registry and remote Scripture text go through `src/data/bibleDatabase.ts` (public-domain translations via bible-api.com, cached per chapter); local study chapters in `bible.ts` override KJV so red letters and commentary survive.
