import { define } from "../../utils.ts";
import { Seo } from "../../components/Seo.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";
import { LabCards } from "../../components/LabCards.tsx";

export default define.page(function Lab() {
  return (
    <>
      <Seo
        title="Lab"
        description="Kleine interaktive Werkzeuge, die komplett im Browser laufen."
        path="/lab"
      />
      <PageTitle lead="Kleine interaktive Werkzeuge. Alles läuft lokal im Browser – es werden keine Daten verschickt.">
        Lab
      </PageTitle>
      <LabCards />
    </>
  );
});
