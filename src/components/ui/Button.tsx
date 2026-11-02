"use client";

import { useRef, type ComponentProps, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { TransitionLink } from "@/components/layout/TransitionLink";
import { duration, ease } from "@/lib/motion/config";
import { gsap } from "@/lib/motion/gsap";
import { useMotion } from "@/lib/motion/use-motion";

type Variant = "primary" | "soft" | "light";

interface CommonProps {
  variant?: Variant;
  /** Pointer nearby pulls the button a few pixels toward it. Fine pointers only. */
  magnetic?: boolean;
  /** Shows a small arrow that turns on hover. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = CommonProps & { href: string } & Omit<ComponentProps<typeof TransitionLink>, "href" | "className" | "children">;
type NativeButtonProps = CommonProps & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

const MAGNET_RANGE = 70;
const MAGNET_PULL = 10;

/** Pill button. Hover fill and press scale are CSS (.btn); the magnetic pull is GSAP quickTo, desktop only. */
export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant = "primary", magnetic = false, arrow = false, className = "", children, ...rest } = props;
  const ref = useRef<HTMLElement>(null);

  useMotion(
    ({ mode }) => {
      const el = ref.current;
      if (!magnetic || mode !== "full" || !el) return;

      const moveX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const moveY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const clamp = gsap.utils.clamp(-MAGNET_PULL, MAGNET_PULL);

      const onMove = (event: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const within = Math.abs(dx) < rect.width / 2 + MAGNET_RANGE && Math.abs(dy) < rect.height / 2 + MAGNET_RANGE;
        moveX(within ? clamp(dx * 0.22) : 0);
        moveY(within ? clamp(dy * 0.22) : 0);
      };
      const release = () => {
        moveX(0);
        moveY(0);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", release);
      return () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", release);
        gsap.to(el, { x: 0, y: 0, duration: duration.fast, ease: ease.out, overwrite: true });
      };
    },
    { dependencies: [magnetic] },
  );

  const classes = `btn btn-${variant} ${className}`;
  const content = (
    <>
      <span className="btn-label">{children}</span>
      {arrow && <ArrowUpRight className="btn-arrow" size={18} strokeWidth={1.8} aria-hidden="true" />}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as LinkButtonProps;
    return (
      <TransitionLink href={href} ref={ref as React.Ref<HTMLAnchorElement>} className={classes} {...linkRest}>
        {content}
      </TransitionLink>
    );
  }

  const { href: _href, ...buttonRest } = rest as NativeButtonProps;
  void _href;
  return (
    <button type="button" ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
