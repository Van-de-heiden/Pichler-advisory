import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter } from './new-site';

const legalPages = [{href:'/agb',label:'AGB'},{href:'/datenschutz',label:'Datenschutz'},{href:'/impressum',label:'Impressum'}];

export function LegalShell({eyebrow,title,current,children}:{eyebrow:string;title:string;current:string;children:ReactNode}) {
  return <><SiteHeader/><main id="inhalt" className="legal-main wrap">
    <p className="overline">{eyebrow}</p><h1>{title}</h1>
    <p className="legal-date">Stand: <time dateTime={current === '/datenschutz' ? '2026-10-07' : '2026-09-30'}>{current === '/datenschutz' ? '7. Oktober 2026' : '30. September 2026'}</time></p>
    <nav className="legal-navigation" aria-label="Rechtliche Seiten">{legalPages.map(page=><a key={page.href} href={page.href} aria-current={current===page.href?'page':undefined}>{page.label}</a>)}</nav>
    <div className="legal-content">{children}</div>
  </main><SiteFooter/></>;
}
