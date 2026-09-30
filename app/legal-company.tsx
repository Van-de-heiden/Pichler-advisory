import { company } from './company';

export function LegalContact() {
  return <address>
    <strong>{company.name}</strong><br />
    {company.legalForm} · Inhaber: {company.owner}<br />
    {company.street}<br />
    {company.postalCode} {company.locality}, {company.country}<br />
    UID: {company.uid}<br />
    <a href={`mailto:${company.email}`}>{company.email}</a><br />
    <a href={company.phoneHref}>{company.phone}</a>
  </address>;
}
