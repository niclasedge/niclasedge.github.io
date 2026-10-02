import { define } from "../utils.ts";
import { getPosts, getTags } from "../lib/posts.ts";
import { getTools } from "../lib/directory.ts";
import { getLabItems } from "../lib/lab_pages.ts";
import { absoluteUrl } from "../lib/site.ts";

// Sitemap unter /sitemap.xml. Weiterleitungen (archives, categories) fehlen bewusst.
export const handler = define.handlers({
  GET() {
    const posts = getPosts();
    // Support- und Datenschutzseiten der Apps (liegen in static/)
    const appPages = getTools()
      .filter((t) => t.group === "own" && t.area === "apps")
      .flatMap((t) => (t.links ?? []).map((l) => l.href))
      .filter((href) => href.startsWith("/"));
    const entries: { path: string; lastmod?: string }[] = [
      { path: "/" },
      { path: "/posts" },
      ...posts.map((p) => ({
        path: `/posts/${p.slug}`,
        lastmod: p.date.toISOString(),
      })),
      { path: "/tags" },
      ...getTags(posts).map((t) => ({ path: `/tags/${t.slug}` })),
      { path: "/lab" },
      ...getLabItems().filter((l) => l.kind !== "external")
        .map((l) => ({ path: l.href })),
      { path: "/about" },
      ...appPages.map((href) => ({ path: href.replace(/\/$/, "") })),
    ];
    const urls = entries.map(({ path, lastmod }) =>
      `  <url><loc>${absoluteUrl(path)}</loc>${
        lastmod ? `<lastmod>${lastmod}</lastmod>` : ""
      }</url>`
    );
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
    return new Response(xml, {
      headers: { "content-type": "application/xml; charset=utf-8" },
    });
  },
});
