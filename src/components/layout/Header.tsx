"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data";
import { Button } from "@/components/ui/Button";
import { MenuOverlay } from "./MenuOverlay";
import { TransitionLink } from "./TransitionLink";
import { Wordmark } from "./Wordmark";

/** Scroll distance before the header turns solid, and before it may hide. */
const SOLID_AFTER = 24;
const HIDE_AFTER = 240;
/** Ignore tiny scroll deltas so trackpad noise does not flicker the header. */
const DELTA_THRESHOLD = 6;

/**
 * 72px header (DESIGN.md "Layout"): transparent over the hero, solid pedra with a hairline once
 * scrolled, hides on scroll down and returns on scroll up. Desktop shows the links; below lg a
 * "Menu" text button opens the noite overlay. While the overlay is open the header sits above it
 * (noite theme) so the same button closes it.
 */
export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      setSolid(y > SOLID_AFTER);
      if (y < HIDE_AFTER) {
        setHidden(false);
        lastY.current = y;
      } else if (Math.abs(delta) > DELTA_THRESHOLD) {
        setHidden(delta > 0);
        lastY.current = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Focus returns to the trigger when the menu closes.
  useEffect(() => {
    if (wasOpen.current && !menuOpen) triggerRef.current?.focus();
    wasOpen.current = menuOpen;
  }, [menuOpen]);

  // Keyboard focus must never land on a hidden header.
  const reveal = () => setHidden(false);

  return (
    <>
      <header
        data-solid={solid && !menuOpen}
        data-hidden={hidden && !menuOpen}
        onFocusCapture={reveal}
        className={`site-header fixed inset-x-0 top-0 h-header text-fg ${
          menuOpen ? "theme-noite z-[81]" : "z-header"
        }`}
      >
        <div className="container-page flex h-full items-center justify-between gap-6">
          <Wordmark />

          <nav aria-label="Principal" className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => {
              const current = pathname === link.href;
              return (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className={`type-label inline-flex min-h-touch items-center border-b border-transparent ${
                    current ? "border-accent" : "link-quiet"
                  }`}
                >
                  {link.label}
                </TransitionLink>
              );
            })}
            <Button href="/contato" magnetic>
              Falar com a equipe
            </Button>
          </nav>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="type-label inline-flex min-h-touch min-w-touch items-center lg:hidden"
          >
            {menuOpen ? "Fechar" : "Menu"}
          </button>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
