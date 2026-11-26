# Chikuni Scripture Library

Build a modern, full-stack, mobile-responsive web app named "Chikuni Study Bible". 



Use a clean, premium aesthetic with dark and light mode toggle, warm typography designed for comfortable reading, and smooth transitions. Use Tailwind CSS and Shadcn UI components.



---



### 1. LAYOUT & NAVIGATION

- Sidebar / Drawer Navigation:

  * 📜 Old Testament (39 books)

  * ✝️ New Testament (27 books)

  * 🇪🇹 Ethiopian Orthodox Canon (1 Enoch, Jubilees, 1-3 Meqabyan, 4 Baruch, etc.)

  * 🏛️ Historical & Lost Books (Book of Jasher, Didache, Gospel of Nicodemus, Maccabees, etc.)

  * 📚 The Great Library (Ministers & Media)

  * 🔖 Bookmarks & Personal Notes



---



### 2. CORE READING & STUDY INTERFACE

- Reader View: Clean chapter page with selectable font size (Small, Medium, Large, Extra Large).

- Verse Formatting:

  * Section Headers / Subtitles above major passages.

  * Words of Jesus rendered in red text (`.text-red-600` / dark mode `.text-red-400`).

  * Verse numbers styled cleanly with inline spacing.

- Interactive Verse Drawer (Bottom Sheet / Modal on tap of any verse):

  * Tab 1: Cross-References (links connecting related Old/New Testament & Historical passages).

  * Tab 2: Commentaries & Greek/Hebrew Exegesis notes.

  * Tab 3: Personal Note & Highlight (save with custom colors).

- Persistent Audio Player Bar (Sticky at bottom):

  * Controls: Play/Pause, 15s Rewind/Fast Forward, Playback Speed (0.75x, 1x, 1.25x, 1.5x), Chapter Selector.



---



### 3. ADVANCED SEARCH ENGINE

- Search Bar in Top Header:

  * Instant search query input with clear button and voice-search placeholder icon.

  * Filter Chips: [All], [Old Testament], [New Testament], [Ethiopian & Historical], [Commentaries], [Media].

  * Search Results Display: Grouped by Book and Chapter, displaying snippet text with searched keywords highlighted in yellow (`<mark>`).



---



### 4. THE GREAT LIBRARY (MINISTERS & MEDIA)

- Grid layout showcasing Great Men of God (e.g., Benson Idahosa, Benny Hinn, TL Osborn, Oral Roberts).

- Author Profile Cards featuring tabs for:

  * E-Books & Articles (PDF reader preview modal).

  * Audio Sermons (Audio player Integration).

  * Video Sermons & Documentaries (Embedded responsive video player).



---



### 5. DATA STRUCTURE & MOCK DATA

Include mock structured data for Genesis 1, John 1, and 1 Enoch 1 so all features (Red Letters, Cross-References, Commentaries, Search, and Audio bar) can be fully tested in the preview.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://chikuni-scripture-library.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2184b5ce-2819-472b-8cff-675550c22886).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
