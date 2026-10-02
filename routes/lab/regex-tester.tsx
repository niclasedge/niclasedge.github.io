import { define } from "../../utils.ts";
import { Seo } from "../../components/Seo.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";
import { LabShell } from "../../components/LabShell.tsx";
import RegexTester from "../../islands/RegexTester.tsx";

export default define.page(function RegexTesterPage() {
  return (
    <LabShell current="regex-tester">
      <Seo
        title="Regex Tester"
        description="Reguläre Ausdrücke live gegen Beispieltext testen."
        path="/lab/regex-tester"
      />
      <PageTitle lead="JavaScript-Regex mit Flags live testen – Treffer werden markiert, Gruppen aufgelistet.">
        Regex Tester
      </PageTitle>
      <RegexTester />
    </LabShell>
  );
});
