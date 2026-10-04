/**
 * Rendert die Artikelbilder: static/images/posts/<slug>.svg → <slug>.png
 * (1200×630) mit rsvg-convert. Läuft lokal (`deno task images`); die PNGs
 * werden committet, die CI rendert nichts. rsvg-convert: `brew install librsvg`.
 */
import { join } from "@std/path";
import { POST_IMAGES_DIR } from "../lib/posts.ts";

const WIDTH = 1200;
const HEIGHT = 630;

let count = 0;
for (const entry of Deno.readDirSync(POST_IMAGES_DIR)) {
  if (!entry.isFile || !entry.name.endsWith(".svg")) continue;
  const svg = join(POST_IMAGES_DIR, entry.name);
  const png = svg.replace(/\.svg$/, ".png");
  const { success, stderr } = await new Deno.Command("rsvg-convert", {
    args: ["-w", `${WIDTH}`, "-h", `${HEIGHT}`, "-o", png, svg],
  }).output();
  if (!success) {
    console.error(`${svg}: ${new TextDecoder().decode(stderr)}`);
    Deno.exit(1);
  }
  console.log(`${svg} → ${png}`);
  count++;
}
console.log(`${count} Bilder gerendert.`);
