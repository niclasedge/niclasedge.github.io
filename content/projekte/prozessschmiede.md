## Was es macht

Die Prozessschmiede ist ein Skill für Claude Code, der Prozessgrafiken aus einer
YAML-Beschreibung erzeugt – ohne eine einzige Koordinate. Sie zeichnet BPMN mit
Swimlanes, Stufendiagramme, Ist/Soll-Vergleiche, Wertströme, Sequenzen und Belege für
Changes. Ziel ist ein Bild, dessen Aussage man in wenigen Sekunden sieht, und eine Quelle,
die neben dem Bild im Repo versioniert ist.

## Wie es funktioniert

- `prozess.py neu` legt eine Beschreibung aus einer von 13 Vorlagen an. Ohne `--art`
  entsteht eine Freigabe-Vorlage mit Ist, Soll und offenen Fragen.
- `pruefen` meldet Syntaxfehler mit Zeile und Spalte, Schemafehler und Texte, die nicht in
  ihren Kasten passen. `bauen` prüft zuerst und schreibt nur, wenn alles sauber ist.
- Das Ergebnis ist immer ein Paar: `prozess.yaml` und `prozess.png`, dazu eine
  `prozess.karte.json` für eine anklickbare Ansicht.
- Jede Grafik trägt einen Status: BELEG, wenn nichts offen ist, FREIGABE NÖTIG, solange
  eine Frage ohne Entscheidung steht. Die Entscheidung trägt ein Mensch ein, nicht der
  Agent.
- `prozess.py seite` baut die Seite eines OpenSpec-Changes: Vorher und Jetzt aus der
  `proposal.md`, Diff-Box aus `git diff --numstat`.

```bash
uv run .claude/skills/prozessschmiede/scripts/prozess.py bauen prozesse/urlaubsantrag/prozess.yaml
```

Zwei Regeln halten die Bilder lesbar: Der Titel ist ein Aussagesatz, und genau ein roter
Akzent trägt diese Aussage. Technisch ist es Python mit Pillow und PyYAML, gestartet über
`uv run`; die Zeichen-Engine liegt im Skill selbst. Im ops-lab-Ablauf liefert die
Prozessschmiede den Bildbeleg, ohne den der Leitstand nicht mergt.

## Stand

Im Repo versioniert seit dem 25. September 2026, zuletzt aktualisiert am 1. Oktober 2026
(zwei Commits; davor lag der Skill nur lokal). Im Einsatz ist sie für Grafiken zum eigenen
Entwicklungsablauf, etwa den Lebenszyklus eines Pull Requests. Eigene Tests für die Engine
liegen im Repo nicht.
