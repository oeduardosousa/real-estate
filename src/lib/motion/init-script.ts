import { OS_REDUCED_QUERY } from "./config";

/** localStorage key for the site's "Animações: completas / reduzidas" switch. */
export const MOTION_STORAGE_KEY = "curral:animations";

/** localStorage key set once the loader has played. Repeat visits skip it. */
export const LOADER_STORAGE_KEY = "curral:visited";

/** The loader never outlives this many ms even if hydration is slow or fails (also enforced in CSS). */
export const LOADER_FAILSAFE_MS = 3200;

/**
 * Inline script for <head>. Runs before first paint and sets two attributes on <html>:
 * - data-motion="reduced|full": reduced when the OS or the site switch asks for it, so CSS reads it without a flash.
 * - data-loader="on": only on the first visit, outside reduced motion and save-data. The Loader component
 *   switches it to "done" when it lifts; a timer here does the same if hydration never arrives.
 * Server-safe: no "use client".
 */
export const motionInitScript = `try{var d=document.documentElement,r=window.matchMedia(${JSON.stringify(
  OS_REDUCED_QUERY,
)}).matches||localStorage.getItem(${JSON.stringify(
  MOTION_STORAGE_KEY,
)})==="reduced";d.dataset.motion=r?"reduced":"full";var c=navigator.connection;if(!r&&!(c&&c.saveData)&&!localStorage.getItem(${JSON.stringify(
  LOADER_STORAGE_KEY,
)})&&location.pathname==="/"){d.dataset.loader="on";setTimeout(function(){d.dataset.loader==="on"&&(d.dataset.loader="done")},${LOADER_FAILSAFE_MS})}}catch(e){}`;
