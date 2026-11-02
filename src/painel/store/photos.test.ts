import "fake-indexeddb/auto";
import { afterEach, describe, expect, it, vi } from "vitest";

async function freshPhotos() {
  vi.resetModules();
  return import("./photos");
}

afterEach(() => {
  vi.unstubAllGlobals();
});

const blob = (size: number) => new Blob([new Uint8Array(size)], { type: "image/webp" });

describe("photos in IndexedDB", () => {
  it("stores, reads and deletes a photo", async () => {
    const photos = await freshPhotos();
    await photos.putPhoto("a", 1, blob(10));
    expect((await photos.getPhoto("a"))?.size).toBe(10);
    await photos.deletePhoto("a");
    expect(await photos.getPhoto("a")).toBeNull();
  });

  it("returns null for a missing photo", async () => {
    const photos = await freshPhotos();
    expect(await photos.getPhoto("missing")).toBeNull();
  });

  it("reports usage per listing and clears everything", async () => {
    const photos = await freshPhotos();
    await photos.clearPhotos();
    await photos.putPhoto("a", 1, blob(10));
    await photos.putPhoto("b", 1, blob(20));
    await photos.putPhoto("c", 2, blob(5));
    expect(await photos.photoUsage()).toEqual({ count: 3, bytes: 35, perListing: { 1: 2, 2: 1 } });

    await photos.deletePhotosFor(1);
    expect((await photos.photoUsage()).perListing).toEqual({ 2: 1 });

    await photos.clearPhotos();
    expect((await photos.photoUsage()).count).toBe(0);
  });
});

describe("photos fallback", () => {
  it("keeps photos in memory when IndexedDB is missing", async () => {
    vi.stubGlobal("indexedDB", undefined);
    const photos = await freshPhotos();
    await photos.putPhoto("a", 1, blob(10));
    expect((await photos.getPhoto("a"))?.size).toBe(10);
    expect((await photos.photoUsage()).count).toBe(1);
    await photos.clearPhotos();
    expect(await photos.getPhoto("a")).toBeNull();
  });

  it("keeps photos in memory when opening the database fails", async () => {
    vi.stubGlobal("indexedDB", {
      open: () => {
        throw new Error("blocked");
      },
    });
    const photos = await freshPhotos();
    await expect(photos.putPhoto("a", 1, blob(10))).resolves.toBeUndefined();
    expect((await photos.getPhoto("a"))?.size).toBe(10);
  });

  it("does not throw when the open request errors", async () => {
    vi.stubGlobal("indexedDB", {
      open: () => {
        const request: { onerror?: () => void } = {};
        queueMicrotask(() => request.onerror?.());
        return request;
      },
    });
    const photos = await freshPhotos();
    await photos.putPhoto("a", 1, blob(1));
    expect((await photos.getPhoto("a"))?.size).toBe(1);
  });
});

describe("checkPhotoCapacity", () => {
  it("allows a photo that fits", async () => {
    const { checkPhotoCapacity } = await freshPhotos();
    expect(checkPhotoCapacity({ bytes: 0 }, 0, 1000)).toBeNull();
  });

  it("refuses more than the per-listing count", async () => {
    const { checkPhotoCapacity, PHOTO_LIMITS } = await freshPhotos();
    expect(checkPhotoCapacity({ bytes: 0 }, PHOTO_LIMITS.perListing - 1, 1)).toBeNull();
    expect(checkPhotoCapacity({ bytes: 0 }, PHOTO_LIMITS.perListing, 1)).toBe("too_many_photos");
  });

  it("refuses when the total size would be exceeded", async () => {
    const { checkPhotoCapacity, PHOTO_LIMITS } = await freshPhotos();
    expect(checkPhotoCapacity({ bytes: PHOTO_LIMITS.totalBytes - 10 }, 0, 10)).toBeNull();
    expect(checkPhotoCapacity({ bytes: PHOTO_LIMITS.totalBytes - 10 }, 0, 11)).toBe("storage_full");
  });
});
