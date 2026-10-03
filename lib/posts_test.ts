import { assertEquals } from "@std/assert";
import { relatedPosts, relatedTools } from "./posts.ts";
import type { Tool } from "./directory.ts";

const p = (slug: string, tags: string[]) => ({ slug, tags });

Deno.test("relatedPosts: ohne den Artikel selbst, gemeinsame Tags zuerst", () => {
  // Eingabe ist wie getPosts() nach Datum sortiert, neueste zuerst.
  const posts = [
    p("neu", ["x"]),
    p("aktuell", ["a", "b"]),
    p("mittel", ["b"]),
    p("alt", ["a", "b", "c"]),
    p("uralt", []),
  ];
  const got = relatedPosts(posts[1], posts).map((x) => x.slug);
  assertEquals(got, ["alt", "mittel", "neu"]);
});

Deno.test("relatedPosts: weniger Posts als gewünscht", () => {
  const posts = [p("a", []), p("b", [])];
  assertEquals(relatedPosts(posts[0], posts).map((x) => x.slug), ["b"]);
});

const t = (
  id: string,
  area: Tool["area"],
  group: Tool["group"],
  status: Tool["status"],
) => ({ id, area, group, status }) as Tool;

Deno.test("relatedTools: Bereich, aktuell vor vergangen, eigen vor extern", () => {
  const tools = [
    t("ext-past", "dev", "ext", "past"),
    t("ext-cur", "dev", "ext", "current"),
    t("other", "ai", "own", "current"),
    t("own-past", "dev", "own", "past"),
    t("own-cur", "dev", "own", "current"),
  ];
  assertEquals(relatedTools("dev", tools, 3).map((x) => x.id), [
    "own-cur",
    "ext-cur",
    "own-past",
  ]);
});
