import { describe, expect, it } from "vitest";
import { aluguelListing, bruno, camila, fakeClock, helena, tiago, vendaListing } from "./fixtures";
import { buildSeed } from "./seed";
import { applyCreate, applyEdit, applyReassign, applyTransition, slugify } from "./workflow";

function ok<T>(result: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!result.ok) throw new Error(`expected ok, got ${result.error}`);
  return result.value;
}

describe("applyTransition", () => {
  it("walks a listing from draft to sold and logs every step", () => {
    let listing = vendaListing("Rascunho");
    const log: string[] = [];
    const steps = [
      [camila, "Em revisão"],
      [helena, "Publicado"],
      [camila, "Reservado"],
      [camila, "Vendido"],
    ] as const;
    for (const [actor, to] of steps) {
      const change = ok(applyTransition(listing, actor, to, undefined, fakeClock()));
      expect(change.entries).toHaveLength(1);
      expect(change.entries[0]).toMatchObject({ kind: "transition", from: listing.status, to });
      log.push(to);
      listing = change.listing;
    }
    expect(listing.status).toBe("Vendido");
    expect(log).toEqual(["Em revisão", "Publicado", "Reservado", "Vendido"]);
  });

  it("records who acted and when", () => {
    const clock = fakeClock("2026-03-04T08:00:00.000Z");
    const change = ok(applyTransition(vendaListing("Rascunho"), camila, "Em revisão", undefined, clock));
    expect(change.entries[0]).toMatchObject({ actorId: camila.id, at: clock.now, listingId: 1 });
    expect(change.listing.statusChangedAt).toBe(clock.now);
  });

  it("rejects illegal moves", () => {
    const result = applyTransition(vendaListing("Rascunho"), helena, "Publicado", undefined, fakeClock());
    expect(result).toEqual({ ok: false, error: "invalid_transition" });
  });

  it("rejects moves the role may not make", () => {
    const review = vendaListing("Em revisão");
    expect(applyTransition(review, camila, "Publicado", undefined, fakeClock())).toEqual({
      ok: false,
      error: "forbidden",
    });
    expect(applyTransition(review, tiago, "Devolvido", "x", fakeClock())).toEqual({
      ok: false,
      error: "forbidden",
    });
  });

  it("applies the closing rule", () => {
    expect(applyTransition(vendaListing("Reservado"), helena, "Alugado", undefined, fakeClock())).toEqual({
      ok: false,
      error: "closing_rule",
    });
    expect(applyTransition(aluguelListing("Reservado"), helena, "Vendido", undefined, fakeClock())).toEqual({
      ok: false,
      error: "closing_rule",
    });
    expect(applyTransition(aluguelListing("Reservado"), helena, "Alugado", undefined, fakeClock()).ok).toBe(true);
  });

  it("refuses to move a closed listing", () => {
    for (const closed of ["Vendido", "Alugado"] as const) {
      const result = applyTransition(vendaListing(closed), helena, "Publicado", undefined, fakeClock());
      expect(result).toEqual({ ok: false, error: "invalid_transition" });
    }
  });

  it("cancels a reservation back to Publicado", () => {
    const change = ok(applyTransition(vendaListing("Reservado"), camila, "Publicado", undefined, fakeClock()));
    expect(change.listing.status).toBe("Publicado");
  });

  describe("Devolvido", () => {
    it("requires a comment", () => {
      const review = vendaListing("Em revisão");
      expect(applyTransition(review, helena, "Devolvido", undefined, fakeClock())).toEqual({
        ok: false,
        error: "comment_required",
      });
      expect(applyTransition(review, helena, "Devolvido", "   ", fakeClock())).toEqual({
        ok: false,
        error: "comment_required",
      });
    });

    it("keeps the comment on the listing and in the log, and clears it on resubmit", () => {
      const returned = ok(
        applyTransition(vendaListing("Em revisão"), helena, "Devolvido", " Faltam fotos. ", fakeClock()),
      );
      expect(returned.listing.returnComment).toBe("Faltam fotos.");
      expect(returned.entries[0]).toMatchObject({ comment: "Faltam fotos." });

      const reopened = ok(applyTransition(returned.listing, camila, "Rascunho", undefined, fakeClock()));
      expect(reopened.listing.returnComment).toBe("Faltam fotos.");
      const resubmitted = ok(applyTransition(reopened.listing, camila, "Em revisão", undefined, fakeClock()));
      expect(resubmitted.listing.returnComment).toBeNull();
    });
  });

  it("does not mutate the input listing", () => {
    const listing = vendaListing("Rascunho");
    applyTransition(listing, camila, "Em revisão", undefined, fakeClock());
    expect(listing.status).toBe("Rascunho");
  });
});

