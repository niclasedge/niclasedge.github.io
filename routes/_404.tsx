import { page } from "fresh";
import { define } from "../utils.ts";
import { Seo } from "../components/Seo.tsx";
import { PageTitle } from "../components/PageTitle.tsx";

// Ohne eigenen Handler antwortet Fresh hier mit Status 200.
export const handler = define.handlers({
  GET() {
    return page(undefined, { status: 404 });
  },
});

export default define.page(function NotFound() {
  return (
    <>
      <Seo title="Seite nicht gefunden" noindex />
      <PageTitle lead="Die angeforderte Seite gibt es (nicht mehr).">
        404 – Seite nicht gefunden
      </PageTitle>
      <p>
        Zur{" "}
        <a class="text-teal-700 underline dark:text-teal-300" href="/">
          Startseite
        </a>{" "}
        oder zur{" "}
        <a class="text-teal-700 underline dark:text-teal-300" href="/posts">
          Übersicht aller Posts
        </a>.
      </p>
    </>
  );
});
