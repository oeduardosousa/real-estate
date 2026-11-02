/**
 * The first-visit loader (html[data-loader]) sets "on" while it plays and "done" the moment it starts to
 * lift. Intro animations start on "done" so the hero is revealed as the panel leaves, and start at once
 * on repeat visits, where the attribute is never "on". Returns a cleanup that cancels a pending start.
 */
export function onIntroReady(run: () => void): () => void {
  const root = document.documentElement;
  if (root.dataset.loader !== "on") {
    run();
    return () => {};
  }

  const observer = new MutationObserver(() => {
    if (root.dataset.loader === "on") return;
    observer.disconnect();
    run();
  });
  observer.observe(root, { attributes: true, attributeFilter: ["data-loader"] });
  return () => observer.disconnect();
}
