import type { Tag } from "../lib/posts.ts";
import type { Tool } from "../lib/directory.ts";
import { fmtDay } from "../lib/time.ts";
import type { PostSummary } from "./Timeline.tsx";

/** Eigene Tools haben eine Detailseite, externe nur Website oder Repo. */
function toolHref(tool: Tool): string | undefined {
  return tool.group === "own" ? `/projekte/${tool.id}` : tool.web ?? tool.repo;
}

/**
 * Sidebar der Artikelseite: weitere Artikel, Tools zum Bereich, alle Tags.
 * Breit rechts neben dem Text, schmal unter dem Artikel (assets/styles.css).
 */
export function PostSidebar(
  { posts, tools, tags }: { posts: PostSummary[]; tools: Tool[]; tags: Tag[] },
) {
  return (
    <aside class="post-side" aria-label="Weiterlesen">
      {posts.length > 0 && (
        <section>
          <h2 class="head">Weitere Artikel</h2>
          <ul class="side-list">
            {posts.map((p) => (
              <li key={p.slug}>
                <a href={`/posts/${p.slug}`}>{p.title}</a>
                <time dateTime={p.day}>{fmtDay(p.day)}</time>
              </li>
            ))}
          </ul>
        </section>
      )}
      {tools.length > 0 && (
        <section>
          <h2 class="head">Tools</h2>
          <ul class="side-list">
            {tools.map((t) => {
              const href = toolHref(t);
              return (
                <li key={t.id}>
                  {href ? <a href={href}>{t.name}</a> : <span>{t.name}</span>}
                  <span class="meta">
                    {t.cat}
                    {t.status === "past" && ` · ${t.since}–${t.until}`}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      <section>
        <h2 class="head">Tags</h2>
        <p class="tags side-tags">
          {tags.map((tag) => (
            <a key={tag.slug} href={`/tags/${tag.slug}`}>
              {tag.name} <span class="n">{tag.posts.length}</span>
            </a>
          ))}
        </p>
      </section>
    </aside>
  );
}
