import type { ReactNode } from 'react';
export function Arrow(){ return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>; }
// Lucide icon geometry (ISC). https://lucide.dev/license
const paths:Record<string,ReactNode>={
process:<><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/><path d="M6 9v9h9M15 6h3v9M9 6h6"/></>,
code:<><path d="m16 18 6-6-6-6M8 6l-6 6 6 6m6-14-4 16"/></>,
web:<><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M8 9v12"/></>,
server:<><rect x="2" y="3" width="20" height="7" rx="2"/><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M6 6.5h.01M6 17.5h.01M10 6.5h8M10 17.5h8"/></>,
wrench:<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>,
flame:<path d="M12 3c0 5-5 6-5 10a5 5 0 0 0 10 0c0-2-1-4-2-5 0 3-2 4-2 4 1-5-1-9-1-9Z"/>,
leaf:<><path d="M11 20A7 7 0 0 1 4 13C4 5 16 5 20 3c0 4 1 17-9 17Z"/><path d="M3 21c0-5 5-10 11-12"/></>,
building:<><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h1m6 0h1M8 10h1m6 0h1M8 14h1m6 0h1"/></>,
scissors:<><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m8.12 8.12 12.76 12.76M14 14l7-11M8.12 15.88 12 12"/></>,
package:<><path d="m12 3 9 5v9l-9 5-9-5V8l9-5ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5"/></>,
shop:<><path d="M3 10h18l-2-7H5l-2 7ZM4 10v11h16V10M9 21v-7h6v7"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"/></>,
truck:<><path d="M10 17h4V5H2v12h2M14 9h4l4 4v4h-2"/><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/></>,
check:<path d="m5 12 4 4L19 6"/>,clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
file:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
plus:<path d="M12 5v14M5 12h14"/>,menu:<path d="M4 7h16M4 12h16M4 17h16"/>,close:<path d="m6 6 12 12M6 18 18 6"/>
};
export function Icon({name,className=''}:{name:string,className?:string}){return <svg className={className} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.process}</svg>}
