import { type FeedSource, getFeedSources } from "./directory.ts";

/**
 * Lädt zu jeder Quelle aus content/feeds.json den neuesten Eintrag aus ihrem
 * RSS/Atom-Feed. Das passiert beim Export (und in `deno task dev`), die Seite
 * zeigt also den Stand des letzten Builds – die GitHub Action baut deshalb
 * zusätzlich einmal täglich.
 *
 * Ein Feed, der nicht antwortet, bricht den Build nie ab: die Quelle wird
 * dann ohne neuesten Eintrag angezeigt. `FEEDS=off` schaltet das Laden ab
 * (z. B. offline).
 */
export interface FeedEntry {
  title: string;
  url: string;
  /** ISO-Zeitstempel */
  at: string;
}

export interface Feed extends FeedSource {
  latest: FeedEntry | null;
}

const TIMEOUT_MS = 10_000;
/** Im Dev-Server nicht bei jedem Seitenaufruf neu laden. */
const CACHE_MS = 15 * 60_000;
const USER_AGENT = "niclasedge.github.io-build (+https://niclasedge.github.io)";

let cache: { at: number; feeds: Promise<Feed[]> } | null = null;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decode(text: string): string {
  return text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
      if (code[0] === "#") {
        const n = code[1].toLowerCase() === "x"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : match;
      }
      return ENTITIES[code.toLowerCase()] ?? match;
    });
}

function tag(block: string, name: string): string | undefined {
  const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i")
    .exec(block);
  return m ? decode(m[1]).trim() : undefined;
}

function entryLink(block: string): string | undefined {
  // Atom: <link rel="alternate" href="…"/> (rel fehlt = alternate)
  for (const m of block.matchAll(/<link\b([^>]*)\/?>/gi)) {
    const attrs = m[1];
    const href = /\shref="([^"]+)"/i.exec(attrs)?.[1];
    const rel = /\srel="([^"]+)"/i.exec(attrs)?.[1] ?? "alternate";
    if (href && rel === "alternate") return decode(href);
  }
  // RSS: <link>…</link>
  return tag(block, "link") || undefined;
}

/** Neuester Eintrag eines RSS- oder Atom-Feeds. */
export function parseLatest(xml: string): FeedEntry | null {
  const blocks = [
    ...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi),
    ...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi),
  ].map((m) => m[0]);

  let latest: FeedEntry | null = null;
  for (const block of blocks) {
    const title = tag(block, "title")?.replace(/<[^>]+>/g, "").trim();
    // "published" vor "updated": YouTube aktualisiert "updated" bei jeder
    // Statistikänderung.
    const rawDate = tag(block, "published") ?? tag(block, "pubDate") ??
      tag(block, "updated") ?? tag(block, "dc:date");
    const date = rawDate ? new Date(rawDate) : null;
    const url = entryLink(block);
    if (!title || !url || !date || Number.isNaN(date.getTime())) continue;
    if (!latest || date.toISOString() > latest.at) {
      latest = { title, url, at: date.toISOString() };
    }
  }
  return latest;
}

async function fetchLatest(source: FeedSource): Promise<FeedEntry | null> {
  if (!source.feed) return null;
  try {
    const res = await fetch(source.feed, {
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      await res.body?.cancel();
      console.warn(`Feed ${source.name}: HTTP ${res.status} (${source.feed})`);
      return null;
    }
    const latest = parseLatest(await res.text());
    if (!latest) {
      console.warn(`Feed ${source.name}: kein Eintrag gefunden`);
      return null;
    }
    // Nur http(s)-Links übernehmen (kein javascript: aus fremden Feeds),
    // relative Links gegen die Feed-URL auflösen.
    const url = new URL(latest.url, source.feed);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      console.warn(`Feed ${source.name}: Link ignoriert (${url.protocol})`);
      return { ...latest, url: source.url };
    }
    return { ...latest, url: url.href };
  } catch (error) {
    console.warn(`Feed ${source.name}: ${error} (${source.feed})`);
    return null;
  }
}

async function loadFeeds(): Promise<Feed[]> {
  const sources = getFeedSources();
  const off = Deno.env.get("FEEDS") === "off";
  return await Promise.all(
    sources.map(async (source) => ({
      ...source,
      latest: off ? null : await fetchLatest(source),
    })),
  );
}

/** Alle Quellen mit ihrem neuesten Eintrag (sofern ladbar). */
export function getFeeds(): Promise<Feed[]> {
  if (!cache || Date.now() - cache.at > CACHE_MS) {
    const feeds = loadFeeds();
    // Kaputtes feeds.json nicht 15 Minuten lang cachen.
    feeds.catch(() => cache = null);
    cache = { at: Date.now(), feeds };
  }
  return cache.feeds;
}
