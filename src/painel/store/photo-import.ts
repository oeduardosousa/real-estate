import type { PhotoMeta } from "../model/types";
import { checkPhotoCapacity, photoUsage, putPhoto, type PhotoLimitError } from "./photos";

/** Longest edge after resizing. Plenty for the detail page, small enough for browser storage. */
export const MAX_EDGE = 1600;
/** Larger originals are refused before decoding. */
export const MAX_INPUT_BYTES = 25 * 1024 * 1024;

export type PhotoImportError = "not_image" | "input_too_large" | "decode_failed" | PhotoLimitError;

/** Photo messages shown in the editor. */
export const photoErrorText: Record<PhotoImportError, string> = {
  not_image: "não é uma imagem.",
  input_too_large: "o arquivo passa de 25 MB.",
  decode_failed: "não foi possível ler a imagem.",
  too_many_photos: "o imóvel já está no limite de fotos.",
  storage_full: "o espaço de armazenamento do painel está cheio.",
};

/** Scales down to fit `max` on the longest edge. Never scales up. */
export function fitWithin(width: number, height: number, max = MAX_EDGE): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= max) return { width, height };
  const scale = max / longest;
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

type Compressed = { ok: true; blob: Blob; width: number; height: number } | { ok: false; error: PhotoImportError };

/** Resizes in the browser and re-encodes as WebP, or JPEG where WebP encoding is not supported. */
export async function compressImage(file: File): Promise<Compressed> {
  if (!file.type.startsWith("image/")) return { ok: false, error: "not_image" };
  if (file.size > MAX_INPUT_BYTES) return { ok: false, error: "input_too_large" };

  try {
    const bitmap = await createImageBitmap(file);
    const { width, height } = fitWithin(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return { ok: false, error: "decode_failed" };
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const encode = (type: string, quality: number) =>
      new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
    let blob = await encode("image/webp", 0.82);
    if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg", 0.85);
    if (!blob) return { ok: false, error: "decode_failed" };
    return { ok: true, blob, width, height };
  } catch {
    return { ok: false, error: "decode_failed" };
  }
}

export interface ImportResult {
  added: PhotoMeta[];
  /** One entry per refused file, already phrased for the user. */
  errors: string[];
}

/**
 * Compresses and stores each file in turn, stopping at the caps. Returns the metadata for the
 * photos that were stored; the caller attaches them to the listing.
 */
export async function importPhotos(
  listingId: number,
  currentCount: number,
  files: readonly File[],
): Promise<ImportResult> {
  const result: ImportResult = { added: [], errors: [] };
  let bytes = (await photoUsage()).bytes;

  for (const file of files) {
    const compressed = await compressImage(file);
    if (!compressed.ok) {
      result.errors.push(`${file.name}: ${photoErrorText[compressed.error]}`);
      continue;
    }
    const limit = checkPhotoCapacity({ bytes }, currentCount + result.added.length, compressed.blob.size);
    if (limit) {
      result.errors.push(`${file.name}: ${photoErrorText[limit]}`);
      continue;
    }
    const id = crypto.randomUUID();
    await putPhoto(id, listingId, compressed.blob);
    bytes += compressed.blob.size;
    result.added.push({
      id,
      alt: "",
      width: compressed.width,
      height: compressed.height,
      bytes: compressed.blob.size,
    });
  }
  return result;
}
