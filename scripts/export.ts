/**
 * Statischer Export für GitHub Pages.
 *
 * Voraussetzung: `deno task build` (erzeugt _fresh/).
 *
 * 1. Kopiert die Client-Assets und static/ (_fresh/client ohne .vite) nach _site.
 * 2. Lädt den gebauten Server (_fresh/server.js) im selben Prozess und crawlt
 *    ihn per fetch() ab "/", den Alt-URLs und allen gefundenen internen Links.
 * 3. Schreibt HTML-Seiten als <pfad>/index.html, andere Antworten (feed.xml,
 *    sitemap.xml …) unter ihrem Pfad, dazu 404.html mit echtem Status 404.
 * 4. Bricht ab, wenn ein interner Link nicht 200 liefert, eine Alt-URL aus
 *    scripts/legacy-urls.txt im Export fehlt oder eine Datei aus static/
 *    nicht byte-identisch in _site liegt.
 */
import { copy, ensureDir, exists, walk } from "@std/fs";
import { dirname, join, relative, resolve, toFileUrl } from "@std/path";

const CLIENT_DIR = "_fresh/client";
const STATIC_DIR = "static";
const OUT_DIR = "_site";
const LEGACY_FILE = "scripts/legacy-urls.txt";
const ORIGIN = "http://localhost";
/** Hosts, deren Links als intern gelten. */
const INTERNAL_HOSTS = new Set(["localhost", "niclasedge.github.io"]);
/** Eigene Project-Site (Repo niclasedge/tools) – wird nicht gecrawlt. */
const EXTERNAL_PREFIXES = ["/tools/", "/tools"];

interface Server {
  fetch(req: Request): Promise<Response>;
}

const errors: string[] = [];

/** Datei im Export, die GitHub Pages für einen URL-Pfad ausliefert. */
function fileForPath(path: string): string {
  const rel = decodeURIComponent(path).replace(/^\/+/, "");
  if (rel === "" || rel.endsWith("/")) return join(OUT_DIR, rel, "index.html");
  const last = rel.split("/").pop()!;
  return last.includes(".")
    ? join(OUT_DIR, rel)
    : join(OUT_DIR, rel, "index.html");
}

function isExternalSite(path: string): boolean {
  return EXTERNAL_PREFIXES.some((p) =>
    p.endsWith("/") ? path.startsWith(p) : path === p
  );
}

function readLegacyUrls(): string[] {
  return Deno.readTextFileSync(LEGACY_FILE)
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

/** Löst einen Link auf; liefert den Pfad nur für interne Ziele. */
function internalPath(href: string, base: string): string | null {
  const raw = href.replaceAll("&amp;", "&").trim();
  if (
    !raw || raw.startsWith("#") || /^(mailto|tel|javascript|data):/i.test(raw)
  ) {
    return null;
  }
  let url: URL;
  try {
    url = new URL(raw, new URL(base, ORIGIN));
  } catch {
    errors.push(`Ungültiger Link "${href}" auf ${base}`);
    return null;
  }
  if (!/^https?:$/.test(url.protocol) || !INTERNAL_HOSTS.has(url.hostname)) {
    return null;
  }
  return url.pathname;
}

function extractLinks(body: string, contentType: string): string[] {
  const links: string[] = [];
  if (contentType.includes("html")) {
    for (const m of body.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
      links.push(m[1]);
    }
  } else if (contentType.includes("xml")) {
    for (const m of body.matchAll(/<loc>([^<]+)<\/loc>/g)) links.push(m[1]);
    for (const m of body.matchAll(/<link[^>]*\shref="([^"]+)"/g)) {
      links.push(m[1]);
    }
  }
  return links;
}

async function write(file: string, data: Uint8Array) {
  await ensureDir(dirname(file));
  await Deno.writeFile(file, data);
}

