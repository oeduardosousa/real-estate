"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data";
import { Button } from "@/components/ui/Button";
import { MenuOverlay } from "./MenuOverlay";
import { TransitionLink } from "./TransitionLink";
import { ViewSwitch } from "./ViewSwitch";
import { Wordmark } from "./Wordmark";

/** Scroll distance before the bar hides on the way down. */
const HIDE_AFTER = 320;
/** Ignore tiny scroll deltas so trackpad noise does not flicker the bar. */
const DELTA_THRESHOLD = 6;

/**
 * Floating glass bar: wordmark, links and one action. Slides away when scrolling down and returns
 * on the way up. Below lg only the wordmark and a round menu button remain; the menu is a full sheet.
 */
export function Header() {
  const pathname = usePathname();
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

  return (
    <>
      <header
        className="site-header"
        data-hidden={hidden && !menuOpen}
        data-menu={menuOpen}
        onFocusCapture={() => setHidden(false)}
      >
        <div className="site-header-bar">
          <Wordmark />

          <ViewSwitch current="cliente" className="site-header-switch" />

          <nav aria-label="Principal" className="site-nav">
            {navLinks.map((link) => {
              const current = pathname === link.href;
              return (
                <TransitionLink
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  className="site-nav-link"
                >
                  {link.label}
                </TransitionLink>
              );
            })}
            <Button href="/contato" arrow className="site-nav-cta">
              Falar com a equipe
            </Button>
          </nav>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="menu-button"
            data-open={menuOpen}
          >
            <span className="menu-button-lines" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={menuOpen} onClose={closeMenu} />
    </>
  );
}
