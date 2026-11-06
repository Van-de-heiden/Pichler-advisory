import Link from "next/link";
import { CiHeader, CiFooter } from './ci-site';
import { Arrow } from './ui';
export default function NotFound(){return <><CiHeader light/><main id="inhalt" className="not-found wrap"><p className="overline">404 · Seite nicht gefunden</p><h1>Hier geht es<br/>nicht weiter.</h1><p>Auf der Startseite finden Sie unsere Leistungen und den Weg zu uns.</p><Link href="/" className="button">Zur Startseite <Arrow/></Link></main><CiFooter/></>}
