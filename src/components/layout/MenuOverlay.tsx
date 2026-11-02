"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { legalLinks, navLinks, site } from "@/data";
import { bezier, duration, stagger } from "@/lib/motion/config";
import { useReducedMotion } from "@/lib/motion/preference";
import { getLenis } from "@/lib/motion/scroll";
import { MotionSwitch } from "./MotionSwitch";
import { TransitionLink } from "./TransitionLink";

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled])';
const ENTER = duration.moderate;
/** Exit is 60% of enter (DESIGN.md "UI presence"). */
const EXIT = ENTER * 0.6;
const DRAWER: [number, number, number, number] = [...bezier.drawer];
const OUT: [number, number, number, number] = [...bezier.out];

const HIDDEN_CLIP = "inset(0 0 100% 0)";
const SHOWN_CLIP = "inset(0 0 0% 0)";

/**
 * Full-screen noite overlay for mobile and tablet. Large Headline-size links in 56px rows,
 * staggered in by 40ms. Escape closes it and focus returns to the trigger; Tab is kept inside.
 * Reduced motion: opacity only, 120ms.
 */
export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const openedAtPath = useRef(pathname);

  // A route change closes the menu.
  useEffect(() => {
    if (!open) {
      openedAtPath.current = pathname;
    } else if (pathname !== openedAtPath.current) {
      onClose();
    }
  }, [pathname, open, onClose]);

  // While open: lock scroll, make the page inert, trap focus, close on Escape.
  useEffect(() => {
    if (!open) return;

    const lenis = getLenis();
    lenis?.stop();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const outside = [document.getElementById("conteudo"), document.getElementById("rodape")];
    outside.forEach((el) => el?.setAttribute("inert", ""));

    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previousOverflow;
      outside.forEach((el) => el?.removeAttribute("inert"));
      lenis?.start();
    };
  }, [open, onClose]);

  const links = [{ label: "Início", href: "/" }, ...navLinks];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="theme-noite fixed inset-0 z-overlay flex flex-col bg-bg px-gutter pb-8 pt-header text-fg"
          initial={reduced ? { opacity: 0 } : { clipPath: HIDDEN_CLIP }}
          animate={
            reduced
              ? { opacity: 1, transition: { duration: 0.12 } }
              : { clipPath: SHOWN_CLIP, transition: { duration: ENTER, ease: DRAWER } }
          }
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.12 } }
              : { clipPath: HIDDEN_CLIP, transition: { duration: EXIT, ease: DRAWER } }
          }
        >
          <nav aria-label="Principal" className="flex flex-1 flex-col justify-center">
            <ul>
              {links.map((link, index) => {
                const current = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    className="border-b border-line"
                    initial={reduced ? false : { opacity: 0, y: 16 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: ENTER,
                        delay: 0.12 + index * stagger.menu,
                        ease: OUT,
                      },
                    }}
                  >
                    <TransitionLink
                      href={link.href}
                      aria-current={current ? "page" : undefined}
                      className="flex min-h-14 items-center justify-between py-3 text-headline"
                    >
                      {link.label}
                      {current && <span className="type-label text-accent">Você está aqui</span>}
                    </TransitionLink>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-6">
            <TransitionLink href="/contato" className="btn btn-on-noite w-full">
              <span className="btn-label">Falar com a equipe</span>
            </TransitionLink>
            <MotionSwitch />
            <ul className="flex gap-6 text-label text-fg-secondary">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <TransitionLink href={link.href} className="inline-flex min-h-touch items-center">
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
            <p className="text-label text-fg-muted">{site.disclaimer.pt}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
