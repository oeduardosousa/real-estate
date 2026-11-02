"use client";

import { neighborhoods } from "@/data";
import { LISTING_TYPES, validateRequired, type RequiredField } from "../../model/checklist";
import { toPatch, type FormValues } from "../../model/form";
import { ownerCandidates, roleLabels } from "../../model/personas";
import type { PanelListing, Persona } from "../../model/types";
import { CheckboxField, SelectField, TextAreaField, TextField } from "./fields";

export type StepId = "dados" | "valores" | "caracteristicas" | "fotos" | "texto" | "previa";

export interface StepProps {
  values: FormValues;
  set: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;
  /** Marks a field as visited, so its error can show. */
  touch: (field: string) => void;
  touched: ReadonlySet<string>;
}

/** Error for a required field, only once the user has been there. */
function useError({ values, touched }: StepProps) {
  const errors = validateRequired(toPatch(values) as Pick<PanelListing, RequiredField>);
  return (field: RequiredField) => (touched.has(field) ? errors[field] : undefined);
}

export function DadosStep(
  props: StepProps & {
    persona: Persona;
    listing: PanelListing;
    canReassign: boolean;
    onReassign: (ownerId: string) => void;
  },
) {
  const { values, set, touch } = props;
  const error = useError(props);

  const setNeighborhood = (name: string) => {
    set("neighborhood", name);
    const match = neighborhoods.find((item) => item.name === name);
    set("city", match?.city ?? "");
  };

  return (
    <div className="panel-form">
      <TextField
        label="Título"
        value={values.title}
        onChange={(value) => set("title", value)}
        onBlur={() => touch("title")}
        error={error("title")}
      />
      <div className="panel-form-row">
        <SelectField
          label="Tipo"
          value={values.type}
          options={LISTING_TYPES.map((type) => ({ value: type, label: type }))}
          onChange={(value) => set("type", value as FormValues["type"])}
        />
        <SelectField
          label="Finalidade"
          value={values.purpose}
          options={[
            { value: "venda", label: "Venda" },
            { value: "aluguel", label: "Aluguel" },
          ]}
          onChange={(value) => set("purpose", value as FormValues["purpose"])}
        />
      </div>
      <SelectField
        label="Bairro"
        value={values.neighborhood}
        placeholder="Escolha o bairro"
        options={neighborhoods.map((item) => ({ value: item.name, label: `${item.name} (${item.city})` }))}
        onChange={setNeighborhood}
        onBlur={() => touch("neighborhood")}
        error={error("neighborhood") ?? error("city")}
      />
      <CheckboxField
        label="Imóvel em destaque"
        hint="Destaques aparecem na página inicial e precisam de 6 fotos."
        checked={values.featured}
        onChange={(checked) => set("featured", checked)}
      />

      {props.canReassign ? (
        <SelectField
          label="Responsável"
          hint="Só a Diretoria troca o responsável. A mudança vale na hora."
          value={props.listing.ownerId}
          options={ownerCandidates.map((person) => ({
            value: person.id,
            label: `${person.name} (${roleLabels[person.role]})`,
          }))}
          onChange={props.onReassign}
        />
      ) : (
        <p className="panel-muted">
          Responsável: {ownerCandidates.find((person) => person.id === props.listing.ownerId)?.name ?? "—"}
        </p>
      )}
    </div>
  );
}

export function ValoresStep(props: StepProps) {
  const { values, set, touch } = props;
  const error = useError(props);
  const rent = values.purpose === "aluguel";

  return (
    <div className="panel-form">
      <TextField
        label={rent ? "Aluguel mensal" : "Preço de venda"}
        unit="R$"
        inputMode="numeric"
        value={values.price}
        onChange={(value) => set("price", value)}
        onBlur={() => touch("price")}
        error={error("price")}
      />
      <div className="panel-form-row">
        <TextField
          label="Condomínio (por mês)"
          unit="R$"
          inputMode="numeric"
          value={values.condominio}
          onChange={(value) => set("condominio", value)}
          hint="Deixe vazio se não houver."
        />
        <TextField
          label="IPTU (por ano)"
          unit="R$"
          inputMode="numeric"
          value={values.iptu}
          onChange={(value) => set("iptu", value)}
        />
      </div>
    </div>
  );
}

export function CaracteristicasStep(props: StepProps) {
  const { values, set, touch } = props;
  const error = useError(props);

  return (
    <div className="panel-form">
      <div className="panel-form-row">
        <TextField
          label="Área construída"
          unit="m²"
          inputMode="numeric"
          value={values.area}
          onChange={(value) => set("area", value)}
          onBlur={() => touch("area")}
          error={error("area")}
        />
        <TextField
          label="Quartos"
          inputMode="numeric"
          value={values.bedrooms}
          onChange={(value) => set("bedrooms", value)}
          onBlur={() => touch("bedrooms")}
          error={error("bedrooms")}
        />
      </div>
      <div className="panel-form-row panel-form-row-3">
        <TextField label="Suítes" inputMode="numeric" value={values.suites} onChange={(value) => set("suites", value)} />
        <TextField
          label="Banheiros"
          inputMode="numeric"
          value={values.bathrooms}
          onChange={(value) => set("bathrooms", value)}
        />
        <TextField label="Vagas" inputMode="numeric" value={values.parking} onChange={(value) => set("parking", value)} />
      </div>
      <TextAreaField
        label="Diferenciais"
        hint="Um por linha, por exemplo: Terraço com vista da serra."
        rows={6}
        value={values.features}
        onChange={(value) => set("features", value)}
      />
    </div>
  );
}

export function TextoStep({ values, set }: StepProps) {
  return (
    <div className="panel-form">
      <TextAreaField
        label="Resumo"
        hint="Uma frase, usada no topo da página e nos resultados de busca."
        rows={2}
        value={values.summary}
        onChange={(value) => set("summary", value)}
      />
      <TextAreaField
        label="Descrição"
        hint="Parágrafos separados por uma linha em branco. Voz calma e precisa, sem pontos de exclamação."
        rows={10}
        value={values.description}
        onChange={(value) => set("description", value)}
      />
    </div>
  );
}
