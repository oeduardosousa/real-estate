"use client";

import { useId, type ReactNode } from "react";

interface BaseProps {
  label: string;
  hint?: string;
  error?: string;
}

function Wrapper({
  id,
  label,
  hint,
  error,
  children,
}: BaseProps & { id: string; children: ReactNode }) {
  return (
    <div className="panel-field">
      <label htmlFor={id}>{label}</label>
      {hint && (
        <p id={`${id}-hint`} className="panel-muted">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="panel-error">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, props: BaseProps) =>
  [props.hint ? `${id}-hint` : null, props.error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

interface TextFieldProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  inputMode?: "numeric" | "text";
  /** Shown after the input, e.g. "m²" or "R$". */
  unit?: string;
}

export function TextField(props: TextFieldProps) {
  const id = useId();
  const input = (
    <input
      id={id}
      value={props.value}
      inputMode={props.inputMode}
      onChange={(event) => props.onChange(event.target.value)}
      onBlur={props.onBlur}
      aria-invalid={props.error ? true : undefined}
      aria-describedby={describedBy(id, props)}
    />
  );
  return (
    <Wrapper id={id} {...props}>
      {props.unit ? (
        <div className="panel-input-unit">
          {input}
          <span aria-hidden="true">{props.unit}</span>
        </div>
      ) : (
        input
      )}
    </Wrapper>
  );
}

interface SelectFieldProps extends BaseProps {
  value: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function SelectField(props: SelectFieldProps) {
  const id = useId();
  return (
    <Wrapper id={id} {...props}>
      <select
        id={id}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        onBlur={props.onBlur}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props)}
      >
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}

interface TextAreaFieldProps extends BaseProps {
  value: string;
  rows?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export function TextAreaField(props: TextAreaFieldProps) {
  const id = useId();
  return (
    <Wrapper id={id} {...props}>
      <textarea
        id={id}
        rows={props.rows ?? 5}
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
        onBlur={props.onBlur}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy(id, props)}
      />
    </Wrapper>
  );
}

export function CheckboxField({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="panel-check">
      <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <label htmlFor={id}>
        {label}
        {hint && <span className="panel-muted panel-check-hint">{hint}</span>}
      </label>
    </div>
  );
}
