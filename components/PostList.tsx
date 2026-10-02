import { formatDate, type Post } from "../lib/posts.ts";
import { TagChips } from "./TagChips.tsx";

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p class="text-stone-500">Noch keine Beiträge.</p>;
  }
  return (
    <ul class="divide-y divide-stone-200 dark:divide-stone-800">
      {posts.map((post) => (
        <li key={post.slug} class="py-5 first:pt-0">
          <article class="space-y-2">
            <time
              dateTime={post.day}
              class="text-sm text-stone-500 dark:text-stone-400"
            >
              {formatDate(post.date)}
            </time>
            <h3 class="text-lg font-semibold leading-snug">
              <a
                href={`/posts/${post.slug}`}
                class="hover:text-teal-700 dark:hover:text-teal-300"
              >
                {post.title}
              </a>
            </h3>
            {post.description && (
              <p class="text-stone-600 dark:text-stone-400">
                {post.description}
              </p>
            )}
            <TagChips tags={post.tags} />
          </article>
        </li>
      ))}
    </ul>
  );
}
