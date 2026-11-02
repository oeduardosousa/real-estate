import { RidgeFill, Ridge } from "./Ridge";
import type { RidgeShape } from "@/lib/ridge";

interface ImagePlaceholderProps {
  /** Describes the room or view the photograph will show (PT-BR). Exposed as the image label. */
  alt: string;
  /** Picks the crest so neighbouring frames do not repeat the same line. */
  shape?: RidgeShape;
  className?: string;
}

/**
 * Stand-in for a photograph until the asset exists: a flat tonal frame with the ridge line, at the
 * final aspect ratio, so the layout, reveals and parallax behave exactly as they will with a photo.
 * Swap for an <img> (AVIF/WebP, alt text, sizes) when photography lands in public/images.
 */
export function ImagePlaceholder({ alt, shape = "main", className = "" }: ImagePlaceholderProps) {
  return (
    <div role="img" aria-label={alt} className={`relative h-full w-full overflow-hidden bg-surface-strong ${className}`}>
      <div className="absolute inset-x-0 bottom-0 h-[58%] text-grafite/[0.07]">
        <RidgeFill shape={shape} />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[58%] text-grafite/40">
        <Ridge shape={shape} className="h-full" />
      </div>
    </div>
  );
}
