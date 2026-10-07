import type { Metadata } from 'next';
import { company } from './company';

export const organizationId = `${company.url}/#organization`;
export const personId = `${company.url}/ueber-mich#person`;
export const websiteId = `${company.url}/#website`;

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = `${company.url}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', locale: 'de_CH', siteName: company.name,
      url, title, description,
      images: [{ url: `${company.url}/shield.png`, alt: company.name }],
    },
    twitter: { card: 'summary', title, description, images: [`${company.url}/shield.png`] },
  };
}

export function pageSchema(path: string, name: string, type = 'WebPage') {
  const url = `${company.url}${path}`;
  return {
    '@context': 'https://schema.org', '@type': type, '@id': `${url}#webpage`,
    url, name, inLanguage: 'de-CH', isPartOf: { '@id': websiteId },
    publisher: { '@id': organizationId },
  };
}

export function breadcrumbSchema(path: string, name: string) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: company.name, item: `${company.url}/` },
      { '@type': 'ListItem', position: 2, name, item: `${company.url}${path}` },
    ],
  };
}