async function main() {
  if (!(await exists(join(CLIENT_DIR)))) {
    throw new Error(
      `${CLIENT_DIR} fehlt – zuerst "deno task build" ausführen.`,
    );
  }

  // 1. Client-Build + static/ übernehmen
  await Deno.remove(OUT_DIR, { recursive: true }).catch(() => {});
  await copy(CLIENT_DIR, OUT_DIR);
  await Deno.remove(join(OUT_DIR, ".vite"), { recursive: true }).catch(
    () => {},
  );
  await Deno.writeTextFile(join(OUT_DIR, ".nojekyll"), "");
  if (await exists(join(OUT_DIR, "tools"))) {
    errors.push(
      "_site/tools existiert – /tools/ gehört der Project-Site niclasedge/tools.",
    );
  }

  // 2. Gebauten Server im Prozess laden
  const mod = await import(toFileUrl(resolve("_fresh/server.js")).href);
  const server = mod.default as Server;

  const legacy = readLegacyUrls();
  const queue: { path: string; from: string }[] = [
    { path: "/", from: "(Start)" },
    // 404.html entsteht separat (Schritt 3).
    ...legacy.filter((p) => p !== "/404.html")
      .map((path) => ({ path, from: LEGACY_FILE })),
  ];
  const seen = new Set<string>();
  let pages = 0;
  let files = 0;

  while (queue.length > 0) {
    const { path: rawPath, from } = queue.shift()!;
    if (seen.has(rawPath) || isExternalSite(rawPath)) continue;
    seen.add(rawPath);

    // Datei liegt schon im Export (static/ oder Vite-Asset)?
    if (await exists(fileForPath(rawPath), { isFile: true })) continue;

    // Fresh-Routen haben keinen Slash am Ende.
    const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, "") : rawPath;
    if (path !== rawPath && seen.has(path)) continue;
    seen.add(path);

    const res = await server.fetch(new Request(ORIGIN + path));
    if (res.status !== 200) {
      const location = res.headers.get("location");
      errors.push(
        `${path} → ${res.status}${
          location ? ` (${location})` : ""
        }, verlinkt von ${from}`,
      );
      await res.body?.cancel();
      continue;
    }

    const contentType = res.headers.get("content-type") ?? "";
    const data = new Uint8Array(await res.arrayBuffer());
    const isHtml = contentType.includes("text/html");
    const last = path.split("/").pop() ?? "";
    if (!isHtml && !last.includes(".")) {
      errors.push(`${path} liefert ${contentType} ohne Dateiendung`);
      continue;
    }
    const file = isHtml && !last.includes(".")
      ? join(OUT_DIR, path, "index.html")
      : join(OUT_DIR, path);
    if (await exists(file)) {
      errors.push(`${path} würde die statische Datei ${file} überschreiben`);
      continue;
    }
    await write(file, data);
    isHtml ? pages++ : files++;

    const body = new TextDecoder().decode(data);
    for (const href of extractLinks(body, contentType)) {
      const target = internalPath(href, path);
      if (target && !seen.has(target)) queue.push({ path: target, from: path });
    }
  }

  // 3. 404-Seite mit echtem Status
  const res404 = await server.fetch(new Request(`${ORIGIN}/__export-404__`));
  if (res404.status !== 404) {
    errors.push(`404-Seite liefert Status ${res404.status} statt 404`);
  }
  await write(
    join(OUT_DIR, "404.html"),
    new Uint8Array(await res404.arrayBuffer()),
  );

  // 4. Alle Alt-URLs müssen existieren
  for (const url of legacy) {
    if (!(await exists(fileForPath(url), { isFile: true }))) {
      errors.push(`Alt-URL fehlt im Export: ${url} (${fileForPath(url)})`);
    }
  }

  // 5. static/ muss byte-identisch im Export liegen (App-Store-Seiten!)
  for await (const entry of walk(STATIC_DIR, { includeDirs: false })) {
    const rel = relative(STATIC_DIR, entry.path);
    const out = join(OUT_DIR, rel);
    const [a, b] = await Promise.all([
      Deno.readFile(entry.path),
      Deno.readFile(out).catch(() => null),
    ]);
    if (!b || a.length !== b.length || a.some((byte, i) => byte !== b[i])) {
      errors.push(`static/${rel} liegt nicht byte-identisch in ${OUT_DIR}/`);
    }
  }

  if (errors.length > 0) {
    console.error(`\nExport fehlgeschlagen (${errors.length} Fehler):`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    Deno.exit(1);
  }
  console.log(
    `Export fertig: ${pages} Seiten, ${files} weitere Dateien, ${legacy.length} Alt-URLs geprüft → ${OUT_DIR}/`,
  );
}

await main();
