import { HttpError, page } from "fresh";
import { define } from "../../utils.ts";
import { getLabPage } from "../../lib/lab_pages.ts";
import { Seo } from "../../components/Seo.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";
import { LabShell } from "../../components/LabShell.tsx";

// Lab-Seiten aus content/lab/<slug>.html|.md. Interaktive Werkzeuge haben
// eigene Routen daneben (json-formatter.tsx …), die Vorrang haben.
export const handler = define.handlers({
  GET(ctx) {
    const lab = getLabPage(ctx.params.slug);
    if (!lab) throw new HttpError(404);
    return page({ lab });
  },
});

export default define.page<typeof handler>(function LabPage({ data }) {
  const { lab } = data;
  return (
    <LabShell current={lab.slug}>
      <Seo
        title={lab.title}
        description={lab.description}
        path={`/lab/${lab.slug}`}
      />
      <PageTitle lead={lab.description}>{lab.title}</PageTitle>
      <div
        class={lab.markdown ? "lab-page prose max-w-none" : "lab-page"}
        // HTML stammt aus eigenen Dateien in content/lab.
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: lab.html }}
      />
    </LabShell>
  );
});
