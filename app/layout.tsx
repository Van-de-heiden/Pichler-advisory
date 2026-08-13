import type { Metadata } from "next";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/500-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pichler Advisory – Prozessoptimierung für Schweizer KMU",
  description: "Pichler Advisory vereinfacht gewachsene Betriebsabläufe, verbindet bestehende Systeme und automatisiert wiederkehrende Arbeit.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
