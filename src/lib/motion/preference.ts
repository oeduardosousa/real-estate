"use client";

import { useSyncExternalStore } from "react";
import { OS_REDUCED_QUERY } from "./config";
import { MOTION_STORAGE_KEY } from "./init-script";

/**
 * Reduced motion has two sources: the OS setting and the site's own "Animações" switch.
 * The switch can only reduce further. When the OS asks for reduced motion it stays reduced,
 * because a vestibular preference should never be overridden by a page control.
 */

const siteListeners = new Set<() => void>();

function readSite(): boolean {
  try {
    return window.localStorage.getItem(MOTION_STORAGE_KEY) === "reduced";
  } catch {
    return false;
  }
}

function readOs(): boolean {
  return window.matchMedia(OS_REDUCED_QUERY).matches;
}

function syncDocument() {
  document.documentElement.dataset.motion = readOs() || readSite() ? "reduced" : "full";
}

function subscribeSite(onChange: () => void) {
  siteListeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === MOTION_STORAGE_KEY) {
      syncDocument();
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    siteListeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function subscribeOs(onChange: () => void) {
  const query = window.matchMedia(OS_REDUCED_QUERY);
  const handler = () => {
    syncDocument();
    onChange();
  };
  query.addEventListener("change", handler);
  return () => query.removeEventListener("change", handler);
}

/** Set by the footer / menu "Animações: completas / reduzidas" control. */
export function setSiteReducedMotion(reduced: boolean) {
  try {
    window.localStorage.setItem(MOTION_STORAGE_KEY, reduced ? "reduced" : "full");
  } catch {
    // Storage can be blocked; the choice then lasts for this page view only.
  }
  syncDocument();
  siteListeners.forEach((listener) => listener());
}

export function useOsReducedMotion(): boolean {
  return useSyncExternalStore(subscribeOs, readOs, () => false);
}

export function useSiteReducedMotion(): boolean {
  return useSyncExternalStore(subscribeSite, readSite, () => false);
}

/** True when either source asks for reduced motion. */
export function useReducedMotion(): boolean {
  const os = useOsReducedMotion();
  const site = useSiteReducedMotion();
  return os || site;
}

/** State and setter for the animation switch UI. */
export function useMotionControls() {
  const os = useOsReducedMotion();
  const site = useSiteReducedMotion();
  return {
    reduced: os || site,
    /** When true the OS decides and the switch cannot turn animations back on. */
    lockedByOs: os,
    setReduced: setSiteReducedMotion,
  };
}
