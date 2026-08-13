"use client";

import { useState } from "react";
import type { FormEvent } from "react";

export function AccessGate() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "unavailable">("idle");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const code = String(new FormData(form).get("code") ?? "");
    if (!code.trim()) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (response.ok) {
        window.location.replace("/");
        return;
      }
      setStatus(response.status === 503 ? "unavailable" : "error");
      form.querySelector<HTMLInputElement>("input")?.focus();
    } catch {
      setStatus("unavailable");
    }
  };

  const message = status === "error"
    ? "Dieser Zugangscode ist nicht gültig. Bitte prüfen Sie die Eingabe."
    : status === "unavailable"
      ? "Der Zugang kann gerade nicht geprüft werden. Bitte versuchen Sie es später erneut."
      : "";

  return (
    <main className="access-page">
      <img className="access-background" src="/access-forest.webp" alt="" aria-hidden="true" />
      <div className="access-shade" aria-hidden="true" />
      <section className="access-panel" aria-labelledby="access-title">
        <div className="access-brand" aria-label="Pichler Advisory">
          <img src="/shield.png" alt="" width="38" height="46" />
          <span>Pichler Advisory</span>
        </div>
        <div className="access-lock" aria-hidden="true">
          <svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
        </div>
        <p className="access-eyebrow">Persönlicher Zugang</p>
        <h1 id="access-title">Geschützter Zugang</h1>
        <p className="access-copy">Diese Website ist nur mit einem persönlichen Zugangscode erreichbar. Geben Sie den Code ein, den Sie von Pichler Advisory erhalten haben.</p>
        <form className="access-form" onSubmit={submit}>
          <label htmlFor="access-code">Zugangscode</label>
          <div className="access-input-wrap">
            <input
              id="access-code"
              name="code"
              type="password"
              autoComplete="current-password"
              inputMode="text"
              maxLength={128}
              placeholder="Code eingeben"
              aria-describedby={message ? "access-message" : undefined}
              aria-invalid={status === "error"}
              disabled={status === "submitting"}
              required
              autoFocus
            />
            <button type="submit" aria-label="Zugang öffnen" disabled={status === "submitting"}>
              {status === "submitting" ? <span className="access-spinner" /> : <span aria-hidden="true">→</span>}
            </button>
          </div>
          <p className={`access-message${message ? " is-visible" : ""}`} id="access-message" aria-live="polite">{message || "Platzhalter"}</p>
        </form>
        <a className="access-contact" href="mailto:info@pichler-advisory.ch">Keinen Code erhalten? Zugang anfragen</a>
      </section>
      <div className="access-footnote">
        <span>Pichler Advisory · Prozessoptimierung für Schweizer KMU</span>
        <nav aria-label="Rechtliches">
          <a href="/impressum">Impressum</a>
          <span aria-hidden="true">·</span>
          <a href="/datenschutz">Datenschutz</a>
        </nav>
      </div>
    </main>
  );
}
