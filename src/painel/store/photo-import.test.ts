import { describe, expect, it } from "vitest";
import { MAX_EDGE, compressImage, fitWithin } from "./photo-import";

describe("fitWithin", () => {
  it("leaves small images alone", () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 });
    expect(fitWithin(MAX_EDGE, 900)).toEqual({ width: MAX_EDGE, height: 900 });
  });

  it("scales landscape and portrait images to the longest edge", () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 1600, height: 1200 });
    expect(fitWithin(3000, 4000)).toEqual({ width: 1200, height: 1600 });
  });

  it("keeps the aspect ratio", () => {
    const { width, height } = fitWithin(6000, 4000);
    expect(width / height).toBeCloseTo(1.5, 2);
  });
});

describe("compressImage", () => {
  it("refuses files that are not images", async () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });
    expect(await compressImage(file)).toEqual({ ok: false, error: "not_image" });
  });

  it("refuses very large originals before decoding", async () => {
    const file = new File([new Uint8Array(26 * 1024 * 1024)], "big.jpg", { type: "image/jpeg" });
    expect(await compressImage(file)).toEqual({ ok: false, error: "input_too_large" });
  });

  it("reports an unreadable image instead of throwing", async () => {
    const file = new File(["not really a jpeg"], "broken.jpg", { type: "image/jpeg" });
    expect(await compressImage(file)).toEqual({ ok: false, error: "decode_failed" });
  });
});
