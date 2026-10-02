import { page } from "fresh";
import { define } from "../utils.ts";
import { getPosts } from "../lib/posts.ts";
import { site } from "../lib/site.ts";
import { Seo } from "../components/Seo.tsx";
import { PostList } from "../components/PostList.tsx";
import { LabCards } from "../components/LabCards.tsx";

const LATEST = 5;

export const handler = define.handlers({
  GET() {
    const posts = getPosts();
    return page({ latest: posts.slice(0, LATEST), total: posts.length });
  },
});

export default define.page<typeof handler>(function Home({ data }) {
  return (
    <>
      <Seo path="/" />
      <section class="mb-12">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
          Hallo, ich bin {site.author.name}.
        </h1>
        <p class="mt-3 text-lg text-stone-600 dark:text-stone-400">
          {site.description}
        </p>
      </section>

      <section class="mb-12">
        <div class="mb-4 flex items-baseline justify-between">
          <h2 class="text-xl font-semibold">Neueste Posts</h2>
          {data.total > data.latest.length && (
            <a
              href="/posts"
              class="text-sm text-teal-700 hover:underline dark:text-teal-300"
            >
              Alle {data.total} Posts →
            </a>
          )}
        </div>
        <PostList posts={data.latest} />
      </section>

      <section class="mb-12">
        <div class="mb-4 flex items-baseline justify-between">
          <h2 class="text-xl font-semibold">Lab</h2>
          <a
            href="/lab"
            class="text-sm text-teal-700 hover:underline dark:text-teal-300"
          >
            Zum Lab →
          </a>
        </div>
        <LabCards />
      </section>

      <section class="rounded-xl bg-stone-100 p-6 dark:bg-stone-900">
        <h2 class="text-xl font-semibold">Tools</h2>
        <p class="mt-2 text-stone-600 dark:text-stone-400">
          Weitere Browser-Werkzeuge (HTML-Einzelseiten) liegen in einer eigenen
          Sammlung.
        </p>
        <a
          href={site.toolsPath}
          class="mt-4 inline-block rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Zu den Tools →
        </a>
      </section>
    </>
  );
});
