import { OS_REDUCED_QUERY } from "./config";

/** localStorage key for the site's "Animações: completas / reduzidas" switch. */
export const MOTION_STORAGE_KEY = "curral:animations";

/**
 * Inline script for <head>. Sets data-motion on <html> before first paint so CSS reads the
 * reduced-motion state (OS or site switch) without a flash. Server-safe: no "use client".
 */
export const motionInitScript = `try{var r=window.matchMedia(${JSON.stringify(
  OS_REDUCED_QUERY,
)}).matches||localStorage.getItem(${JSON.stringify(
  MOTION_STORAGE_KEY,
)})==="reduced";document.documentElement.dataset.motion=r?"reduced":"full"}catch(e){}`;
