import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/500-italic.css";
import "./globals.css";
import "./refinement.css";
import "./ci-revision.css";
import "./v10-design.css";
import { company } from "./company";
import { organizationId, personId, websiteId } from "./seo";
import { StructuredData } from "./structured-data";

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': organizationId,
  name: company.name,
  legalName: company.name,
  url: company.url,
  logo: `${company.url}/brand/pichler-mark-dark.svg`,
  description: 'Eingetragenes Einzelunternehmen für Beratung, Prozessoptimierung, Automatisierung, Apps, IT-Projekte und Websites.',
  email: company.email,
  telephone: company.phone,
  identifier: [
    { '@type': 'PropertyValue', propertyID: 'UID', value: company.uid },
    { '@type': 'PropertyValue', propertyID: 'CH-ID', value: company.commercialRegisterId },
    { '@type': 'PropertyValue', propertyID: 'EHRA-ID', value: company.ehraId },
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.street,
    postalCode: company.postalCode,
    addressLocality: company.locality,
    addressRegion: company.canton,
    addressCountry: 'CH',
  },
  founder: { '@id': personId },
  areaServed: { '@type': 'Country', name: company.country },
  contactPoint: { '@type': 'ContactPoint', contactType: 'Anfragen', email: company.email, telephone: company.phone, availableLanguage: 'de' },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pichler-advisory.ch"),
  title: "Pichler Advisory | Beratung & Umsetzung",
  description: "Was jeden Tag Zeit kostet, kostet jedes Jahr Geld. Pichler Advisory verbindet Beratung mit Umsetzung: bessere Abläufe, Automatisierung, Apps und Websites für Schweizer Unternehmen.",
  robots: { index: true, follow: true },
  icons: { icon: [{ url: "/pichler-mark-v13.svg", type: "image/svg+xml" }, { url: "/pichler-favicon-v13.ico" }], shortcut: "/pichler-favicon-v13.ico", apple: "/pichler-touch-icon-v13.png" },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de-CH" suppressHydrationWarning>
      <head>
        <StructuredData data={[organization, { '@context': 'https://schema.org', '@type': 'WebSite', '@id': websiteId, url: `${company.url}/`, name: company.name, inLanguage: 'de-CH', publisher: { '@id': organizationId } }]} />
      </head>
      <body>{children}</body>
    </html>
  );
}
