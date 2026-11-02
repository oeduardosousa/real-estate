import { getListingDetail, listings } from "@/data";
import type { ActivityEntry, PanelListing } from "./types";

/** Fixed so the seed is identical on every load and in tests. */
const SEED_DATE = "2026-01-12T12:00:00.000Z";

export interface PanelState {
  listings: PanelListing[];
  activity: ActivityEntry[];
}

/**
 * The 12 BRIEF.md listings as published panel listings. Each is owned by its public `agent`,
 * which is a member of the team, and starts with one "create" entry in the log.
 */
export function buildSeed(): PanelState {
  const seeded: PanelListing[] = [];
  const activity: ActivityEntry[] = [];

  for (const core of listings) {
    const detail = getListingDetail(core.slug);
    if (!detail) throw new Error(`Missing detail content for listing "${core.slug}"`);

    seeded.push({
      ...detail,
      status: "Publicado",
      ownerId: detail.agent,
      photos: [],
      coverPhotoId: null,
      returnComment: null,
      origin: "seed",
      createdAt: SEED_DATE,
      updatedAt: SEED_DATE,
      statusChangedAt: SEED_DATE,
    });
    activity.push({
      id: `seed-${core.id}`,
      listingId: core.id,
      actorId: detail.agent,
      at: SEED_DATE,
      kind: "create",
    });
  }

  return { listings: seeded, activity };
}
