"use client";

import { useState } from "react";
import { resetDemo } from "../store/store";

type Step = "idle" | "confirm" | "working" | "done";

/** "Restaurar dados de demonstração", with a confirmation step because it discards local changes. */
export function DemoReset() {
  const [step, setStep] = useState<Step>("idle");

  const restore = async () => {
    setStep("working");
    await resetDemo();
    setStep("done");
  };

  return (
    <div className="panel-reset">
      {(step === "idle" || step === "done") && (
        <button type="button" className="panel-link" onClick={() => setStep("confirm")}>
          Restaurar dados de demonstração
        </button>
      )}
      {step === "confirm" && (
        <span role="group" aria-label="Confirmar restauração" className="panel-reset-confirm">
          Isso descarta as alterações feitas neste navegador.
          <button type="button" className="panel-button panel-button-danger" onClick={restore}>
            Restaurar
          </button>
          <button type="button" className="panel-link" onClick={() => setStep("idle")}>
            Cancelar
          </button>
        </span>
      )}
      <span role="status" className="panel-muted">
        {step === "working" && "Restaurando…"}
        {step === "done" && "Dados restaurados."}
      </span>
    </div>
  );
}
