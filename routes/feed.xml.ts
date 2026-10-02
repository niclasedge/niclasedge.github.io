import { define } from "../utils.ts";
import { getPosts } from "../lib/posts.ts";
import { escapeHtml } from "../lib/markdown.ts";
import { absoluteUrl, site } from "../lib/site.ts";

// Atom-Feed unter /feed.xml (gleiche URL wie bei jekyll-feed).
export const handler = define.handlers({
  GET() {
    const posts = getPosts();
    const updated = (posts[0]?.date ?? new Date()).toISOString();
    const entries = posts.map((post) => {
      const url = absoluteUrl(`/posts/${post.slug}`);
      const categories = post.tags
        .map((t) => `    <category term="${escapeHtml(t)}"/>`)
        .join("\n");
      return `  <entry>
    <title>${escapeHtml(post.title)}</title>
    <link href="${url}" rel="alternate" type="text/html"/>
    <id>${url}</id>
    <published>${post.date.toISOString()}</published>
    <updated>${post.date.toISOString()}</updated>
    <author><name>${escapeHtml(site.author.name)}</name></author>
${categories}
    <summary>${escapeHtml(post.description)}</summary>
    <content type="html">${escapeHtml(post.html)}</content>
  </entry>`;
    });
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${site.lang}">
  <id>${absoluteUrl("/")}</id>
  <title>${escapeHtml(site.title)}</title>
  <subtitle>${escapeHtml(site.description)}</subtitle>
  <updated>${updated}</updated>
  <author><name>${escapeHtml(site.author.name)}</name><uri>${
      absoluteUrl("/")
    }</uri></author>
  <link rel="self" type="application/atom+xml" href="${
      absoluteUrl("/feed.xml")
    }"/>
  <link rel="alternate" type="text/html" href="${absoluteUrl("/")}"/>
${entries.join("\n")}
</feed>
`;
    return new Response(xml, {
      headers: { "content-type": "application/atom+xml; charset=utf-8" },
    });
  },
});
