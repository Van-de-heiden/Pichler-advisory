import { Icon } from './ui';

const scenes = [
  { type: 'field', title: 'Vom Einsatz bis zur Rechnung', outcome: 'Einmal erfassen. Direkt weiterverwenden.', steps: [
    { icon: 'wrench', title: 'Vor Ort', detail: 'Zeit · Material · Fotos' },
    { icon: 'file', title: 'Im Büro', detail: 'Prüfen statt abschreiben' },
    { icon: 'check', title: 'Abrechnung', detail: 'Alle Angaben sind da' },
  ] },
  { type: 'logistics', title: 'Informationen folgen der Ware', outcome: 'Ein durchgängiger Auftragsstand.', steps: [
    { icon: 'package', title: 'Bestellung', detail: 'Einmal aufgenommen' },
    { icon: 'truck', title: 'Lieferung', detail: 'Status weitergegeben' },
    { icon: 'check', title: 'Bestätigung', detail: 'Nachweis zugeordnet' },
  ] },
  { type: 'service', title: 'Mehr Zeit für Ihre Kunden', outcome: 'Weniger Verwaltung zwischen den Terminen.', steps: [
    { icon: 'file', title: 'Anfrage', detail: 'Angaben gebündelt' },
    { icon: 'clock', title: 'Auftrag', detail: 'Zeit und Leistung erfasst' },
    { icon: 'check', title: 'Abschluss', detail: 'Zur Abrechnung bereit' },
  ] },
  { type: 'property', title: 'Vom Anliegen bis zur Erledigung', outcome: 'Zuständigkeit und Verlauf bleiben sichtbar.', steps: [
    { icon: 'building', title: 'Meldung', detail: 'Dem Objekt zugeordnet' },
    { icon: 'wrench', title: 'Zuständigkeit', detail: 'Die richtige Person übernimmt' },
    { icon: 'check', title: 'Erledigung', detail: 'Dokumentiert und auffindbar' },
  ] },
  { type: 'production', title: 'Jede Übergabe baut auf der letzten auf', outcome: 'Der nächste Schritt kennt den aktuellen Stand.', steps: [
    { icon: 'file', title: 'Vorbereitung', detail: 'Auftrag vollständig' },
    { icon: 'process', title: 'Fertigung', detail: 'Fortschritt erfasst' },
    { icon: 'check', title: 'Prüfung', detail: 'Qualität dokumentiert' },
  ] },
  { type: 'opportunity', title: 'Vom Zeitfresser zur Verbesserung', outcome: 'Passend zu Ihrem Betrieb. Gemeinsam umgesetzt.', steps: [
    { icon: 'clock', title: 'Aufwand', detail: 'Was bremst Ihren Alltag?' },
    { icon: 'process', title: 'Lösung', detail: 'Der passende nächste Schritt' },
    { icon: 'check', title: 'Umsetzung', detail: 'Im Betrieb zum Laufen bringen' },
  ] },
];

export function BusinessFlow({ world = 0 }: { world?: number }) {
  const scene = scenes[world];
  return <figure className={`business-flow flow-${scene.type}`} aria-label={scene.title}>
    <div className="flow-heading"><span>Ein möglicher Ablauf</span><span className="flow-counter">0{world + 1} / 0{scenes.length}</span></div>
    <ol className="flow-steps">{scene.steps.map((step, i) => <li className={`flow-step flow-step-${i + 1}`} key={step.title}>
      <div className="flow-card"><span className="flow-icon"><Icon name={step.icon} /></span><div><strong>{step.title}</strong><span>{step.detail}</span></div><span className="flow-step-number" aria-hidden="true">0{i + 1}</span></div>
    </li>)}</ol>
    <figcaption><Icon name="check" />{scene.outcome}</figcaption>
  </figure>;
}
