import { page } from "fresh";
import { define } from "../../utils.ts";
import { getTags } from "../../lib/posts.ts";
import { Seo } from "../../components/Seo.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";

export const handler = define.handlers({
  GET() {
    return page({ tags: getTags() });
  },
});

export default define.page<typeof handler>(function Tags({ data }) {
  return (
    <>
      <Seo title="Tags" description="Alle Themen im Überblick." path="/tags" />
      <PageTitle lead="Alle Themen im Überblick.">Tags</PageTitle>
      <ul class="flex flex-wrap gap-3">
        {data.tags.map((tag) => (
          <li key={tag.slug}>
            <a
              href={`/tags/${tag.slug}`}
              class="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-1.5 hover:border-teal-500 dark:border-stone-800 dark:hover:border-teal-400"
            >
              <span class="font-medium">#{tag.name}</span>
              <span class="text-xs text-stone-500">{tag.posts.length}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
});
