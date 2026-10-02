import { createDefine } from "fresh";

// Typ von ctx.state – aktuell gibt es keinen geteilten Zustand.
export type State = Record<never, never>;

export const define = createDefine<State>();
