import { HttpError, page } from "fresh";
import { define } from "../../utils.ts";
import { formatDate, getPost } from "../../lib/posts.ts";
import { Seo } from "../../components/Seo.tsx";
import { TagChips } from "../../components/TagChips.tsx";
import Mermaid from "../../islands/Mermaid.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const post = getPost(ctx.params.slug);
    if (!post) throw new HttpError(404);
    return page({ post });
  },
});

export default define.page<typeof handler>(function PostPage({ data }) {
  const { post } = data;
  const minDepth = Math.min(...post.toc.map((e) => e.depth));
  return (
    <article>
      <Seo
        title={post.title}
        description={post.description}
        path={`/posts/${post.slug}`}
        type="article"
      />
      <header class="mb-8 space-y-3">
        <time
          dateTime={post.day}
          class="text-sm text-stone-500 dark:text-stone-400"
        >
          {formatDate(post.date)}
        </time>
        <h1 class="text-3xl font-bold tracking-tight">{post.title}</h1>
        <TagChips tags={post.tags} />
      </header>

      {post.showToc && (
        <nav
          aria-label="Inhaltsverzeichnis"
          class="mb-8 rounded-xl border border-stone-200 p-4 text-sm dark:border-stone-800"
        >
          <p class="mb-2 font-semibold">Inhalt</p>
          <ul class="space-y-1">
            {post.toc.map((entry) => (
              <li
                key={entry.id}
                style={{ paddingLeft: `${(entry.depth - minDepth) * 1}rem` }}
              >
                <a
                  href={`#${entry.id}`}
                  class="text-stone-600 hover:text-teal-700 dark:text-stone-400 dark:hover:text-teal-300"
                >
                  {entry.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div
        class="prose prose-stone max-w-none dark:prose-invert prose-a:text-teal-700 dark:prose-a:text-teal-300 prose-pre:bg-stone-100 prose-pre:text-stone-900 dark:prose-pre:bg-stone-900 dark:prose-pre:text-stone-100"
        // HTML stammt aus eigenen Markdown-Dateien in content/posts.
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      {post.hasMermaid && <Mermaid />}

      <footer class="mt-12 border-t border-stone-200 pt-6 dark:border-stone-800">
        <a
          href="/posts"
          class="text-sm text-teal-700 hover:underline dark:text-teal-300"
        >
          ← Alle Posts
        </a>
      </footer>
    </article>
  );
});
