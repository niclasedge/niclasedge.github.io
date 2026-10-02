import { extract } from "@std/front-matter/yaml";
import { join } from "@std/path";
import { renderMarkdown, type TocEntry } from "./markdown.ts";
import { jekyllSlug, tagSlug } from "./slug.ts";

/**
 * Posts liegen als Markdown unter content/posts/YYYY-MM-DD-<slug>.md
 * (gleiches Schema wie Jekylls _posts). Sie werden zur Laufzeit gelesen –
 * der Server läuft nur in `deno task dev` und beim Export, nie in Produktion.
 * (import.meta.glob mit ?raw funktioniert im SSR-Build nicht.)
 */
export const POSTS_DIR = "content/posts";

export interface Post {
  slug: string;
  title: string;
  date: Date;
  /** YYYY-MM-DD */
  day: string;
  tags: string[];
  description: string;
  html: string;
  toc: TocEntry[];
  showToc: boolean;
  hasMermaid: boolean;
}

export interface Tag {
  name: string;
  slug: string;
  posts: Post[];
}

interface FrontMatter {
  title?: string;
  date?: string | Date;
  slug?: string;
  tags?: string[] | string;
  categories?: string[] | string;
  description?: string;
  toc?: boolean;
  mermaid?: boolean;
  published?: boolean;
  draft?: boolean;
}

const FILE_RE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|markdown)$/;

function toList(value: string[] | string | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value.map(String) : String(value).split(/\s+/);
}

function excerpt(html: string, max = 180): string {
  const text = html
    .replace(/<pre[\s\S]*?<\/pre>/g, " ")
    .replace(/<h[1-6][\s\S]*?<\/h[1-6]>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()} …` : text;
}

function readPost(fileName: string): Post | null {
  const m = FILE_RE.exec(fileName);
  if (!m) return null;
  const [, y, mo, d, rawSlug] = m;
  const source = Deno.readTextFileSync(join(POSTS_DIR, fileName));
  const { attrs, body } = extract<FrontMatter>(source);
  if (attrs.published === false || attrs.draft === true) return null;

  const date = attrs.date ? new Date(attrs.date) : new Date(`${y}-${mo}-${d}`);
  const rendered = renderMarkdown(body);
  const tags = [
    ...new Set(
      [...toList(attrs.tags), ...toList(attrs.categories)].map((t) =>
        t.toLowerCase()
      ),
    ),
  ];

  return {
    slug: jekyllSlug(attrs.slug ?? rawSlug),
    title: attrs.title ?? rawSlug,
    date,
    day: `${y}-${mo}-${d}`,
    tags,
    description: attrs.description ?? excerpt(rendered.html),
    html: rendered.html,
    toc: rendered.toc.filter((e) => e.depth <= 3),
    showToc: attrs.toc !== false && rendered.toc.length > 2,
    hasMermaid: attrs.mermaid === true || rendered.hasMermaid,
  };
}

/** Alle veröffentlichten Posts, neueste zuerst. */
export function getPosts(): Post[] {
  const posts: Post[] = [];
  for (const entry of Deno.readDirSync(POSTS_DIR)) {
    if (!entry.isFile) continue;
    const post = readPost(entry.name);
    if (post) posts.push(post);
  }
  return posts.sort((a, b) =>
    b.date.getTime() - a.date.getTime() || a.slug.localeCompare(b.slug)
  );
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

/** Alle Tags (inkl. ehemaliger Jekyll-Kategorien), alphabetisch. */
export function getTags(posts: Post[] = getPosts()): Tag[] {
  const map = new Map<string, Tag>();
  for (const post of posts) {
    for (const name of post.tags) {
      const slug = tagSlug(name);
      const tag = map.get(slug) ?? { name, slug, posts: [] };
      tag.posts.push(post);
      map.set(slug, tag);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "de"));
}

export function getTag(slug: string): Tag | undefined {
  return getTags().find((t) => t.slug === slug);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
}
