/** IndexedDB chapter cache so previously opened chapters read without internet. */
const DB = "ChikuniStudyBibleDB";
let dbp: Promise<IDBDatabase> | null = null;

function open(): Promise<IDBDatabase> | null {
  if (typeof indexedDB === "undefined") return null;
  dbp ??= new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains("chapters")) db.createObjectStore("chapters", { keyPath: "referenceKey" });
      if (!db.objectStoreNames.contains("patristicNotes")) db.createObjectStore("patristicNotes", { keyPath: "verseKey" });
    };
    r.onsuccess = () => res(r.result);
    r.onerror = () => { dbp = null; rej(r.error); };
  });
  return dbp;
}

export async function getCachedChapter<T>(key: string): Promise<T | null> {
  try {
    const db = await open();
    if (!db) return null;
    return await new Promise((res) => {
      const q = db.transaction("chapters", "readonly").objectStore("chapters").get(key);
      q.onsuccess = () => res(q.result ? (q.result.data as T) : null);
      q.onerror = () => res(null);
    });
  } catch { return null; }
}

export async function saveCachedChapter(key: string, data: unknown) {
  try {
    const db = await open();
    db?.transaction("chapters", "readwrite").objectStore("chapters").put({ referenceKey: key, data, saved: Date.now() });
  } catch { /* ignore */ }
}
