import { buildSeed } from "./seed";
import type { Actor, PanelListing, Status } from "./types";
import type { Clock } from "./workflow";

/** Test helpers shared by the model tests. Not imported by app code. */

export const helena: Actor = { id: "helena-vasconcelos", role: "diretoria" };
export const camila: Actor = { id: "camila-drummond", role: "corretor" };
export const bruno: Actor = { id: "bruno-teixeira", role: "corretor" };
export const tiago: Actor = { id: "tiago-pimentel", role: "backoffice" };

const seed = buildSeed().listings;

/** Listing 1: venda, owned by Camila. */
export function vendaListing(status: Status = "Rascunho"): PanelListing {
  return { ...seed[0], status };
}

/** Listing 8: aluguel, owned by Marina. */
export function aluguelListing(status: Status = "Rascunho"): PanelListing {
  return { ...seed[7], status };
}

export function fakeClock(now = "2026-02-01T10:00:00.000Z"): Clock {
  let n = 0;
  return { now, newId: () => `id-${++n}` };
}
