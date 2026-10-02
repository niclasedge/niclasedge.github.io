import { page } from "fresh";
import { define } from "../../utils.ts";
import { getPosts } from "../../lib/posts.ts";
import { Seo } from "../../components/Seo.tsx";
import { Page, PageTitle } from "../../components/PageTitle.tsx";
import { PostTimeline, toSummary } from "../../components/Timeline.tsx";

export const handler = define.handlers({
  GET() {
    return page({ posts: getPosts().map(toSummary) });
  },
});

export default define.page<typeof handler>(function Posts({ data }) {
  return (
    <Page>
      <Seo title="Blog" description="Alle Beiträge nach Jahr." path="/posts" />
      <PageTitle
        lead={
          <>
            Alle Beiträge, neueste zuerst. Nach Themen:{" "}
            <a href="/tags">Tags</a>.
          </>
        }
      >
        Blog
      </PageTitle>
      <PostTimeline posts={data.posts} empty="Noch keine Beiträge." />
    </Page>
  );
});
