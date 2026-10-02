import { define } from "../../utils.ts";
import { Seo } from "../../components/Seo.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";
import { LabShell } from "../../components/LabShell.tsx";
import JsonFormatter from "../../islands/JsonFormatter.tsx";

export default define.page(function JsonFormatterPage() {
  return (
    <LabShell current="json-formatter">
      <Seo
        title="JSON Formatter"
        description="JSON validieren, formatieren und minifizieren – lokal im Browser."
        path="/lab/json-formatter"
      />
      <PageTitle lead="JSON einfügen, validieren, formatieren oder minifizieren.">
        JSON Formatter
      </PageTitle>
      <JsonFormatter />
    </LabShell>
  );
});
