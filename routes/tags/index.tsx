import { page } from "fresh";
import { define } from "../../utils.ts";
import { getTags } from "../../lib/posts.ts";
import { Seo } from "../../components/Seo.tsx";
import { Page, PageTitle } from "../../components/PageTitle.tsx";

export const handler = define.handlers({
  GET() {
    return page({ tags: getTags() });
  },
});

export default define.page<typeof handler>(function Tags({ data }) {
  return (
    <Page>
      <Seo title="Tags" description="Alle Themen im Überblick." path="/tags" />
      <PageTitle lead="Alle Themen im Überblick.">Tags</PageTitle>
      <ul class="areas">
        {data.tags.map((tag) => (
          <li key={tag.slug}>
            <a href={`/tags/${tag.slug}`} class="area bg-panel">
              #{tag.name} <span class="n">{tag.posts.length}</span>
            </a>
          </li>
        ))}
      </ul>
    </Page>
  );
});
