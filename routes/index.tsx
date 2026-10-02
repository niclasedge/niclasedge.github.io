import { page } from "fresh";
import { define } from "../utils.ts";
import { getPosts } from "../lib/posts.ts";
import { getTools } from "../lib/directory.ts";
import { getFeeds } from "../lib/feeds.ts";
import { getLabItems } from "../lib/lab_pages.ts";
import { Seo } from "../components/Seo.tsx";
import { toSummary } from "../components/Timeline.tsx";
import Directory from "../islands/Directory.tsx";

export const handler = define.handlers({
  async GET() {
    return page({
      posts: getPosts().map(toSummary),
      tools: getTools(),
      feeds: await getFeeds(),
      lab: getLabItems(),
      builtAt: new Date().toISOString(),
    });
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  return (
    <>
      <Seo path="/" />
      <Directory {...data} />
    </>
  );
});
