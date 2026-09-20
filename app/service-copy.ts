export type ServiceCopy = {
  label: string; title: string; lead: string; resultTitle: string; resultText: string;
  situations: {title:string; text:string}[]; included: string[];
  before: string; after: string; scope: string; cost: string; factors: string[];
  steps: {title:string;text:string}[]; closing: string;
};
export const serviceCopy: Record<string, ServiceCopy> = {
  'prozesse-automatisierung': {
    label:'Prozesse & Automatisierung', title:'Schluss mit Arbeit,\ndie keiner braucht.',
    lead:'Doppelt erfassen, ständig nachfragen, mühsam nacharbeiten. Wir finden die Ursache und setzen einen besseren Ablauf um — im ganzen Betrieb oder für einen einzelnen Prozess.',
    resultTitle:'Einmal erfassen.\nDann damit arbeiten.', resultText:'Oft liegt die Verbesserung zwischen zwei Arbeitsschritten: dort, wo Daten übertragen werden, Informationen fehlen oder niemand den nächsten Schritt auslöst.',
    situations:[{title:'Daten mehrfach eingeben',text:'Kunden- und Auftragsdaten werden aus E-Mails in Listen und später in eine weitere Anwendung übertragen.'},{title:'Informationen suchen',text:'Der Auftragsstand ist in einem Postfach, der Rapport auf Papier und das Material in einer separaten Liste.'},{title:'Routine manuell erledigen',text:'Erinnerungen, Freigaben und wiederkehrende Aufgaben brauchen jedes Mal jemanden, der daran denkt.'}],
    included:['Den betroffenen Ablauf und seine Schwachstellen verstehen','Eine praktikable Verbesserung mit klarem Umfang festlegen','Die vereinbarte Lösung umsetzen und testen','Ihr Team einführen und den neuen Ablauf dokumentieren'],
    before:'Ein Auftrag kommt per E-Mail. Angaben werden in eine Liste kopiert. Für die Bearbeitung und die Rechnung werden sie erneut zusammengesucht.',
    after:'Der Auftrag wird einmal erfasst. Die benötigten Angaben stehen für die nächsten Arbeitsschritte bereit. Zuständigkeiten und Status sind sichtbar.',
    scope:'Sie bestimmen, wie breit wir ansetzen. Wir können Ihren Betrieb vor Ort durchgehen oder genau den Prozess verbessern, den Sie uns nennen.',
    cost:'Der Aufwand hängt vom Ablauf, den beteiligten Systemen und der gewünschten Umsetzung ab. Sie erhalten ein Angebot, bevor die Arbeit beginnt.',
    factors:['Anzahl der Arbeitsschritte und beteiligten Personen','Vorhandene Software und verfügbare Schnittstellen','Umfang von Umsetzung, Einführung und Betreuung'],
    steps:[{title:'Den Engpass verstehen',text:'Wir schauen uns den tatsächlichen Ablauf und Ihre vorhandenen Werkzeuge an.'},{title:'Den Aufwand abwägen',text:'Wir stellen Verbesserung, Umsetzungskosten und laufenden Aufwand gegenüber.'},{title:'Im Alltag einführen',text:'Wir setzen um, testen den Ablauf und begleiten Ihr Team beim Einstieg.'}],
    closing:'Welcher Ablauf kostet Sie zu viel Zeit?'
  },
  'apps-it-projekte': {
    label:'Apps & IT-Projekte',title:'Ihre Arbeit verdient\nbessere Werkzeuge.',
    lead:'Eine App für unterwegs, ein Portal für Ihre Kunden oder eine Verbindung zwischen zwei Systemen. Wir entwickeln die Lösung, die Ihrem Betrieb fehlt.',
    resultTitle:'Die passende Anwendung.\nFür Ihre tatsächliche Arbeit.',resultText:'Aus einer klar beschriebenen Aufgabe wird eine Anwendung, die Ihr Team testen und mitgestalten kann. Der Umfang bleibt überschaubar und wird vorab vereinbart.',
    situations:[{title:'Unterwegs arbeiten',text:'Zeiten, Fotos, Material und Notizen direkt beim Einsatz erfassen und im Büro verfügbar machen.'},{title:'Zusammenarbeit vereinfachen',text:'Kunden und Mitarbeitenden einen gemeinsamen Ort für Informationen, Dokumente und Freigaben geben.'},{title:'Systeme verbinden',text:'Daten zwischen bestehenden Werkzeugen übertragen und wiederkehrende manuelle Arbeit reduzieren.'}],
    included:['Einen klar vereinbarten Funktionsumfang','Ein Bedienkonzept und früh testbare Zwischenstände','Entwicklung und Tests mit den vorgesehenen Abläufen','Einführung, Dokumentation und vereinbarte Übergabe'],
    before:'Mitarbeitende schreiben Rapporte unterwegs auf. Im Büro werden die Angaben übertragen. Fehlende Details führen zu Rückfragen.',
    after:'Der Rapport wird direkt in einer App erfasst. Das Büro prüft die Angaben und gibt sie für die Abrechnung frei.',
    scope:'Ihre Anforderungen stehen bereits fest? Dann starten wir direkt mit dem IT-Projekt. Eine vorgängige Betriebsanalyse müssen Sie dafür nicht buchen.',
    cost:'Auch ein einzelnes Werkzeug oder eine kleine Schnittstelle ist ein vollständiges Projekt. Entscheidend sind die Funktionen, die Sie tatsächlich brauchen.',
    factors:['Funktionen, Nutzerrollen und benötigte Plattformen','Schnittstellen, Datenübernahme und Zugriffsrechte','Betrieb, Wartung und spätere Erweiterungen'],
    steps:[{title:'Auftrag abgrenzen',text:'Wir halten fest, was die Anwendung können muss und welche Systeme beteiligt sind.'},{title:'Früh ausprobieren',text:'Sie sehen Zwischenstände und prüfen sie an konkreten Aufgaben aus Ihrem Betrieb.'},{title:'Sauber übergeben',text:'Die Anwendung wird eingeführt. Hosting und Betreuung vereinbaren wir auf Wunsch dazu.'}],
    closing:'Welche Anwendung würde Ihre Arbeit leichter machen?'
  },
  websites: {
    label:'Websites & Betrieb',title:'Damit aus Besuchern\nAnfragen werden.',
    lead:'Ihr Angebot verdient einen Auftritt, der es verständlich macht. Wir entwickeln Inhalt, Gestaltung und Technik — und kümmern uns auf Wunsch auch um den Betrieb.',
    resultTitle:'In wenigen Augenblicken\nverstanden.',resultText:'Was bieten Sie an? Für wen ist es relevant? Warum sollte jemand mit Ihnen arbeiten? Ihre Website muss diese Fragen klar beantworten und den nächsten Schritt leicht machen.',
    situations:[{title:'Ein neuer Auftritt',text:'Die Website passt nicht mehr zu Ihrem Unternehmen, Ihrem Angebot oder dem Anspruch Ihrer Kunden.'},{title:'Mehr Klarheit',text:'Besucher müssen lange suchen, bevor sie Ihre Leistung verstehen oder Kontakt aufnehmen können.'},{title:'Weniger Aufwand im Betrieb',text:'Anfragen, Terminwünsche oder häufig benötigte Informationen lassen sich besser über die Website organisieren.'}],
    included:['Seitenstruktur und verständliche Inhalte','Ein eigenständiges Design für Ihr Unternehmen','Entwicklung für Smartphone, Tablet und Desktop','Technische Veröffentlichung und vereinbarte Einführung'],
    before:'Das Angebot verteilt sich auf viele Texte. Leistungen bleiben abstrakt. Der Weg zur Anfrage ist umständlich.',
    after:'Ein klarer Einstieg, anschauliche Beispiele und gut auffindbare Leistungen führen zu einer einfachen Kontaktmöglichkeit.',
    scope:'Sie erhalten einen Ansprechpartner für Inhalt, Gestaltung und Technik. Auch eine gezielte Überarbeitung oder eine zusätzliche Funktion ist möglich.',
    cost:'Der Umfang ergibt sich aus den Seiten, den vorhandenen Inhalten und den benötigten Funktionen. Einmalige Projektkosten und laufender Betrieb werden getrennt ausgewiesen.',
    factors:['Anzahl und Inhalt der Seiten','Bildmaterial, Sprachen und besondere Funktionen','Formulare, Buchungen und Anbindungen an andere Systeme'],
    steps:[{title:'Angebot auf den Punkt bringen',text:'Wir klären Zielkunden, Leistungen und den gewünschten nächsten Schritt.'},{title:'Den Auftritt entwickeln',text:'Sie sehen das Design im Browser. Wir prüfen Darstellung, Bedienung und Inhalte.'},{title:'Veröffentlichen und betreuen',text:'Die Website geht online. Hosting, Pflege und Weiterentwicklung sind auf Wunsch dabei.'}],
    closing:'Passt Ihr Auftritt noch zu Ihrem Unternehmen?'
  },
  'betrieb-betreuung': {
    label:'Betrieb & Betreuung',title:'Nach dem Start\nbleiben wir dran.',
    lead:'Eine Website oder Anwendung muss gepflegt werden. Wir übernehmen den vereinbarten Betrieb, kümmern uns um Änderungen und entwickeln Ihre Lösung weiter.',
    resultTitle:'Klar geregelt.\nAuch nach der Veröffentlichung.',resultText:'Sie wissen, wer sich kümmert, was die Betreuung umfasst und welche Kosten laufend anfallen. Neue Anforderungen besprechen wir, bevor zusätzlicher Aufwand entsteht.',
    situations:[{title:'Technik betreiben',text:'Hosting und die technischen Grundlagen Ihrer Website oder Anwendung betreuen.'},{title:'Aktuell bleiben',text:'Vereinbarte Updates, Fehlerbehebungen und Inhaltsänderungen erledigen.'},{title:'Weiterentwickeln',text:'Neue Funktionen oder verbesserte Abläufe ergänzen, wenn Ihr Betrieb sie braucht.'}],
    included:['Einen schriftlich festgelegten Betreuungsumfang','Nachvollziehbare laufende Kosten','Vereinbarte Kontaktwege und Reaktionszeiten','Eine klare Abgrenzung für zusätzliche Arbeiten'],
    before:'Die Website ist veröffentlicht. Bei Änderungen oder Problemen ist unklar, wer zuständig ist und was die Behebung kostet.',
    after:'Betrieb und Betreuung sind vereinbart. Sie haben einen direkten Ansprechpartner und wissen, wie Änderungen beauftragt werden.',
    scope:'Für bestehende Lösungen klären wir zuerst, ob eine Übernahme sinnvoll und technisch möglich ist. Sicherungen, Überwachung und Reaktionszeiten werden passend zum System vereinbart.',
    cost:'Der laufende Preis richtet sich nach Infrastruktur, Pflegebedarf und gewünschter Unterstützung. Zusätzliche Entwicklungsprojekte erhalten einen eigenen Umfang.',
    factors:['Art und Umfang der technischen Infrastruktur','Vereinbarte Pflege und Supportzeiten','Sicherungen, Kontrolle und Änderungsbedarf'],
    steps:[{title:'Ausgangslage klären',text:'Wir prüfen System, Zugänge, Abhängigkeiten und die gewünschte Unterstützung.'},{title:'Betreuung festlegen',text:'Umfang, Kontaktwege, Reaktionszeiten und laufende Kosten werden vereinbart.'},{title:'Verlässlich weiterarbeiten',text:'Wir übernehmen die vereinbarten Aufgaben und besprechen zusätzliche Änderungen mit Ihnen.'}],
    closing:'Wer kümmert sich um Ihre digitale Lösung?'
  }
};
