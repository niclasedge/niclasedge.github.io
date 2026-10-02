import { Head } from "fresh/runtime";
import { absoluteUrl } from "../lib/site.ts";

/**
 * Weiterleitung für Alt-URLs aus der Jekyll-Zeit. GitHub Pages kann keine
 * echten Redirects, deshalb Meta-Refresh plus Canonical und sichtbarem Link.
 */
export function Redirect({ to }: { to: string }) {
  return (
    <>
      <Head>
        <title>Weiterleitung …</title>
        <meta http-equiv="refresh" content={`0; url=${to}`} />
        <link rel="canonical" href={absoluteUrl(to)} />
        <meta name="robots" content="noindex" />
      </Head>
      <p class="wrap page text-muted">
        Diese Seite ist umgezogen: <a href={to}>{to}</a>
      </p>
    </>
  );
}
