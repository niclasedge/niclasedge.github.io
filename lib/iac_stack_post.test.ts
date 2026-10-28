import { assert, assertEquals } from "@std/assert";
import { getPosts, type Post } from "./posts.ts";

/** Breite und Höhe aus dem IHDR-Chunk einer PNG-Datei. */
function pngSize(file: string): [number, number] {
  const view = new DataView(Deno.readFileSync(file).buffer);
  return [view.getUint32(16), view.getUint32(20)];
}

function iacStack(): Post {
  const post = getPosts().find((p) => p.slug === "iac-stack");
  assert(post, "Artikel iac-stack fehlt");
  return post;
}

const SOURCE = "content/posts/2026-07-23-iac-stack.md";

Deno.test("IaC-Stack: Datum, Bereich, Titel und Beschreibung", () => {
  const post = iacStack();
  assertEquals(post.day, "2026-07-23");
  assertEquals(post.area, "infra");
  const head = Deno.readTextFileSync(SOURCE).split("---")[1];
  assert(/^title: \S/m.test(head), "title fehlt im Front Matter");
  assert(/^description: \S/m.test(head), "description fehlt im Front Matter");
});

Deno.test("IaC-Stack: nach Aufgaben gegliedert, Technologie je Aufgabe", () => {
  const post = iacStack();
  const sections = post.toc.filter((e) => e.depth === 2);
  assert(sections.length >= 6, `nur ${sections.length} ##-Abschnitte`);
  const text = post.html.replace(/<[^>]+>/g, " ");
  for (
    const tech of [
      "Ansible",
      "services.yml",
      "Schema",
      "Rollback",
      "Traefik",
      "Tailscale",
      "SOPS",
      "Semaphore",
      "Backup",
    ]
  ) {
    assert(text.includes(tech), `${tech} fehlt im Text`);
  }
  assert(/\bage\b/.test(text), "age fehlt im Text");
});

Deno.test("IaC-Stack: mindestens zwei Mermaid-Schaubilder", () => {
  const post = iacStack();
  assert(post.hasMermaid);
  const count = post.html.match(/<pre class="mermaid/g)?.length ?? 0;
  assert(count >= 2, `nur ${count} Mermaid-Schaubild(er)`);
});

Deno.test("IaC-Stack: Artikelbild als SVG und PNG 1200×630", () => {
  const post = iacStack();
  assertEquals(post.image, "/images/posts/iac-stack.png");
  assert(Deno.statSync("static/images/posts/iac-stack.svg").isFile);
  assertEquals(pngSize("static/images/posts/iac-stack.png"), [1200, 630]);
});

Deno.test("IaC-Stack: keine Affiliate-Projekte, Adressen oder Secrets", () => {
  iacStack();
  const source = Deno.readTextFileSync(SOURCE);
  for (const banned of [/affiliate/i, /astro-/i, /deinelistings/i]) {
    assert(!banned.test(source), `verbotener Begriff ${banned}`);
  }
  assert(
    !/\b\d{1,3}(\.\d{1,3}){3}\b/.test(source),
    "IPv4-Adresse im Text",
  );
  // Schlüsselnamen aus den Secret-Dateien: GROSS_GESCHRIEBEN mit Unterstrich
  // und typischem Suffix.
  assert(
    !/\b[A-Z][A-Z0-9]*_[A-Z0-9_]*(TOKEN|PASSWORD|SECRET|KEY|PAT)\b/.test(
      source,
    ),
    "Secret-Schlüsselname im Text",
  );
});
