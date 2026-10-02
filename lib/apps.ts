/**
 * iOS-Apps mit Support- und Datenschutzseiten. Die HTML-Dateien liegen
 * unverändert unter static/<slug>/ (für App Store Connect verlinkt).
 */
export interface IosApp {
  slug: string;
  name: string;
  description: string;
}

export const iosApps: IosApp[] = [
  {
    slug: "ausflugs-radar-ios",
    name: "Bucket List",
    description: "Ausflugsziele in deiner Nähe entdecken, merken und abhaken.",
  },
  {
    slug: "bujo-notes-ios",
    name: "Bujo Notes",
    description:
      "Digitales Bullet Journal mit analogem Look auf iPhone und iPad.",
  },
  {
    slug: "git-planner-ios",
    name: "Git Planner",
    description: "Nativer iOS-Client für GitHub Issues, offline-fähig.",
  },
  {
    slug: "inspire-ios",
    name: "Inspired By",
    description: "Visuelle Inspiration und Farbanalyse auf dem iPhone.",
  },
  {
    slug: "roundrobin-ios",
    name: "ScharadeMix",
    description:
      "Pass-and-play Partyspiel mit Forbidden Words, Charades und Zeichnen.",
  },
];
