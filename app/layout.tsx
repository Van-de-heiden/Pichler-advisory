import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/500-italic.css";
import "./globals.css";
import "./refinement.css";
import { BRAND_REVEAL_BOOTSTRAP } from "./brand-reveal-session";


export const metadata: Metadata = {
  metadataBase: new URL("https://pichler-advisory.ch"),
  title: "Pichler Advisory | Beratung & Umsetzung",
  description: "Was jeden Tag Zeit kostet, kostet jedes Jahr Geld. Pichler Advisory verbindet Beratung mit Umsetzung: bessere Abläufe, Automatisierung, Apps und Websites für Schweizer Unternehmen.",
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BRAND_REVEAL_BOOTSTRAP }} />
        <noscript><style>{".reveal { display: none; }"}</style></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
