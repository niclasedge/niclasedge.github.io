import { type AreaKey, AREAS } from "../lib/areas.ts";
import type { FeedKind } from "../lib/directory.ts";

interface IconProps {
  size?: number;
}

const stroke = {
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
} as const;

export function CodeIcon({ size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...stroke}
      stroke-width={2.2}
      aria-hidden="true"
    >
      <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
    </svg>
  );
}

export function StarIcon({ size = 15 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="var(--yellow)"
      aria-hidden="true"
    >
      <path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z" />
    </svg>
  );
}

export function SearchIcon({ size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...stroke}
      stroke-width={2.2}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function areaPaths(area: AreaKey) {
  switch (area) {
    case "ai":
      return (
        <>
          <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
          <path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
        </>
      );
    case "automation":
      return (
        <>
          <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5" />
          <path d="M20 4v4.5h-4.5" />
          <path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5" />
          <path d="M4 20v-4.5h4.5" />
        </>
      );
    case "infra":
      return (
        <>
          <rect x="4" y="4" width="16" height="6" rx="1.5" />
          <rect x="4" y="14" width="16" height="6" rx="1.5" />
          <path d="M8 7h.01M8 17h.01" />
        </>
      );
    case "dev":
      return <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />;
    case "apps":
      return (
        <>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 18.5h3" />
        </>
      );
  }
}

/** Icon eines Bereichs in dessen Farbe. */
export function AreaIcon({ area, size = 15 }: IconProps & { area: AreaKey }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...stroke}
      stroke={AREAS[area].color}
      aria-hidden="true"
    >
      {areaPaths(area)}
    </svg>
  );
}

function kindPaths(kind: FeedKind) {
  switch (kind) {
    case "video":
      return (
        <>
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
        </>
      );
    case "release":
      return (
        <>
          <path d="M3 12V4h8l9 9-8 8z" />
          <circle cx="7.5" cy="8.5" r="1.3" fill="currentColor" />
        </>
      );
    case "user":
      return (
        <>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c1.2-3.6 4-5 7-5s5.8 1.4 7 5" />
        </>
      );
    case "blog":
      return (
        <>
          <path d="M5 5a14 14 0 0 1 14 14" />
          <path d="M5 11a8 8 0 0 1 8 8" />
          <circle cx="6" cy="18" r="1.5" fill="currentColor" />
        </>
      );
    case "site":
      return (
        <>
          <path d="M4 20h16" />
          <path d="M7 16v-5M12 16V6M17 16v-8" />
        </>
      );
  }
}

/** Icon einer Quellen-Art (Video, Release, Aktivität, Beitrag). */
export function KindIcon({ kind, size = 17 }: IconProps & { kind: FeedKind }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...stroke}
      aria-hidden="true"
    >
      {kindPaths(kind)}
    </svg>
  );
}

/**
 * Icons für die Punkte auf dem Zeitstrahl. Tools bekommen ihr Icon über
 * `icon` in content/tools.json oder automatisch über ihre Kategorie
 * (siehe TIMELINE_ICON_BY_CAT in lib/directory.ts).
 */
export type TimelineIcon =
  | "post"
  | "app"
  | "skill"
  | "web"
  | "lab"
  | "repo"
  | "terminal"
  | "layers"
  | "cloud"
  | "box"
  | "gear"
  | "chart"
  | "code";

function timelinePaths(icon: TimelineIcon) {
  switch (icon) {
    case "post":
      return (
        <>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M10 12h5M10 16h5" />
        </>
      );
    case "app":
      return (
        <>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 18.5h3" />
        </>
      );
    case "skill":
      return (
        <>
          <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
          <path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" />
        </>
      );
    case "web":
      return (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </>
      );
    case "lab":
      return (
        <>
          <path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3" />
          <path d="M7 15h10" />
        </>
      );
    case "repo":
      return (
        <>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <circle cx="18" cy="8" r="2.5" />
          <path d="M6 8.5v7M18 10.5c0 4-6 3-11 5.5" />
        </>
      );
    case "terminal":
      return (
        <>
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="M7 9l3 3-3 3M12.5 15H17" />
        </>
      );
    case "layers":
      return (
        <>
          <path d="M12 3l9 5-9 5-9-5z" />
          <path d="M3 13l9 5 9-5" />
        </>
      );
    case "cloud":
      return (
        <path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.8 4.8 0 0 1-.5 9.5z" />
      );
    case "box":
      return (
        <>
          <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
          <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
        </>
      );
    case "gear":
      return (
        <>
          <path d="M4 12a8 8 0 0 1 13.7-5.7L20 8.5" />
          <path d="M20 4v4.5h-4.5" />
          <path d="M20 12a8 8 0 0 1-13.7 5.7L4 15.5" />
          <path d="M4 20v-4.5h4.5" />
        </>
      );
    case "chart":
      return (
        <>
          <rect x="3" y="4" width="7" height="6" rx="1.5" />
          <rect x="14" y="14" width="7" height="6" rx="1.5" />
          <path d="M6.5 10v4.5a2 2 0 0 0 2 2H14" />
        </>
      );
    case "code":
      return <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />;
  }
}

/** Punkt auf dem Zeitstrahl: kleines Icon in der Farbe des Bereichs (--c). */
export function TimelineDot({ icon }: { icon: TimelineIcon }) {
  return (
    <span class="dot" aria-hidden="true">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        {...stroke}
        stroke-width={2.2}
      >
        {timelinePaths(icon)}
      </svg>
    </span>
  );
}
