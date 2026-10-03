import { page } from "fresh";
import { define } from "../utils.ts";
import { renderMarkdown } from "../lib/markdown.ts";
import { getApps } from "../lib/directory.ts";
import { Seo } from "../components/Seo.tsx";
import { Page, PageTitle } from "../components/PageTitle.tsx";

export const handler = define.handlers({
  GET() {
    const { html } = renderMarkdown(Deno.readTextFileSync("content/about.md"));
    return page({ html, apps: getApps() });
  },
});

export default define.page<typeof handler>(function About({ data }) {
  return (
    <Page>
      <Seo
        title="About"
        description="Über diese Seite und ihren Autor."
        path="/about"
      />
      <PageTitle>About</PageTitle>
      <div
        class="prose max-w-none"
        // HTML stammt aus der eigenen Datei content/about.md.
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: data.html }}
      />
      <section class="mt-10">
        <h2 class="head mb-4">iOS-Apps</h2>
        <ul class="grid gap-3 sm:grid-cols-2">
          {data.apps.map((app) => (
            <li key={app.id} class="card">
              <span class="block font-semibold">{app.name}</span>
              <span class="mt-1 block text-sm text-muted">{app.desc}</span>
              <span class="mt-2 flex gap-4 text-sm">
                {(app.links ?? []).map((l) => (
                  <a key={l.href} href={l.href}>{l.label}</a>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
});
