/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from "react";
import Link from "next/link";

type LegalShellProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function LegalShell({ eyebrow, title, children }: LegalShellProps) {
  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="shell legal-nav">
          <Link className="brand" href="/" aria-label="Pichler Advisory – Startseite">
            <img src="/shield.png" alt="" width="32" height="39" />
            <span className="brand-name">Pichler Advisory</span>
          </Link>
          <Link className="text-link" href="/">Zur Website <span aria-hidden="true">→</span></Link>
        </div>
      </header>
      <main className="shell legal-main">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <div className="legal-content">{children}</div>
      </main>
      <footer className="legal-footer">
        <div className="shell legal-footer-inner">
          <span>© 2026 Pichler Advisory</span>
          <nav aria-label="Rechtliches">
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
