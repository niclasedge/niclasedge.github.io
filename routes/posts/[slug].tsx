import { HttpError, page } from "fresh";
import { define } from "../../utils.ts";
import {
  formatDate,
  getPosts,
  getTags,
  relatedPosts,
  relatedTools,
} from "../../lib/posts.ts";
import { getTools } from "../../lib/directory.ts";
import { AREAS } from "../../lib/areas.ts";
import { Seo } from "../../components/Seo.tsx";
import { TagChips } from "../../components/TagChips.tsx";
import { AreaIcon } from "../../components/Icons.tsx";
import { PostSidebar } from "../../components/PostSidebar.tsx";
import { toSummary } from "../../components/Timeline.tsx";
import Mermaid from "../../islands/Mermaid.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const posts = getPosts();
    const post = posts.find((p) => p.slug === ctx.params.slug);
    if (!post) throw new HttpError(404);
    return page({
      post,
      related: relatedPosts(post, posts).map(toSummary),
      tools: relatedTools(post.area, getTools()),
      tags: getTags(posts),
    });
  },
});

/**
 * Artikelseite. Breit (ab 80rem): Inhaltsverzeichnis links und mitlaufend,
 * Sidebar rechts. Schmal: Inhaltsverzeichnis über, Sidebar unter dem Text.
 * Das Raster steht in assets/styles.css (.post-layout).
 */
export default define.page<typeof handler>(function PostPage({ data }) {
  const { post, related, tools, tags } = data;
  const minDepth = Math.min(...post.toc.map((e) => e.depth));
  return (
    <div class="wrap page">
      <article class="post-layout">
        <Seo
          title={post.title}
          description={post.description}
          path={`/posts/${post.slug}`}
          type="article"
          image={post.image}
        />
        <header class="page-title">
          <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <span
              class="inline-flex items-center gap-1.5 font-semibold"
              style={`color:${AREAS[post.area].color}`}
            >
              <AreaIcon area={post.area} />
              {AREAS[post.area].label}
            </span>
            <time dateTime={post.day}>{formatDate(post.date)}</time>
            <TagChips tags={post.tags} />
          </p>
          <h1 class="mt-2">{post.title}</h1>
          {post.image && (
            <img
              class="post-hero"
              src={post.image}
              alt=""
              width={1200}
              height={630}
            />
          )}
        </header>

        {post.showToc && (
          <nav aria-label="Inhaltsverzeichnis" class="post-toc text-sm">
            <p class="mb-2 font-semibold">Inhalt</p>
            <ul class="space-y-1">
              {post.toc.map((entry) => (
                <li
                  key={entry.id}
                  style={{ paddingLeft: `${(entry.depth - minDepth) * 1}rem` }}
                >
                  <a href={`#${entry.id}`} class="text-muted hover:text-fg">
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div class="post-body">
          <div
            class="prose max-w-none"
            // HTML stammt aus eigenen Markdown-Dateien in content/posts.
            // deno-lint-ignore react-no-danger
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          {post.hasMermaid && <Mermaid />}

          <footer class="mt-12 border-t border-line pt-6 text-sm">
            <a href="/posts">← Alle Posts</a>
          </footer>
        </div>

        <PostSidebar posts={related} tools={tools} tags={tags} />
      </article>
    </div>
  );
});
