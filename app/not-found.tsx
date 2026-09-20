import { SiteHeader, SiteFooter } from './new-site';
import { Arrow } from './ui';
export default function NotFound(){return <><SiteHeader/><main id="inhalt" className="not-found wrap"><p className="overline">404 · Seite nicht gefunden</p><h1>Hier geht es<br/>nicht weiter.</h1><p>Auf der Startseite finden Sie unsere Leistungen und den Weg zu uns.</p><a href="/" className="button">Zur Startseite <Arrow/></a></main><SiteFooter/></>}
