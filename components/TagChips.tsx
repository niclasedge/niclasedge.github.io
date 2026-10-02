import { tagSlug } from "../lib/slug.ts";

export function TagChips({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <span class="tags">
      {tags.map((tag) => <a key={tag} href={`/tags/${tagSlug(tag)}`}>{tag}</a>)}
    </span>
  );
}
