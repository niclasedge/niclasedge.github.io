## 1. Bilder

- [x] 1.1 SVG je Artikel in `static/images/posts/`, Rendern mit
      `scripts/render-images.ts` (`deno task images`)

## 2. Einbindung

- [x] 2.1 `lib/posts.ts`: Bildpfad je Artikel; Test in `lib/posts_test.ts`
- [x] 2.2 Titelbild in `routes/posts/[slug].tsx`, `og:image` in
      `components/Seo.tsx`
- [x] 2.3 Vorschaubild im Zeitstrahl (`components/Timeline.tsx`)

## 3. Nachweis

- [x] 3.1 `deno task check`, `deno task test`, `deno task site` grün
- [x] 3.2 Screenshots im PR
