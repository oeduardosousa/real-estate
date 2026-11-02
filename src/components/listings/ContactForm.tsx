"use client";

import { flushSync } from "react-dom";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  email: z.email("Informe um e-mail válido."),
  message: z.string().trim().min(10, "Escreva ao menos uma frase."),
});

type Errors = Partial<Record<"name" | "email" | "message", string>>;

/** Demo-only form (CLAUDE.md): validated with zod, shows a success state, stores and sends nothing. */
export function ContactForm({ listingTitle, agentName }: { listingTitle: string; agentName: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = schema.safeParse(data);
    if (parsed.success) {
      setErrors({});
      setSent(true);
      return;
    }
    const next: Errors = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as keyof Errors;
      next[key] ??= issue.message;
    });
    const form = event.currentTarget;
    // Render the errors first, otherwise there is no invalid field in the DOM to move focus to.
    flushSync(() => setErrors(next));
    form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  };

  if (sent) {
    return (
      <div className="form-done" role="status">
        <p className="t-title">Mensagem registrada.</p>
        <p className="t-small">
          Isto é uma demonstração: nada foi enviado ou armazenado. Em um site real, {agentName} responderia sobre {listingTitle}.
        </p>
        <button type="button" className="link" onClick={() => setSent(false)}>
          Enviar outra
        </button>
      </div>
    );
  }

  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      {(
        [
          ["name", "Nome", "text", "name"],
          ["email", "E-mail", "email", "email"],
        ] as const
      ).map(([name, label, type, autoComplete]) => (
        <label key={name} className="field field--stack">
          <span>{label}</span>
          <input
            name={name}
            type={type}
            autoComplete={autoComplete}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `err-${name}` : undefined}
          />
          {errors[name] && (
            <em id={`err-${name}`} className="field-error">
              {errors[name]}
            </em>
          )}
        </label>
      ))}
      <label className="field field--stack">
        <span>Mensagem</span>
        <textarea
          name="message"
          rows={4}
          defaultValue={`Olá, tenho interesse em ${listingTitle}.`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "err-message" : undefined}
        />
        {errors.message && (
          <em id="err-message" className="field-error">
            {errors.message}
          </em>
        )}
      </label>
      <Button type="submit" variant="primary" arrow>
        Falar com {agentName.split(" ")[0]}
      </Button>
      <p className="t-small">Demonstração: o formulário valida os campos, mas não envia nem guarda nada.</p>
    </form>
  );
}
