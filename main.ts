import { App, staticFiles, trailingSlashes } from "fresh";
import type { State } from "./utils.ts";

export const app = new App<State>();

app.use(staticFiles());
// Dynamische Routen matchen keinen Slash am Ende: /posts/foo/ → /posts/foo.
// Interne Links deshalb immer ohne Slash am Ende schreiben.
app.use(trailingSlashes("never"));

app.fsRoutes();
