## Was es macht

live-plan ist ein Skill für Claude Code und andere Coding-Agenten. Eine Sitzung
führt ein lebendes Dokument (`REPO/.live-plan/SLUG.yaml`) mit eigener
Browser-Ansicht: Fragen mit Optionen, Schritte in Bahnen und Wellen sowie
Belege. Ein Klick auf eine Option schreibt die Entscheidung zurück in die
Datei, sodass der Agent sie beim nächsten Schritt liest.

## Wie es funktioniert

- Der Agent legt die Sitzung an, ergänzt Fragen, Schritte und Belege und liest
  Entscheidungen aus der YAML-Datei.
- `live-plan open SLUG` zeigt die Plan-Ansicht mit Fortschritt, offenen Fragen,
  Anforderungen und Entscheidungen.
- `live-plan handout SLUG` erzeugt ein Handout als PNG und eigenständiges HTML.
- Der Mod `live-plan-sitzung` verbindet jede Claude-Code-Sitzung mit dem Plan:
  Er legt beim Start die Sitzung an, zeigt Kontext, Kosten und Subagenten live,
  beantwortet `AskUserQuestion` im Browser und hält riskante Bash-Befehle bis
  zur Freigabe an. Eine Frage, die eine Sitzung ohne Entscheidung schließt,
  wird zurückgezogen und bleibt mit Grund sichtbar.

## Stand

TypeScript auf bun; Installation über den skills-Installer oder per Klon in
`~/.claude/skills/live-plan`. Der Mod ist als Plugin im selben Repo und hat
eigene Tests.
