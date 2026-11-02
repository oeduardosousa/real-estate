"use client";

import { useSyncExternalStore } from "react";
import { getServerSession, getSession, subscribeSession } from "../store/session";
import { getServerSnapshot, getSnapshot, subscribe } from "../store/store";

/** undefined while the browser has not been read yet, null when nobody is signed in. */
export function useSession() {
  return useSyncExternalStore(subscribeSession, getSession, getServerSession);
}

/** Listings and activity log. The seed on the server and during hydration, saved data afterwards. */
export function usePanelState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
