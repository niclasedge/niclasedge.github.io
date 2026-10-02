import { HttpError, page } from "fresh";
import { define } from "../../utils.ts";
import { getTag } from "../../lib/posts.ts";
import { Seo } from "../../components/Seo.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";
import { PostList } from "../../components/PostList.tsx";

export const handler = define.handlers({
  GET(ctx) {
    const tag = getTag(ctx.params.tag);
    if (!tag) throw new HttpError(404);
    return page({ tag });
  },
});

export default define.page<typeof handler>(function TagPage({ data }) {
  const { tag } = data;
  const count = tag.posts.length;
  return (
    <>
      <Seo
        title={`#${tag.name}`}
        description={`Posts zum Thema ${tag.name}.`}
        path={`/tags/${tag.slug}`}
      />
      <PageTitle lead={`${count} ${count === 1 ? "Post" : "Posts"}`}>
        #{tag.name}
      </PageTitle>
      <PostList posts={tag.posts} />
      <p class="mt-8">
        <a
          href="/tags"
          class="text-sm text-teal-700 hover:underline dark:text-teal-300"
        >
          ← Alle Tags
        </a>
      </p>
    </>
  );
});
