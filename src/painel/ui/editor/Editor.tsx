"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toFormValues, toPatch, type FormValues } from "../../model/form";
import { can } from "../../model/permissions";
import { getPersona } from "../../model/personas";
import type { PanelListing, Persona } from "../../model/types";
import { reassignListing, updateListing } from "../../store/store";
import { StatusBadge } from "../StatusBadge";
import { errorText } from "../format";
import { CaracteristicasStep, DadosStep, TextoStep, ValoresStep, type StepId } from "./FormSteps";
import { PhotosStep } from "./PhotosStep";
import { PreviewStep } from "./PreviewStep";
import { StatusActions } from "./StatusActions";

const STEPS: readonly { id: StepId; label: string }[] = [
  { id: "dados", label: "Dados" },
  { id: "valores", label: "Valores" },
  { id: "caracteristicas", label: "Características" },
  { id: "fotos", label: "Fotos" },
  { id: "texto", label: "Texto" },
  { id: "previa", label: "Pré-visualização" },
];

/** Idle time before a draft is saved. Leaving a step or the page saves at once. */
const AUTOSAVE_MS = 800;

function readOnlyReason(persona: Persona, listing: PanelListing): string {
  if (persona.role === "corretor" && listing.ownerId !== persona.id) {
    return "Este imóvel é de outra pessoa. Você pode consultá-lo, mas não editá-lo.";
  }
  if (listing.status === "Vendido" || listing.status === "Alugado") {
    return `Este imóvel está ${listing.status.toLowerCase()} e não pode mais ser alterado.`;
  }
  return persona.role === "diretoria"
    ? "Este imóvel não pode ser editado agora."
    : `Imóveis ${listing.status === "Em revisão" ? "em revisão" : listing.status.toLowerCase()} só são editados pela Diretoria. Rascunhos e devolvidos ficam abertos para edição.`;
}

const timeFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** Stepper form with autosave. Everything typed is kept as a draft; the checklist gates the review. */
export function Editor({ listing, persona }: { listing: PanelListing; persona: Persona }) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(listing));
  const [step, setStep] = useState<StepId>("dados");
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  const canEdit = can(persona, "edit", listing);
  const canPhotos = can(persona, "photos", listing);
  const latest = useRef(values);
  useEffect(() => {
    latest.current = values;
  }, [values]);

  const persist = useCallback(
    (next: FormValues) => {
      const result = updateListing(persona, listing.id, toPatch(next));
      if (result.ok) {
        setSavedAt(new Date());
        setProblem(null);
      } else if (result.error !== "no_changes") {
        setProblem(errorText[result.error]);
      }
    },
    [persona, listing.id],
  );

  // Autosave after a pause in typing.
  useEffect(() => {
    if (!canEdit) return;
    const timer = window.setTimeout(() => persist(values), AUTOSAVE_MS);
    return () => window.clearTimeout(timer);
  }, [values, canEdit, persist]);

  // Save whatever is pending when leaving the page.
  useEffect(() => {
    if (!canEdit) return;
    return () => {
      updateListing(persona, listing.id, toPatch(latest.current));
    };
  }, [canEdit, persona, listing.id]);

  const flush = useCallback(() => {
    if (canEdit) persist(latest.current);
  }, [canEdit, persist]);

  const goTo = (next: StepId) => {
    flush();
    setStep(next);
  };

  const set: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void = (key, value) =>
    setValues((current) => ({ ...current, [key]: value }));
  const touch = (field: string) => setTouched((current) => new Set(current).add(field));
  const stepProps = { values, set, touch, touched };

  const owner = getPersona(listing.ownerId);

  return (
    <div>
      <p className="panel-muted">
        <Link href="/painel/imoveis" className="panel-row-link">
          ← Imóveis
        </Link>
      </p>

      <header className="panel-heading panel-heading-row">
        <div>
          <h1 className="panel-title">{listing.title || "Novo imóvel"}</h1>
          <p className="panel-meta">
            <StatusBadge status={listing.status} />
            <span className="panel-muted">Responsável: {owner?.name ?? "—"}</span>
            <Link href={`/painel/imoveis/historico?id=${listing.id}`} className="panel-row-link">
              Histórico
            </Link>
          </p>
        </div>
        <StatusActions listing={listing} persona={persona} beforeAction={flush} />
      </header>

      {listing.status === "Devolvido" && listing.returnComment && (
        <p className="panel-return panel-return-block">
          <strong>Devolvido pela Diretoria:</strong> {listing.returnComment}
        </p>
      )}
      {listing.status === "Rascunho" && listing.returnComment && (
        <p className="panel-return panel-return-block">
          <strong>Último comentário da Diretoria:</strong> {listing.returnComment}
        </p>
      )}

      <p role="status" className="panel-muted panel-save-state">
        {canEdit
          ? problem ?? (savedAt ? `Alterações salvas às ${timeFormat.format(savedAt)}.` : "As alterações são salvas automaticamente.")
          : readOnlyReason(persona, listing)}
      </p>

      <nav aria-label="Etapas do cadastro" className="panel-steps">
        <ol>
          {STEPS.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className="panel-step"
                aria-current={step === item.id ? "step" : undefined}
                onClick={() => goTo(item.id)}
              >
                <span className="panel-step-number" aria-hidden="true">
                  {index + 1}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section className="panel-card panel-step-body" aria-label={STEPS.find((s) => s.id === step)?.label}>
        <fieldset disabled={!canEdit} className="panel-fieldset">
          {step === "dados" && (
            <DadosStep
              {...stepProps}
              persona={persona}
              listing={listing}
              canReassign={can(persona, "reassign", listing)}
              onReassign={(ownerId) => {
                const result = reassignListing(persona, listing.id, ownerId);
                setProblem(result.ok ? null : errorText[result.error]);
              }}
            />
          )}
          {step === "valores" && <ValoresStep {...stepProps} />}
          {step === "caracteristicas" && <CaracteristicasStep {...stepProps} />}
          {step === "texto" && <TextoStep {...stepProps} />}
        </fieldset>
        {step === "fotos" && <PhotosStep listing={listing} persona={persona} canEdit={canPhotos} />}
        {step === "previa" && <PreviewStep listing={listing} />}
      </section>

      <div className="panel-step-nav">
        {STEPS.findIndex((s) => s.id === step) > 0 && (
          <button
            type="button"
            className="panel-button"
            onClick={() => goTo(STEPS[STEPS.findIndex((s) => s.id === step) - 1].id)}
          >
            Etapa anterior
          </button>
        )}
        {STEPS.findIndex((s) => s.id === step) < STEPS.length - 1 && (
          <button
            type="button"
            className="panel-button panel-button-primary"
            onClick={() => goTo(STEPS[STEPS.findIndex((s) => s.id === step) + 1].id)}
          >
            Próxima etapa
          </button>
        )}
      </div>
    </div>
  );
}
