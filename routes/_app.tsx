import { define } from "../utils.ts";
import { site } from "../lib/site.ts";
import { CodeIcon, SearchIcon } from "../components/Icons.tsx";

const nav = [
  { href: "/posts", label: "Blog", match: ["/posts", "/tags"] },
  { href: "/#eigene", label: "Eigene Tools" },
  { href: "/#externe", label: "Externe Tools" },
  { href: "/#quellen", label: "Quellen" },
  { href: "/lab", label: "Lab", match: ["/lab"] },
  { href: "/about", label: "About", match: ["/about"] },
  { href: site.links.github, label: "GitHub" },
];

export default define.page(function App({ Component, url }) {
  const current = url.pathname;
  const isActive = (match?: string[]) =>
    match?.some((m) => current === m || current.startsWith(`${m}/`)) ?? false;
  return (
    <html lang={site.lang}>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta
          name="theme-color"
          content="#26272b"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="theme-color"
          content="#f6f6f8"
          media="(prefers-color-scheme: light)"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title={site.title}
          href="/feed.xml"
        />
      </head>
      <body class="flex min-h-screen flex-col antialiased">
        <a
          href="#inhalt"
          class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-10 focus:rounded-md focus:bg-panel focus:px-3 focus:py-1.5"
        >
          Zum Inhalt springen
        </a>
        <header class="top">
          <div class="wrap">
            <a class="brand" href="/">
              <CodeIcon />
              {site.brand}
            </a>
            <nav aria-label="Hauptnavigation">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  // Explizit "false": sonst markiert Fresh /#eigene auf "/"
                  // als aktuelle Seite (der Hash zählt dort nicht).
                  aria-current={isActive(item.match) ? "page" : "false"}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            {current !== "/" && (
              // Ohne JavaScript ein normales Formular; die Startseite liest ?q=.
              <form class="top-search" action="/" method="get" role="search">
                <label class="search">
                  <SearchIcon />
                  <span class="sr-only">Beiträge und Tools durchsuchen</span>
                  <input type="search" name="q" placeholder="Suchen" />
                </label>
              </form>
            )}
          </div>
        </header>
        <main id="inhalt" class="flex-1">
          <Component />
        </main>
        <footer class="site">
          <div class="wrap">
            <span>
              © {new Date().getFullYear()} {site.author.name} ·{" "}
              <a href="/feed.xml">Feed</a> · <a href="/about">About</a>
            </span>
            <span>Gebaut mit Fresh</span>
          </div>
        </footer>
      </body>
    </html>
  );
});
