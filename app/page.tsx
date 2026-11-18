import Home from './v6-home';
import { pageMetadata, pageSchema } from './seo';
import { StructuredData } from './structured-data';
export const metadata = pageMetadata('/', 'Pichler Advisory | Zeit gewinnen. Kosten senken. Wachstum ermöglichen.', 'Beratung und Umsetzung für Schweizer KMU. Wir finden, wo Ihr Betrieb Zeit und Geld verliert, entwickeln die passende Lösung und setzen sie gemeinsam um.');

export default async function Page({ searchParams }: { searchParams: Promise<{ leistung?: string | string[] }> }) {
  const query = await searchParams;
  return <>
    <StructuredData data={pageSchema('/', 'Pichler Advisory – Beratung und Umsetzung für Schweizer KMU')} />
    <Home searchParams={{ leistung: typeof query.leistung === 'string' ? query.leistung : undefined }} />
  </>;
}
