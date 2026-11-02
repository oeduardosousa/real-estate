import { STATUSES, type ActivityEntry, type Actor, type PanelListing, type Status } from "./types";

const DAY_MS = 86_400_000;

/** What the dashboard counts for this actor: a corretor sees their own listings, the others see all. */
export function listingsInScope(actor: Actor, listings: readonly PanelListing[]): PanelListing[] {
  return actor.role === "corretor"
    ? listings.filter((listing) => listing.ownerId === actor.id)
    : [...listings];
}

export function countByStatus(listings: readonly PanelListing[]): Record<Status, number> {
  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<Status, number>;
  for (const listing of listings) counts[listing.status] += 1;
  return counts;
}

/** Whole days between two instants, never negative. */
export function daysBetween(fromIso: string, to: Date): number {
  return Math.max(0, Math.floor((to.getTime() - new Date(fromIso).getTime()) / DAY_MS));
}

/** Status a listing had when it was created. Seed listings start published, panel ones as drafts. */
function initialStatus(listing: PanelListing): Status {
  return listing.origin === "seed" ? "Publicado" : "Rascunho";
}

/**
 * Mean number of days a listing stays in each status, from the activity log. Every stretch spent in a
 * status counts once, including the current one (measured up to `now`). Null when no listing has been there.
 */
export function averageDaysByStatus(
  listings: readonly PanelListing[],
  activity: readonly ActivityEntry[],
  now: Date,
): Record<Status, number | null> {
  const totals = Object.fromEntries(STATUSES.map((status) => [status, { days: 0, stretches: 0 }])) as Record<
    Status,
    { days: number; stretches: number }
  >;

  for (const listing of listings) {
    const moves = activity
      .filter((entry) => entry.listingId === listing.id && entry.kind === "transition")
      .sort((a, b) => a.at.localeCompare(b.at));

    let status = initialStatus(listing);
    let since = new Date(listing.createdAt).getTime();
    const close = (until: number) => {
      totals[status].days += Math.max(0, until - since) / DAY_MS;
      totals[status].stretches += 1;
    };

    for (const move of moves) {
      if (move.kind !== "transition") continue;
      const at = new Date(move.at).getTime();
      close(at);
      status = move.to;
      since = at;
    }
    close(now.getTime());
  }

  return Object.fromEntries(
    STATUSES.map((status) => {
      const { days, stretches } = totals[status];
      return [status, stretches === 0 ? null : days / stretches];
    }),
  ) as Record<Status, number | null>;
}
