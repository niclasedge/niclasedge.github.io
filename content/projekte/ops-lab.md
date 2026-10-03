## Was es macht

ops-lab ist das Werkzeug für meinen spec-getriebenen Ablauf mit Coding-Agenten. Es setzt
durch, dass jede Änderung als OpenSpec-Change entsteht – mit eigenem Branch, eigenem
Arbeitsraum und Pull Request – und dabei maschinelle Gates passiert. Dazu misst es, was ein
Lauf an Token kostet. Gedacht ist es für Repos, in denen ein Agent umsetzt und ein Mensch
über Plan und Merge entscheidet.

## Wie es funktioniert

- `just neu` legt aus einem GitHub-Issue einen Change an: Branch `change/<id>`, ein
  Git-Worktree unter `.claude/worktrees/<id>` und die OpenSpec-Artefakte.
- Gate 1 prüft den Plan (acht Prüfungen, darunter genannte Testdateien und
  `openspec validate --strict`). Gate 2 verlangt einen roten Test, der Abschluss einen
  grünen. Ohne `fertig.md` verweigert `just pr` den Push.
- Jede Gate-Regel ist eine reine Funktion in `tools/pruefungen.mjs` mit eigenem Test.
- `ops.py` ist das Lagebild über alle Worktrees: Stand, offene Aufgaben, Überschneidungen
  und was sich ohne Konflikt starten lässt – im Terminal oder im Browser.
- `just tokens` summiert den Token-Verbrauch je Sitzung.

```bash
just neu <id> <capability> <issue>
just gate1 <id>    # Plan vollständig
just gate2 <id>    # Test ist rot
just fertig <id>   # Test ist grün
just pr <id>
```

Technik: reines Node ab Version 22 mit `node --test`, Python-Standardbibliothek für
`ops.py`. Kein Paketmanager, kein Build. Ein Installer rollt den Ablauf global und je
Projekt aus. Erprobt wird er in einem getrennten Testrepo, damit Werkzeug und Werkstück
nie im selben Branch landen.

## Stand

Entstanden zwischen dem 20. und 28. September 2026: 98 Commits, 23 archivierte Changes,
442 Tests, alle grün. Änderungen am Werkzeug laufen durch denselben Ablauf, den es
durchsetzt. Offen bleibt, was kein Gate prüfen kann: ob der rote Test das Richtige prüft
und ob vor Gate 1 der Bedarf richtig verstanden wurde.

## Vorgänger

Sandcastle ließ im Juni 2026 mehrere Agenten parallel in Docker-Containern arbeiten,
gesteuert über Issue-Labels und Prompts für Plan, Umsetzung, Review und Merge.
L8-agentic-workflow bündelte Skills und globale Werkzeuge zum Ausrollen in Projekte.
ops-lab kommt ohne Container und Label-Zustandsmaschine aus: Git-Worktrees trennen die
Arbeit, und statt Zusagen im Prompt halten Gates mit Exit-Code.
