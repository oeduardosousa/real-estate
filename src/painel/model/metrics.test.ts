import { describe, expect, it } from "vitest";
import { applyTransition } from "./workflow";
import { camila, fakeClock, helena, vendaListing } from "./fixtures";
import { averageDaysByStatus, countByStatus, daysBetween, listingsInScope } from "./metrics";
import { buildSeed } from "./seed";

const DAY = 86_400_000;
const NOW = new Date("2026-06-30T12:00:00.000Z");

describe("seed dates", () => {
  it("spaces listings relative to now and keeps the log in step", () => {
    const { listings, activity } = buildSeed(NOW);
    for (const listing of listings) {
      expect(daysBetween(listing.createdAt, NOW)).toBeGreaterThanOrEqual(19);
      expect(activity.find((a) => a.listingId === listing.id)?.at).toBe(listing.createdAt);
    }
  });
});

describe("listingsInScope", () => {
  const { listings } = buildSeed(NOW);

  it("gives a corretor only their own listings", () => {
    const own = listingsInScope(camila, listings);
    expect(own.length).toBeGreaterThan(0);
    expect(own.every((l) => l.ownerId === camila.id)).toBe(true);
  });

  it("gives Diretoria and Back-office everything", () => {
    expect(listingsInScope(helena, listings)).toHaveLength(12);
    expect(listingsInScope({ id: "tiago-pimentel", role: "backoffice" }, listings)).toHaveLength(12);
  });
});

describe("countByStatus", () => {
  it("counts every status, including empty ones", () => {
    const counts = countByStatus(buildSeed(NOW).listings);
    expect(counts.Publicado).toBe(12);
    expect(counts.Rascunho).toBe(0);
    expect(Object.keys(counts)).toHaveLength(8);
  });
});

describe("averageDaysByStatus", () => {
  it("measures a seed listing's current stretch up to now", () => {
    const { listings, activity } = buildSeed(NOW);
    const one = listings.filter((l) => l.id === 1); // 19 days old
    const averages = averageDaysByStatus(one, activity, NOW);
    expect(averages.Publicado).toBeCloseTo(19, 5);
    expect(averages.Rascunho).toBeNull();
  });

  it("splits a listing's life across the statuses it went through", () => {
    const created = new Date(NOW.getTime() - 10 * DAY).toISOString();
    const reviewAt = new Date(NOW.getTime() - 6 * DAY).toISOString();
    const base = { ...vendaListing("Rascunho"), origin: "panel" as const, createdAt: created };

    const sent = applyTransition(base, camila, "Em revisão", undefined, fakeClock(reviewAt));
    if (!sent.ok) throw new Error(sent.error);

    const averages = averageDaysByStatus([sent.value.listing], sent.value.entries, NOW);
    expect(averages.Rascunho).toBeCloseTo(4, 5);
    expect(averages["Em revisão"]).toBeCloseTo(6, 5);
    expect(averages.Publicado).toBeNull();
  });

  it("averages across listings", () => {
    const { listings, activity } = buildSeed(NOW);
    const pair = listings.filter((l) => l.id === 1 || l.id === 2); // 19 and 26 days
    expect(averageDaysByStatus(pair, activity, NOW).Publicado).toBeCloseTo(22.5, 5);
  });
});
