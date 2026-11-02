import { OS_REDUCED_QUERY } from "./config";

/** localStorage key for the site's "Animações: completas / reduzidas" switch. */
export const MOTION_STORAGE_KEY = "curral:animations";

/**
 * Inline script for <head>. Runs before first paint and sets data-motion="reduced|full" on <html>:
 * reduced when the OS or the site switch asks for it, so CSS reads it without a flash.
 * Server-safe: no "use client".
 */
export const motionInitScript = `try{var d=document.documentElement,r=window.matchMedia(${JSON.stringify(
  OS_REDUCED_QUERY,
)}).matches||localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)})==="reduced";d.dataset.motion=r?"reduced":"full"}catch(e){}`;