describe("applyEdit", () => {
  it("applies changes and logs the changed fields", () => {
    const change = ok(applyEdit(vendaListing("Rascunho"), camila, { title: "Novo título", price: 1 }, fakeClock()));
    expect(change.listing).toMatchObject({ title: "Novo título", price: 1 });
    expect(change.entries).toHaveLength(1);
    expect(change.entries[0]).toMatchObject({ kind: "edit", fields: ["title", "price"] });
  });

  it("ignores fields that did not change and reports no_changes", () => {
    const listing = vendaListing("Rascunho");
    expect(applyEdit(listing, camila, { title: listing.title }, fakeClock())).toEqual({
      ok: false,
      error: "no_changes",
    });
    const change = ok(applyEdit(listing, camila, { title: listing.title, area: 1 }, fakeClock()));
    expect(change.entries[0]).toMatchObject({ fields: ["area"] });
  });

  it("denies edits the matrix does not allow", () => {
    expect(applyEdit(vendaListing("Rascunho"), bruno, { title: "x" }, fakeClock())).toEqual({
      ok: false,
      error: "forbidden",
    });
    expect(applyEdit(vendaListing("Em revisão"), camila, { title: "x" }, fakeClock())).toEqual({
      ok: false,
      error: "forbidden",
    });
    expect(applyEdit(vendaListing("Vendido"), helena, { title: "x" }, fakeClock())).toEqual({
      ok: false,
      error: "forbidden",
    });
  });

  it("lets Diretoria edit a published listing", () => {
    expect(applyEdit(vendaListing("Publicado"), helena, { price: 1 }, fakeClock()).ok).toBe(true);
  });

  it("checks the photos permission for photo changes", () => {
    const photo = { id: "p1", alt: "Sala", width: 1600, height: 900, bytes: 1000 };
    const change = ok(applyEdit(vendaListing("Rascunho"), tiago, { photos: [photo], coverPhotoId: "p1" }, fakeClock()));
    expect(change.listing.photos).toEqual([photo]);
    expect(change.entries[0]).toMatchObject({ fields: ["photos", "coverPhotoId"] });
  });

  it("moves a Devolvido listing back to Rascunho and logs both", () => {
    const change = ok(applyEdit(vendaListing("Devolvido"), camila, { area: 1 }, fakeClock()));
    expect(change.listing.status).toBe("Rascunho");
    expect(change.entries.map((entry) => entry.kind)).toEqual(["edit", "transition"]);
    expect(change.entries[1]).toMatchObject({ from: "Devolvido", to: "Rascunho" });
  });
});

describe("applyReassign", () => {
  it("is Diretoria only and logs the change", () => {
    const listing = vendaListing("Publicado");
    expect(applyReassign(listing, camila, "bruno-teixeira", fakeClock())).toEqual({ ok: false, error: "forbidden" });
    const change = ok(applyReassign(listing, helena, "bruno-teixeira", fakeClock()));
    expect(change.listing).toMatchObject({ ownerId: "bruno-teixeira", agent: "bruno-teixeira" });
    expect(change.entries[0]).toMatchObject({
      kind: "reassign",
      fromOwnerId: camila.id,
      toOwnerId: "bruno-teixeira",
    });
  });

  it("rejects back-office staff and unknown people as owners", () => {
    const listing = vendaListing("Publicado");
    expect(applyReassign(listing, helena, tiago.id, fakeClock())).toEqual({ ok: false, error: "invalid_owner" });
    expect(applyReassign(listing, helena, "nobody", fakeClock())).toEqual({ ok: false, error: "invalid_owner" });
    expect(applyReassign(listing, helena, camila.id, fakeClock())).toEqual({ ok: false, error: "no_changes" });
  });
});

describe("applyCreate", () => {
  const existing = buildSeed().listings;

  it("makes a draft owned by the creating corretor", () => {
    const change = ok(applyCreate(existing, camila, { title: "Casa Nova" }, fakeClock()));
    expect(change.listing).toMatchObject({
      id: 13,
      slug: "casa-nova",
      status: "Rascunho",
      ownerId: camila.id,
      agent: camila.id,
      origin: "panel",
    });
    expect(change.entries).toMatchObject([{ kind: "create", listingId: 13, actorId: camila.id }]);
  });

  it("makes a corretor the owner even if another owner is requested", () => {
    const change = ok(applyCreate(existing, camila, { title: "X", ownerId: bruno.id }, fakeClock()));
    expect(change.listing.ownerId).toBe(camila.id);
  });

  it("makes back-office assign an owner", () => {
    expect(applyCreate(existing, tiago, { title: "X" }, fakeClock())).toEqual({ ok: false, error: "owner_required" });
    expect(applyCreate(existing, tiago, { title: "X", ownerId: tiago.id }, fakeClock())).toEqual({
      ok: false,
      error: "invalid_owner",
    });
    expect(ok(applyCreate(existing, tiago, { title: "X", ownerId: bruno.id }, fakeClock())).listing.ownerId).toBe(bruno.id);
  });

  it("lets Diretoria own the listing by default", () => {
    expect(ok(applyCreate(existing, helena, { title: "X" }, fakeClock())).listing.ownerId).toBe(helena.id);
  });

  it("keeps slugs unique", () => {
    const change = ok(applyCreate(existing, camila, { title: "Loft Savassi" }, fakeClock()));
    expect(change.listing.slug).toBe("loft-savassi-2");
  });

  it("slugifies accents and symbols", () => {
    expect(slugify("Residência São José, nº 3!")).toBe("residencia-sao-jose-n-3");
  });
});
