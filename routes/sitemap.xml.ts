import { define } from "../utils.ts";
import { getPosts, getTags } from "../lib/posts.ts";
import { iosApps } from "../lib/apps.ts";
import { labTools } from "../lib/lab.ts";
import { absoluteUrl } from "../lib/site.ts";

// Sitemap unter /sitemap.xml. Weiterleitungen (archives, categories) fehlen bewusst.
export const handler = define.handlers({
  GET() {
    const posts = getPosts();
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
      ...labTools.map((t) => ({ path: `/lab/${t.slug}` })),
      { path: "/about" },
      ...iosApps.flatMap((a) => [
        { path: `/${a.slug}` },
        { path: `/${a.slug}/privacy.html` },
      ]),
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
