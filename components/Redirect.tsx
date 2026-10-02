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
      <p class="text-stone-600 dark:text-stone-400">
        Diese Seite ist umgezogen: <a class="underline" href={to}>{to}</a>
      </p>
    </>
  );
}
