import { define } from "../utils.ts";
import { site } from "../lib/site.ts";

const nav = [
  { href: "/posts", label: "Posts" },
  { href: "/tags", label: "Tags" },
  { href: "/lab", label: "Lab" },
  { href: site.toolsPath, label: "Tools" },
  { href: "/about", label: "About" },
];

export default define.page(function App({ Component, url }) {
  const current = url.pathname;
  return (
    <html lang={site.lang}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="alternate"
          type="application/atom+xml"
          title={site.title}
          href="/feed.xml"
        />
      </head>
      <body class="min-h-screen bg-white font-sans text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
        <div class="mx-auto flex min-h-screen max-w-3xl flex-col px-5">
          <header class="flex flex-wrap items-center justify-between gap-4 py-6">
            <a href="/" class="group">
              <span class="block text-lg font-bold tracking-tight group-hover:text-teal-700 dark:group-hover:text-teal-300">
                {site.title}
              </span>
              <span class="block text-xs text-stone-500 dark:text-stone-400">
                {site.tagline}
              </span>
            </a>
            <nav aria-label="Hauptnavigation">
              <ul class="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium">
                {nav.map((item) => {
                  const active = current === item.href ||
                    current.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        class={active
                          ? "text-teal-700 dark:text-teal-300"
                          : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </header>
          <main class="flex-1 py-6">
            <Component />
          </main>
          <footer class="flex flex-wrap justify-between gap-2 border-t border-stone-200 py-6 text-sm text-stone-500 dark:border-stone-800 dark:text-stone-400">
            <span>© {new Date().getFullYear()} {site.author.name}</span>
            <span class="flex gap-4">
              <a class="hover:underline" href={site.links.github}>GitHub</a>
              <a class="hover:underline" href="/feed.xml">Feed</a>
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
});
