import Link from 'next/link';
import type { ReactNode } from 'react';
import { CiHeader, CiFooter } from './ci-site';
import { Arrow } from './ui';

const legalPages = [{href:'/agb',label:'AGB'},{href:'/datenschutz',label:'Datenschutz'},{href:'/impressum',label:'Impressum'}];

export function LegalShell({eyebrow,title,current,children}:{eyebrow:string;title:string;current:string;children:ReactNode}) {
  return <><CiHeader light/><main id="inhalt" className="legal-main wrap v10-legal">
    <Link href="/" className="v10-legal-back"><Arrow/>Zur Startseite</Link>
    <p className="overline">{eyebrow}</p><h1>{title}</h1>
    <p className="legal-date">Stand: <time dateTime="2026-11-06">6. November 2026</time></p>
    <nav className="legal-navigation" aria-label="Rechtliche Seiten">{legalPages.map(page=><a key={page.href} href={page.href} aria-current={current===page.href?'page':undefined}>{page.label}</a>)}</nav>
    <div className="legal-content">{children}</div>
  </main><CiFooter/></>;
}
