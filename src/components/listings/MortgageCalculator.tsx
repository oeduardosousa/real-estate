"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/format";

type System = "price" | "sac";

const TERMS = [15, 20, 25, 30, 35] as const;

/**
 * Simulates a financing plan from the sale price. Monthly rate is the effective equivalent of the annual one.
 * Price: fixed installment. SAC: constant amortization, so installments fall from the first to the last.
 */
export function simulate(financed: number, annualRate: number, years: number, system: System) {
  const months = years * 12;
  const rate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  if (financed <= 0 || months <= 0) return { first: 0, last: 0, total: 0 };

  if (system === "price") {
    const installment = rate === 0 ? financed / months : (financed * rate) / (1 - Math.pow(1 + rate, -months));
    return { first: installment, last: installment, total: installment * months };
  }
  const amortization = financed / months;
  const first = amortization + financed * rate;
  const last = amortization * (1 + rate);
  return { first, last, total: ((first + last) / 2) * months };
}

export function MortgageCalculator({ price }: { price: number }) {
  const [entry, setEntry] = useState(30);
  const [years, setYears] = useState<number>(30);
  const [rate, setRate] = useState(10.5);
  const [system, setSystem] = useState<System>("price");

  const financed = price * (1 - entry / 100);
  const result = simulate(financed, rate, years, system);

  return (
    <div className="calc">
      <div className="calc-controls">
        <label className="range">
          <span className="range-head">
            <span>Entrada</span>
            <strong className="num">
              {entry}% · {formatBRL(price * (entry / 100))}
            </strong>
          </span>
          <input type="range" min={10} max={80} step={5} value={entry} onChange={(event) => setEntry(Number(event.target.value))} />
        </label>

        <label className="field">
          <span>Prazo</span>
          <select value={years} onChange={(event) => setYears(Number(event.target.value))}>
            {TERMS.map((term) => (
              <option key={term} value={term}>
                {term} anos
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Juros ao ano (%)</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={30}
            step={0.1}
            value={rate}
            onChange={(event) => setRate(Math.min(30, Math.max(0, Number(event.target.value) || 0)))}
          />
        </label>

        <div className="seg" role="group" aria-label="Sistema de amortização">
          <button type="button" className="seg-btn" aria-pressed={system === "price"} onClick={() => setSystem("price")}>
            Price
          </button>
          <button type="button" className="seg-btn" aria-pressed={system === "sac"} onClick={() => setSystem("sac")}>
            SAC
          </button>
        </div>
      </div>

      <div className="calc-result" aria-live="polite">
        <p className="t-small">{system === "price" ? "Parcela mensal" : "Primeira parcela"}</p>
        <p className="calc-figure num">{formatBRL(Math.round(result.first))}</p>
        {system === "sac" && <p className="t-small num">Última parcela: {formatBRL(Math.round(result.last))}</p>}
        <dl className="calc-lines">
          <div>
            <dt>Valor financiado</dt>
            <dd className="num">{formatBRL(Math.round(financed))}</dd>
          </div>
          <div>
            <dt>Total pago em {years} anos</dt>
            <dd className="num">{formatBRL(Math.round(result.total))}</dd>
          </div>
        </dl>
      </div>

      <p className="t-small calc-note">
        Simulação ilustrativa, sem valor de proposta. Taxas, seguros e tarifas não estão incluídos, e nenhum dado é enviado ou armazenado.
      </p>
    </div>
  );
}
