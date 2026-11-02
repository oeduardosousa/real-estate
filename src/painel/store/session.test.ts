import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const data = new Map<string, string>();

beforeEach(() => {
  data.clear();
  vi.stubGlobal("window", {});
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  });
});

afterEach(() => vi.unstubAllGlobals());

async function freshSession() {
  vi.resetModules();
  return import("./session");
}

describe("demo session", () => {
  it("is unknown on the server and empty on a first visit", async () => {
    const session = await freshSession();
    expect(session.getServerSession()).toBeUndefined();
    expect(session.getSession()).toBeNull();
  });

  it("remembers the persona across reloads and signs out", async () => {
    const session = await freshSession();
    const listener = vi.fn();
    session.subscribeSession(listener);

    session.signIn("camila-drummond");
    expect(session.getSession()?.role).toBe("corretor");
    expect(listener).toHaveBeenCalledTimes(1);

    const reloaded = await freshSession();
    expect(reloaded.getSession()?.id).toBe("camila-drummond");

    reloaded.signOut();
    expect(reloaded.getSession()).toBeNull();
    expect((await freshSession()).getSession()).toBeNull();
  });

  it("ignores unknown persona ids, stored or requested", async () => {
    data.set("curral-painel:persona", "someone-else");
    const session = await freshSession();
    expect(session.getSession()).toBeNull();
    session.signIn("nobody");
    expect(session.getSession()).toBeNull();
  });

  it("returns undefined during SSR", async () => {
    vi.unstubAllGlobals();
    const session = await freshSession();
    expect(session.getSession()).toBeUndefined();
  });
});
