"use client";

import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { team } from "@/data";

const SUBJECTS = ["Comprar", "Vender", "Alugar", "Investir", "Outro assunto"] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  whatsapp: z.string().refine((value) => /^[1-9]{2}9?d{8}$/.test(value.replace(/D/g, "")), "Informe um WhatsApp com DDD."),
  subject: z.enum(SUBJECTS, "Escolha um assunto."),
  message: z.string().trim().min(10, "Escreva ao menos uma frase."),
});

type Field = "name" | "whatsapp" | "subject" | "message";
type Errors = Partial<Record<Field, string>>;

/** Formats digits as a Brazilian phone while typing: (31) 91234-5678. */
function maskPhone(value: string) {
  const digits = value.replace(/D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  const split = digits.length > 10 ? 7 : 6;
  const head = digits.slice(2, split);
  const tail = digits.slice(split);
  return `(${digits.slice(0, 2)}) ${head}${tail ? "-" + tail : ""}`;
}

/** Demo-only form (CLAUDE.md): validated with zod, shows a success state, stores and sends nothing. */
export function ContactPageForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = schema.safeParse(Object.fromEntries(new FormData(form)));
    if (parsed.success) {
      setErrors({});
      const target = String(new FormData(form).get("who") ?? "");
      setSent(team.find((member) => member.id === target)?.name.split(" ")[0] ?? "a equipe");
      return;
    }
    const next: Errors = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as Field;
      next[key] ??= issue.message;
    });
    setErrors(next);
    form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  };

  if (sent) {
    return (
      <div className="form-done" role="status">
        <p className="t-title">Mensagem registrada.</p>
        <p className="t-small">
          Isto é uma demonstração: nada foi enviado ou armazenado. Em um site real, {sent} responderia em breve pelo WhatsApp.
        </p>
        <button type="button" className="link" onClick={() => setSent(null)}>
          Enviar outra
        </button>
      </div>
    );
  }

  const error = (name: Field) =>
    errors[name] && (
      <em id={`err-${name}`} className="field-error">
        {errors[name]}
      </em>
    );
  const invalid = (name: Field) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `err-${name}` : undefined,
  });

  return (
    <form className="form contact-form" noValidate onSubmit={onSubmit}>
      <div className="contact-row">
        <label className="field field--stack">
          <span>Nome</span>
          <input name="name" type="text" autoComplete="name" {...invalid("name")} />
          {error("name")}
        </label>
        <label className="field field--stack">
          <span>WhatsApp</span>
          <input
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(31) 99999-9999"
            onChange={(event) => {
              event.currentTarget.value = maskPhone(event.currentTarget.value);
            }}
            {...invalid("whatsapp")}
          />
          {error("whatsapp")}
        </label>
      </div>

      <div className="contact-row">
        <label className="field field--stack">
          <span>Assunto</span>
          <select name="subject" defaultValue="" {...invalid("subject")}>
            <option value="" disabled>
              Escolha um assunto
            </option>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {error("subject")}
        </label>
        <label className="field field--stack">
          <span>Falar com</span>
          <select name="who" defaultValue="">
            <option value="">Quem puder atender primeiro</option>
            {team.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field field--stack">
        <span>Mensagem</span>
        <textarea name="message" rows={5} {...invalid("message")} />
        {error("message")}
      </label>

      <Button type="submit" variant="primary" arrow>
        Enviar mensagem
      </Button>
      <p className="t-small">Demonstração: o formulário valida os campos, mas não envia nem guarda nada.</p>
    </form>
  );
}
