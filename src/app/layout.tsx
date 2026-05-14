import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yusuf Arca Çiçek — Portfolio OS",
  description: "Interactive bilingual web-based operating system portfolio.",
  manifest: "/portfolio2/manifest.webmanifest",
  icons: {
    icon: "/portfolio2/icon.svg",
    apple: "/portfolio2/icon.svg",
  },
  openGraph: {
    title: "Yusuf Arca Çiçek — Portfolio OS",
    description: "Interactive bilingual web-based operating system portfolio.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#22d3ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
