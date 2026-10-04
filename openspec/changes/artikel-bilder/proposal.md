## Why

Artikel haben nur ein generiertes Platzhalter-Vorschaubild und kein Bild für
Vorschauen in sozialen Netzen oder Messengern. Issue:
niclasedge/niclasedge.github.io#9.

## What Changes

- Je Artikel ein passendes Bild: SVG-Quelle in `static/images/posts/<slug>.svg`
  (1200×630, Farben der Seite), gerendert zu `<slug>.png` daneben.
- Das PNG erscheint als Titelbild im Artikel, als Vorschaubild im Zeitstrahl
  (statt des Platzhalters) und als `og:image` mit großer Karte.
- `deno task images` rendert alle SVGs mit `rsvg-convert` neu. Die PNGs werden
  committet, die CI rendert nichts.

## Capabilities

### New Capabilities

- `artikel-bild`: Titel- und Vorschaubild je Artikel.

### Modified Capabilities

(keine)

## Impact

- Berührte Dateien: `static/images/posts/*` (neu), `scripts/render-images.ts`
  (neu), `deno.json`, `lib/posts.ts`, `lib/posts_test.ts`,
  `components/Timeline.tsx`, `components/Seo.tsx`, `routes/posts/[slug].tsx`,
  `assets/styles.css`, `README.md`.
- Abgrenzung: Tool-Detailseiten und Lab bekommen keine Bilder.
