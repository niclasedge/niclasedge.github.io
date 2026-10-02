import { define } from "../../utils.ts";
import { Seo } from "../../components/Seo.tsx";
import { PageTitle } from "../../components/PageTitle.tsx";
import { LabShell } from "../../components/LabShell.tsx";
import { LAB_KINDS } from "../../lib/lab.ts";

export default define.page(function Lab() {
  return (
    <LabShell>
      <Seo
        title="Lab"
        description="Kleine interaktive Werkzeuge und HTML-Seiten, die komplett im Browser laufen."
        path="/lab"
      />
      <PageTitle lead="Kleine Werkzeuge und Seiten. Alles läuft lokal im Browser – es werden keine Daten verschickt.">
        Lab
      </PageTitle>
      <div class="prose max-w-none">
        <p>Links einen Eintrag wählen. Es gibt drei Arten:</p>
        <ul>
          <li>
            <strong>{LAB_KINDS.interactive}</strong>{" "}
            – Werkzeuge mit Eingabe und Live-Ergebnis.
          </li>
          <li>
            <strong>{LAB_KINDS.page}</strong>{" "}
            – minimale HTML-Seiten, direkt hier eingebettet.
          </li>
          <li>
            <strong>{LAB_KINDS.external}</strong>{" "}
            – liegt in einem eigenen Repo und öffnet sich dort.
          </li>
        </ul>
        <p>
          Repos, Skills und Apps stehen dagegen auf der Startseite unter{" "}
          <a href="/#eigene">Eigene Tools</a>.
        </p>
      </div>
    </LabShell>
  );
});
