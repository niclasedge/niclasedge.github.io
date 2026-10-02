/** Zentrale Seiten-Konfiguration (ersetzt die alte _config.yml). */
export const site = {
  title: "Niclas Edge Docs",
  tagline: "Automate the Edge Blog",
  description:
    "Notizen, Anleitungen und kleine Werkzeuge rund um Linux, Docker und Automatisierung.",
  url: "https://niclasedge.github.io",
  lang: "de",
  author: {
    name: "Niclas Edge",
    email: "niclasedge@googlemail.com",
  },
  links: {
    github: "https://github.com/niclasedge",
    twitter: "https://twitter.com/niclasedge",
  },
  /** Eigene GitHub-Pages-Project-Site (Repo niclasedge/tools), nicht Teil dieses Builds. */
  toolsPath: "/tools/",
} as const;

/** Absolute URL für Feed, Sitemap und Canonical-Links (mit Slash am Ende wie auf GitHub Pages). */
export function absoluteUrl(path: string): string {
  if (path === "/") return `${site.url}/`;
  const last = path.split("/").pop() ?? "";
  return last.includes(".") ? `${site.url}${path}` : `${site.url}${path}/`;
}
