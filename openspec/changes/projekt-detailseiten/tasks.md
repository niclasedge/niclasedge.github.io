## 1. Daten

- [x] 1.1 iOS-Apps aus `content/tools.json` nach `content/apps.json`
      verschieben; About-Seite und Sitemap lesen `apps.json`
- [x] 1.2 Neue eigene Tools eintragen: folienschmiede, hook-redactor, ops-lab,
      go-knowledge-planner
- [x] 1.3 Detailtexte `content/projekte/<id>.md` für alle eigenen Tools,
      abgeleitet aus den Repos

## 2. Seiten

- [x] 2.1 `lib/projects.ts`: Detailtexte laden, fehlende und verwaiste Texte
      melden; Test in `lib/projects_test.ts`
- [x] 2.2 Route `routes/projekte/[id].tsx` mit Kopf, Links, Text und Nachfolger
- [x] 2.3 Name im Verzeichnis (`components/Timeline.tsx`) verlinkt auf die
      Detailseite; Sitemap ergänzt

## 3. Nachweis

- [x] 3.1 `deno task test` und `deno task check` laufen; CI führt die Tests aus
- [x] 3.2 `deno task site` exportiert alle Detailseiten ohne Linkfehler
- [x] 3.3 Screenshots von Startseite, aktueller und abgelöster Detailseite im PR
