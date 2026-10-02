import { HttpError, page } from "fresh";
import { define } from "../../utils.ts";
import { getTag } from "../../lib/posts.ts";
import { Seo } from "../../components/Seo.tsx";
import { Page, PageTitle } from "../../components/PageTitle.tsx";
import { PostTimeline, toSummary } from "../../components/Timeline.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const tag = getTag(ctx.params.tag);
    if (!tag) throw new HttpError(404);
    return page({
      name: tag.name,
      slug: tag.slug,
      posts: tag.posts.map(toSummary),
    });
  },
});

export default define.page<typeof handler>(function TagPage({ data }) {
  const count = data.posts.length;
  return (
    <Page>
      <Seo
        title={`#${data.name}`}
        description={`Posts zum Thema ${data.name}.`}
        path={`/tags/${data.slug}`}
      />
      <PageTitle lead={`${count} ${count === 1 ? "Post" : "Posts"}`}>
        #{data.name}
      </PageTitle>
      <PostTimeline posts={data.posts} />
      <p class="mt-8 text-sm">
        <a href="/tags">← Alle Tags</a>
      </p>
    </Page>
  );
});
