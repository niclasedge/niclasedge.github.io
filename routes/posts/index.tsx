import { page } from "fresh";
import { define } from "../../utils.ts";
import { getPosts, type Post } from "../../lib/posts.ts";
import { Seo } from "../../components/Seo.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";
import { PostList } from "../../components/PostList.tsx";

export const handler = define.handlers({
  GET() {
    const years = new Map<string, Post[]>();
    for (const post of getPosts()) {
      const year = post.day.slice(0, 4);
      years.set(year, [...(years.get(year) ?? []), post]);
    }
    return page({ years: [...years.entries()] });
  },
});

export default define.page<typeof handler>(function Posts({ data }) {
  return (
    <>
      <Seo title="Posts" description="Alle Beiträge nach Jahr." path="/posts" />
      <PageTitle lead="Alle Beiträge, neueste zuerst.">Posts</PageTitle>
      {data.years.map(([year, posts]) => (
        <section key={year} class="mb-10">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-stone-500">
            {year}
          </h2>
          <PostList posts={posts} />
        </section>
      ))}
    </>
  );
});
