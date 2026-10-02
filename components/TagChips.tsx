import { tagSlug } from "../lib/slug.ts";

export function TagChips({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <ul class="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <a
            href={`/tags/${tagSlug(tag)}`}
            class="inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 hover:bg-teal-100 dark:bg-teal-950 dark:text-teal-200 dark:hover:bg-teal-900"
          >
            #{tag}
          </a>
        </li>
      ))}
    </ul>
  );
}
