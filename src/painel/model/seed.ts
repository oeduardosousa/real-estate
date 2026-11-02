import { getListingDetail, listings } from "@/data";
import type { ActivityEntry, PanelListing } from "./types";

const DAY_MS = 86_400_000;

/** How long ago each seed listing was published: between 19 and 96 days, so the dashboard has real spans. */
function daysAgo(listingId: number): number {
  return 12 + listingId * 7;
}

export interface PanelState {
  listings: PanelListing[];
  activity: ActivityEntry[];
}

/**
 * The 12 BRIEF.md listings as published panel listings. Each is owned by its public `agent`,
 * which is a member of the team, and starts with one "create" entry in the log. Dates are relative to
 * `now`; once the state is saved they stay fixed.
 */
export function buildSeed(now: Date = new Date()): PanelState {
  const seeded: PanelListing[] = [];
  const activity: ActivityEntry[] = [];

  for (const core of listings) {
    const detail = getListingDetail(core.slug);
    if (!detail) throw new Error(`Missing detail content for listing "${core.slug}"`);

    const seedDate = new Date(now.getTime() - daysAgo(core.id) * DAY_MS).toISOString();

    seeded.push({
      ...detail,
      status: "Publicado",
      ownerId: detail.agent,
      photos: [],
      coverPhotoId: null,
      returnComment: null,
      origin: "seed",
      createdAt: seedDate,
      updatedAt: seedDate,
      statusChangedAt: seedDate,
    });
    activity.push({
      id: `seed-${core.id}`,
      listingId: core.id,
      actorId: detail.agent,
      at: seedDate,
      kind: "create",
    });
  }

  return { listings: seeded, activity };
}
