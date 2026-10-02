import { page } from "fresh";
import { define } from "../utils.ts";
import { renderMarkdown } from "../lib/markdown.ts";
import { iosApps } from "../lib/apps.ts";
import { Seo } from "../components/Seo.tsx";
import { PageTitle } from "../components/PageTitle.tsx";

export const handler = define.handlers({
  GET() {
    const { html } = renderMarkdown(Deno.readTextFileSync("content/about.md"));
    return page({ html });
  },
});

export default define.page<typeof handler>(function About({ data }) {
  return (
    <>
      <Seo
        title="About"
        description="Über diese Seite und ihren Autor."
        path="/about"
      />
      <PageTitle>About</PageTitle>
      <div
        class="prose prose-stone max-w-none dark:prose-invert prose-a:text-teal-700 dark:prose-a:text-teal-300"
        // HTML stammt aus der eigenen Datei content/about.md.
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
      <section class="mt-10">
        <h2 class="mb-4 text-xl font-semibold">iOS-Apps</h2>
        <ul class="grid gap-3 sm:grid-cols-2">
          {iosApps.map((app) => (
            <li
              key={app.slug}
              class="rounded-xl border border-stone-200 p-4 dark:border-stone-800"
            >
              <a
                href={`/${app.slug}/`}
                class="font-semibold hover:text-teal-700 dark:hover:text-teal-300"
              >
                {app.name}
              </a>
              <p class="mt-1 text-sm text-stone-600 dark:text-stone-400">
                {app.description}
              </p>
              <a
                href={`/${app.slug}/privacy.html`}
                class="mt-2 inline-block text-xs text-stone-500 hover:underline"
              >
                Datenschutz
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
});
