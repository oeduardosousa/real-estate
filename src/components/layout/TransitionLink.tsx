"use client";

import type { ComponentProps, MouseEvent } from "react";
import Link from "next/link";
import { scrollTo } from "@/lib/motion/scroll";
import { usePageTransition } from "./PageTransition";

type TransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Opt out of the page-transition panel (the card-to-detail Flip owns that navigation). */
  skipTransition?: boolean;
};

/**
 * Internal link that plays the page transition. Hash-only links scroll through Lenis.
 * Modified clicks, new-tab targets, external URLs and skipTransition fall back to plain Link behaviour.
 */
export function TransitionLink({ href, skipTransition, onClick, target, ...props }: TransitionLinkProps) {
  const transition = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (target && target !== "_self") return;

    if (href.startsWith("#")) {
      event.preventDefault();
      scrollTo(href);
      window.history.replaceState(null, "", href);
      return;
    }

    if (skipTransition || !transition || !href.startsWith("/")) return;
    event.preventDefault();
    transition.navigate(href);
  };

  return <Link href={href} target={target} onClick={handleClick} {...props} />;
}
