/**
 * Beleg #11: der Artikel iac-stack so, wie die Seite ihn aus getPosts() liest.
 * Aufruf aus dem Repo-Root: deno run -R docs/evidence/11/live.ts
 */
import { getPosts } from "../../../lib/posts.ts";

const post = getPosts().find((p) => p.slug === "iac-stack");
if (!post) {
  console.log("getPosts(): kein Artikel mit Slug iac-stack");
  Deno.exit(1);
}

const png = Deno.readFileSync(`static${post.image}`);
const view = new DataView(png.buffer);
const mermaid = post.html.match(/<pre class="mermaid/g)?.length ?? 0;

console.log(`Titel:     ${post.title}`);
console.log(`Datum:     ${post.day}`);
console.log(`Bereich:   ${post.area}`);
console.log(`Tags:      ${post.tags.join(", ")}`);
console.log(
  `Bild:      ${post.image} (${view.getUint32(16)}×${view.getUint32(20)})`,
);
console.log(`Mermaid:   ${mermaid} Schaubilder`);
console.log("Abschnitte:");
for (const e of post.toc.filter((e) => e.depth === 2)) {
  console.log(`  ## ${e.text}`);
}
