// data.jsx — fake portal data
(function () {
  const holdings = [
    { id: 'atelier', name: 'Atelier — apparel label', area: 'Selective ventures', tag: 'Selective', committed: 0.6, value: 0.66, irr: 9.4, since: '2026', status: 'Held', up: true,
      thesis: 'The founder’s first venture: a small, design-led apparel label run as a live apprenticeship in building, branding and operating a real business.',
      risk: 'Elevated', risklbl: 'Early-stage and concentrated; held as a learning and brand-building position.' },
    { id: 'lindenhof', name: 'Lindenhof Studio', area: 'Private holdings', tag: 'Core', committed: 0.5, value: 0.53, irr: 6.1, since: '2026', status: 'Held', up: true,
      thesis: 'A small, cash-generative digital studio building software for owner-managed businesses — disciplined, profitable from early on.',
      risk: 'Moderate', risklbl: 'Service concentration offset by low fixed costs and recurring work.' },
    { id: 'verthandi', name: 'Private project — family', area: 'Co-investment', tag: 'Selective', committed: 0.4, value: 0.41, irr: 3.0, since: '2026', status: 'Held', up: true,
      thesis: 'A co-investment alongside family in a local, tangible small business with a clear, modest path to durability.',
      risk: 'Moderate', risklbl: 'Small scale; close alignment with operators known personally.' },
    { id: 'aurelis', name: 'Reserve allocation', area: 'Real assets', tag: 'Core', committed: 0.3, value: 0.30, irr: 0.4, since: '2027', status: 'Held', up: true,
      thesis: 'Capital held in conservative, liquid reserves — deliberately patient, ready to deploy when conviction and structure align.',
      risk: 'Low', risklbl: 'Capital preservation first; liquidity maintained for selective opportunities.' },
    { id: 'norden', name: 'Private project — friends', area: 'Co-investment', tag: 'Selective', committed: 0.2, value: 0.19, irr: -2.5, since: '2027', status: 'Under review', up: false,
      thesis: 'An early co-investment with friends in a young venture, taken small and watched closely.',
      risk: 'Elevated', risklbl: 'Recent softness under active review; sized to be a position the firm can afford to learn from.' },
  ];
  const documents = [
    { name: 'Founding Memorandum 2026', type: 'Founding document', date: '12 May 2026', size: '0.9 MB' },
    { name: 'Capital Account Statement — Q2 2026', type: 'Statement', date: '02 Jul 2026', size: '180 KB' },
    { name: 'Atelier — Thesis Memo', type: 'Investment memo', date: '20 Apr 2026', size: '1.1 MB' },
    { name: 'Investment Principles', type: 'Policy', date: '08 Mar 2026', size: '240 KB' },
    { name: 'Risk & Liquidity Note — 2026', type: 'Risk note', date: '08 Mar 2026', size: '210 KB' },
  ];
  const alloc = [
    { area: 'Private holdings', pct: 33, color: 'var(--bordeaux-700)' },
    { area: 'Real assets', pct: 46, color: 'var(--bordeaux-500)' },
    { area: 'Selective ventures', pct: 13, color: 'var(--gold-500)' },
    { area: 'Co-investment', pct: 8, color: 'var(--taupe)' },
  ];
  window.PORTAL = { holdings, documents, alloc };
})();
