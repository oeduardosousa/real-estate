import { RidgeFill } from "./Ridge";
import type { RidgeShape } from "@/lib/ridge";

/** Six soft sky/land pairings. Each Scene picks one, so neighbouring cards never look alike. */
export const TONES = ["peach", "sage", "sky", "rose", "butter", "lilac"] as const;
export type Tone = (typeof TONES)[number];

const SHAPES: readonly RidgeShape[] = ["far", "mid", "main"];

interface SceneProps {
  /** Accessible description of the view the photograph will show (PT-BR). */
  label: string;
  tone?: Tone;
  /** Moves the crest so two cards of the same tone differ. */
  variant?: number;
  className?: string;
}

/**
 * Stand-in for a photograph until the asset exists: a soft gradient sky, a sun and three tonal ridge
 * layers at the final aspect ratio. Layers are separate elements so hover and ambient motion can drift
 * them at different speeds. Swap for an <img> when photography lands in public/images.
 */
export function Scene({ label, tone = "peach", variant = 0, className = "" }: SceneProps) {
  const order = [...SHAPES.slice(variant % 3), ...SHAPES.slice(0, variant % 3)];
  return (
    <div role="img" aria-label={label} className={`scene scene--${tone} ${className}`}>
      <span className="scene-sun" style={{ ["--sx" as string]: `${28 + ((variant * 23) % 44)}%` }} />
      {order.map((shape, layer) => (
        <span key={layer} className={`scene-layer scene-layer--${layer}`}>
          <RidgeFill shape={shape} />
        </span>
      ))}
    </div>
  );
}
