"use client";

import { useRef, useState } from "react";
import { MIN_PHOTOS, MIN_PHOTOS_FEATURED } from "../../model/checklist";
import type { PanelListing, PhotoMeta, Persona } from "../../model/types";
import { deletePhoto, PHOTO_LIMITS } from "../../store/photos";
import { importPhotos } from "../../store/photo-import";
import { getSnapshot, pruneRemovedPhotos, updateListing } from "../../store/store";
import { errorText } from "../format";
import { usePhotoUrl } from "../hooks";

function PhotoRow({
  photo,
  index,
  total,
  isCover,
  disabled,
  onAlt,
  onCover,
  onMove,
  onRemove,
}: {
  photo: PhotoMeta;
  index: number;
  total: number;
  isCover: boolean;
  disabled: boolean;
  onAlt: (alt: string) => void;
  onCover: () => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const url = usePhotoUrl(photo.id);
  // Alt text is committed on blur, so typing does not write to the store on every key.
  const [alt, setAlt] = useState(photo.alt);

  return (
    <li className="panel-photo">
      <div className="panel-photo-thumb">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element -- local blob URL, not optimizable
          <img src={url} alt={photo.alt} width={photo.width} height={photo.height} />
        ) : (
          <span className="panel-muted">Carregando…</span>
        )}
        {isCover && <span className="panel-photo-cover">Capa</span>}
      </div>
      <div className="panel-photo-body">
        <label className="panel-photo-alt">
          <span>Texto alternativo da foto {index + 1}</span>
          <input
            value={alt}
            disabled={disabled}
            placeholder="Descreva o que a foto mostra"
            onChange={(event) => setAlt(event.target.value)}
            onBlur={() => alt !== photo.alt && onAlt(alt.trim())}
          />
        </label>
        {!disabled && (
          <div className="panel-photo-actions">
            <button type="button" className="panel-button" onClick={onCover} disabled={isCover}>
              {isCover ? "É a capa" : "Usar como capa"}
            </button>
            <button
              type="button"
              className="panel-button"
              onClick={() => onMove(-1)}
              disabled={index === 0}
              aria-label={`Mover foto ${index + 1} para antes`}
            >
              ↑
            </button>
            <button
              type="button"
              className="panel-button"
              onClick={() => onMove(1)}
              disabled={index === total - 1}
              aria-label={`Mover foto ${index + 1} para depois`}
            >
              ↓
            </button>
            <button type="button" className="panel-button" onClick={onRemove}>
              Remover
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

/** Upload, reorder, cover and alt text. Photos are resized in the browser and kept in IndexedDB. */
export function PhotosStep({
  listing,
  persona,
  canEdit,
}: {
  listing: PanelListing;
  persona: Persona;
  canEdit: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const minimum = listing.featured ? MIN_PHOTOS_FEATURED : MIN_PHOTOS;

  /** The store has the newest version of the listing; the prop can lag behind an await. */
  const current = () => getSnapshot().listings.find((item) => item.id === listing.id) ?? listing;

  const commit = (patch: Parameters<typeof updateListing>[2]) => {
    const before = current();
    const result = updateListing(persona, listing.id, patch);
    if (!result.ok) {
      setMessages([errorText[result.error]]);
      return false;
    }
    void pruneRemovedPhotos(before, result.value);
    return true;
  };

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setMessages([]);
    const { added, errors } = await importPhotos(listing.id, current().photos.length, Array.from(files));
    if (added.length > 0) {
      const latest = current();
      const result = updateListing(persona, listing.id, {
        photos: [...latest.photos, ...added],
        coverPhotoId: latest.coverPhotoId ?? added[0].id,
      });
      if (!result.ok) {
        await Promise.all(added.map((photo) => deletePhoto(photo.id)));
        errors.push(errorText[result.error]);
      }
    }
    setMessages(errors);
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  const move = (index: number, direction: -1 | 1) => {
    const photos = [...current().photos];
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;
    [photos[index], photos[target]] = [photos[target], photos[index]];
    commit({ photos });
  };

  const remove = (photo: PhotoMeta) => {
    const latest = current();
    const photos = latest.photos.filter((item) => item.id !== photo.id);
    commit({
      photos,
      coverPhotoId: latest.coverPhotoId === photo.id ? (photos[0]?.id ?? null) : latest.coverPhotoId,
    });
  };

  const setAlt = (photo: PhotoMeta, alt: string) =>
    commit({ photos: current().photos.map((item) => (item.id === photo.id ? { ...item, alt } : item)) });

  return (
    <div>
      <div className="panel-photos-head">
        <div>
          <p className="panel-group-title">
            {listing.photos.length} de {PHOTO_LIMITS.perListing} fotos
          </p>
          <p className="panel-muted">
            Mínimo de {minimum} fotos{listing.featured ? " (imóvel em destaque)" : ""}, cada uma com texto
            alternativo. As imagens são reduzidas para 1600 px e ficam só neste navegador.
          </p>
        </div>
        {canEdit && (
          <>
            <input
              ref={input}
              id="photo-input"
              type="file"
              accept="image/*"
              multiple
              className="visually-hidden"
              onChange={(event) => onFiles(event.target.files)}
              disabled={busy}
            />
            <button
              type="button"
              className="panel-button panel-button-primary"
              onClick={() => input.current?.click()}
              disabled={busy || listing.photos.length >= PHOTO_LIMITS.perListing}
            >
              {busy ? "Processando…" : "Adicionar fotos"}
            </button>
          </>
        )}
      </div>

      {messages.length > 0 && (
        <ul role="alert" className="panel-error-list">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      {listing.photos.length === 0 ? (
        <div className="panel-card panel-empty">
          <p>Nenhuma foto ainda.</p>
        </div>
      ) : (
        <ul className="panel-photo-list">
          {listing.photos.map((photo, index) => (
            <PhotoRow
              key={photo.id}
              photo={photo}
              index={index}
              total={listing.photos.length}
              isCover={listing.coverPhotoId === photo.id}
              disabled={!canEdit}
              onAlt={(alt) => setAlt(photo, alt)}
              onCover={() => commit({ coverPhotoId: photo.id })}
              onMove={(direction) => move(index, direction)}
              onRemove={() => remove(photo)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
