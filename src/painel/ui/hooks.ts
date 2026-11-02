"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getPhoto } from "../store/photos";
import { getServerSession, getSession, subscribeSession } from "../store/session";
import { getServerTeam, getTeam, subscribeTeam } from "../store/team";
import { getServerSnapshot, getSnapshot, subscribe } from "../store/store";

/** undefined while the browser has not been read yet, null when nobody is signed in. */
export function useSession() {
  return useSyncExternalStore(subscribeSession, getSession, getServerSession);
}

/** Listings and activity log. The seed on the server and during hydration, saved data afterwards. */
export function usePanelState() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** People added in the panel. Re-renders when the team changes, so names and owner lists stay current. */
export function useTeam() {
  return useSyncExternalStore(subscribeTeam, getTeam, getServerTeam);
}

/** Object URL for a stored photo, or null while it loads or if it is missing. Revoked on cleanup. */
export function usePhotoUrl(photoId: string | null): string | null {
  const [loaded, setLoaded] = useState<{ id: string; url: string } | null>(null);

  useEffect(() => {
    if (!photoId) return;
    let cancelled = false;
    let url: string | null = null;
    getPhoto(photoId).then((blob) => {
      if (cancelled || !blob) return;
      url = URL.createObjectURL(blob);
      setLoaded({ id: photoId, url });
    });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [photoId]);

  return loaded && loaded.id === photoId ? loaded.url : null;
}
