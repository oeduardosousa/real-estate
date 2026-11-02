"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { legalLinks, navLinks, site } from "@/data";
import { getLenis } from "@/lib/motion/scroll";
import { TransitionLink } from "./TransitionLink";
import { ViewSwitch } from "./ViewSwitch";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

const LINKS = [{ label: "Início", href: "/" }, ...navLinks];

/**
 * Full-screen sheet for small screens. Pure CSS transition (clip-path + staggered links); this component
 * only handles what CSS cannot: Escape, scroll lock, focus entry, and closing on navigation.
 */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const pathname = usePathname();
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Close when the route changes.
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    // Everything behind the sheet is out of reach while it is open (focus cannot wander into the page).
    const behind = Array.from(document.querySelectorAll<HTMLElement>('#conteudo, .footer-wrap'));
    behind.forEach((el) => el.setAttribute('inert', ''));
    const focusTimer = window.setTimeout(() => firstLink.current?.focus(), 120);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = previous;
      behind.forEach((el) => el.removeAttribute('inert'));
      lenis?.start();
    };
  }, [open, onClose]);

  return (
    <div id="menu" className="menu on-dark" data-open={open} aria-hidden={!open} inert={!open}>
      <nav aria-label="Menu" className="menu-inner">
        <ul>
          {LINKS.map((link, index) => (
            <li key={link.href} style={{ ["--i" as string]: index }}>
              <TransitionLink
                href={link.href}
                ref={index === 0 ? firstLink : undefined}
                onClick={onClose}
                className="menu-link"
              >
                {link.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="menu-foot" style={{ ["--i" as string]: LINKS.length }}>
          <div className="menu-view">
            <ViewSwitch current="cliente" />
          </div>
          <p>{site.tagline}</p>
          <ul>
            {legalLinks.map((link) => (
              <li key={link.href}>
                <TransitionLink href={link.href} onClick={onClose} className="link">
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}
