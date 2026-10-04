import { type ComponentChildren, Fragment } from "preact";
import { type AreaKey, AREAS } from "../lib/areas.ts";
import type { Tool } from "../lib/directory.ts";
import type { Post } from "../lib/posts.ts";
import { ago, daysSince, fmtDay, fmtDayShort } from "../lib/time.ts";
import { TimelineDot } from "./Icons.tsx";
import { tagSlug } from "../lib/slug.ts";

/** Was Liste und Startseite von einem Post brauchen (serialisierbar). */
export interface PostSummary {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  day: string;
  description: string;
  tags: string[];
  area: AreaKey;
  image?: string;
}

export function toSummary(post: Post): PostSummary {
  const { slug, title, day, description, tags, area, image } = post;
  return { slug, title, day, description, tags, area, image };
}

/** Zeitstrahl mit Jahresmarken; `items` müssen schon sortiert sein. */
export function Timeline<T>(
  { items, id, year, render, empty }: {
    items: T[];
    id: (item: T) => string;
    year: (item: T) => string;
    render: (item: T) => ComponentChildren;
    empty?: string;
  },
) {
  if (items.length === 0) {
    return (
      <ol class="tl">
        <li class="empty">
          {empty ??
            "Nichts gefunden. Suchbegriff, Bereich oder Zeitraum ändern."}
        </li>
      </ol>
    );
  }
  const out: ComponentChildren[] = [];
  let last: string | null = null;
  for (const item of items) {
    const y = year(item);
    if (y !== last) {
      out.push(
        <li class="year" key={`y-${y}`}>
          <span>{y}</span>
        </li>,
      );
      last = y;
    }
    out.push(<Fragment key={id(item)}>{render(item)}</Fragment>);
  }
  return <ol class="tl">{out}</ol>;
}

/** Ruhiges Platzhalter-Vorschaubild, Farbton nach Bereich, Form nach Slug. */
const AREA_HUE: Record<AreaKey, number> = {
  ai: 262,
  automation: 174,
  infra: 30,
  dev: 214,
  apps: 148,
};

function hash(text: string): number {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export function Thumb({ post }: { post: PostSummary }) {
  const h = AREA_HUE[post.area];
  const i = hash(post.slug) % 97;
  const bg = `hsl(${h} 18% 26%)`;
  const mid = `hsl(${h} 22% 38%)`;
  const hi = `hsl(${h} 45% 66%)`;
  return (
    <svg viewBox="0 0 120 80" aria-hidden="true">
      <rect width="120" height="80" fill={bg} />
      {[0, 1, 2, 3].map((k) => (
        <rect
          key={k}
          x={10 + (k % 2) * 8}
          y={14 + k * 11}
          width={30 + ((i * 37 + k * 23) % 46)}
          height="5"
          rx="2.5"
          fill={k === 0 ? hi : mid}
        />
      ))}
      <circle
        cx={94 + (i * 13) % 12}
        cy={36 + (i * 7) % 14}
        r="15"
        fill="none"
        stroke={hi}
        stroke-width="4"
        opacity=".85"
      />
    </svg>
  );
}

export function PostItem({ post }: { post: PostSummary }) {
  const href = `/posts/${post.slug}`;
  return (
    <li
      class="item post-item"
      style={`--c:${AREAS[post.area].color}`}
    >
      <TimelineDot icon="post" />
      <article class="post">
        <time dateTime={post.day} title={fmtDay(post.day)}>
          {fmtDayShort(post.day)}
        </time>
        <div style="min-width:0">
          <div class="line">
            <h3>
              <a href={href} title={post.title}>{post.title}</a>
            </h3>
            {post.tags.length > 0 && (
              <span class="tags">
                {post.tags.map((t) => (
                  <a key={t} href={`/tags/${tagSlug(t)}`}>{t}</a>
                ))}
              </span>
            )}
          </div>
          <p title={post.description}>{post.description}</p>
        </div>
        <a class="thumb" href={href} tabindex={-1} aria-hidden="true">
          {post.image
            ? <img src={post.image} alt="" loading="lazy" />
            : <Thumb post={post} />}
        </a>
      </article>
    </li>
  );
}

/** Posts als Zeitstrahl nach Jahr (für /posts, /tags/… und die Startseite). */
export function PostTimeline(
  { posts, empty }: { posts: PostSummary[]; empty?: string },
) {
  return (
    <Timeline
      items={posts}
      id={(p) => p.slug}
      year={(p) => p.day.slice(0, 4)}
      render={(p) => <PostItem post={p} />}
      empty={empty}
    />
  );
}

/**
 * Tool als Eintrag auf dem Zeitstrahl, möglichst in zwei Zeilen:
 * Name, Kategorie, Release und Links oben, Beschreibung darunter (einzeilig,
 * voller Text im Tooltip). Vergangene Tools zeigen statt der Beschreibung,
 * was aus ihnen wurde. Jahr und Bereich stecken in Jahresmarke und Punktfarbe.
 */
export function ToolItem(
  { tool, replacement, now, onJump }: {
    tool: Tool;
    replacement?: Tool;
    now: number;
    onJump?: (id: string) => void;
  },
) {
  const past = tool.status === "past";
  const rel = tool.release;
  const fresh = rel && !past && daysSince(rel.date, now) <= 14;
  const links = [
    ...(tool.web
      ? [{
        label: tool.web.startsWith("/") ? "Öffnen" : "Website",
        href: tool.web,
      }]
      : []),
    ...(tool.repo ? [{ label: "Repo", href: tool.repo }] : []),
    ...(tool.links ?? []),
  ];
  return (
    <li
      class={`item tool ${tool.status}`}
      id={`t-${tool.id}`}
      style={`--c:${AREAS[tool.area].color}`}
    >
      <TimelineDot icon={tool.icon} />
      <div class="headrow">
        <span class="name" title={past ? tool.desc : undefined}>
          {tool.group === "own"
            ? <a href={`/projekte/${tool.id}`}>{tool.name}</a>
            : tool.name}
        </span>
        <span class="cat">
          {past ? `${tool.cat} · ${tool.since}–${tool.until}` : tool.cat}
        </span>
        {rel && (
          <span class="rel" title={fmtDay(rel.date)}>
            {fresh && <span class="fresh" aria-hidden="true" />}
            <span class="mono v">{rel.ver}</span>
            {ago(rel.date, now)}
          </span>
        )}
        {links.length > 0 && (
          <span class="links">
            {links.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </span>
        )}
      </div>
      {!past && <p class="desc" title={tool.desc}>{tool.desc}</p>}
      {past && (
        <p class="fate">
          {replacement
            ? (
              <>
                <span class="ic" aria-hidden="true">↻</span>
                <span>
                  Abgelöst durch{" "}
                  <button
                    type="button"
                    onClick={() => onJump?.(replacement.id)}
                  >
                    {replacement.name} ›
                  </button>
                </span>
              </>
            )
            : (
              <>
                <span class="ic" aria-hidden="true">–</span>
                <span title={tool.reason}>Nicht mehr nötig: {tool.reason}</span>
              </>
            )}
        </p>
      )}
    </li>
  );
}
