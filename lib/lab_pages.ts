import { extract } from "@std/front-matter/yaml";
import { join } from "@std/path";
import { renderMarkdown } from "./markdown.ts";
import { externalLabs, interactiveLabs, type LabItem } from "./lab.ts";

/**
 * Lab-Seiten aus content/lab/<slug>.html (oder .md). Wie die Posts zur
 * Laufzeit gelesen (nur in `deno task dev` und beim Export).
 *
 * ```html
 * ---
 * title: Design-Tokens
 * short: Farben und Flächen dieser Seite
 * description: Alle Farb-Tokens im aktuellen Farbschema.
 * ---
 * <div class="…">…</div>
 * ```
 *
 * Das HTML wird unverändert in den rechten Bereich der Lab-Seite eingesetzt:
 * nur ein Fragment schreiben (kein <html>/<body>), eigene <style>-Regeln mit
 * einer eigenen Klasse eingrenzen – sie gelten sonst für die ganze Seite.
 */
export const LAB_DIR = "content/lab";

export interface LabPage extends LabItem {
  html: string;
  markdown: boolean;
}

interface FrontMatter {
  title?: string;
  short?: string;
  description?: string;
  order?: number;
}

const FILE_RE = /^([a-z0-9-]+)\.(html|md)$/;

function readLabPage(fileName: string): (LabPage & { order: number }) | null {
  const m = FILE_RE.exec(fileName);
  if (!m) return null;
  const [, slug, ext] = m;
  const source = Deno.readTextFileSync(join(LAB_DIR, fileName));
  const { attrs, body } = extract<FrontMatter>(source);
  for (const key of ["title", "short", "description"] as const) {
    if (!attrs[key]) {
      throw new Error(`${LAB_DIR}/${fileName}: Front Matter "${key}" fehlt`);
    }
  }
  const markdown = ext === "md";
  return {
    slug,
    title: attrs.title!,
    short: attrs.short!,
    description: attrs.description!,
    kind: "page",
    href: `/lab/${slug}`,
    html: markdown ? renderMarkdown(body).html : body,
    markdown,
    order: attrs.order ?? 100,
  };
}

/** Alle Lab-Seiten, nach `order` und Titel sortiert. */
export function getLabPages(): LabPage[] {
  const pages: (LabPage & { order: number })[] = [];
  for (const entry of Deno.readDirSync(LAB_DIR)) {
    if (!entry.isFile) continue;
    const page = readLabPage(entry.name);
    if (page) pages.push(page);
  }
  return pages.sort((a, b) =>
    a.order - b.order || a.title.localeCompare(b.title, "de")
  );
}

export function getLabPage(slug: string): LabPage | undefined {
  return getLabPages().find((p) => p.slug === slug);
}

/** Alle Lab-Einträge für Sidebar, Startseite und Sitemap. */
export function getLabItems(): LabItem[] {
  const pages = getLabPages().map(
    ({ slug, title, short, description, kind, href }) => ({
      slug,
      title,
      short,
      description,
      kind,
      href,
    }),
  );
  const items = [...interactiveLabs, ...pages, ...externalLabs];
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) {
      throw new Error(`Lab-Slug "${item.slug}" ist doppelt vergeben`);
    }
    seen.add(item.slug);
  }
  return items;
}
