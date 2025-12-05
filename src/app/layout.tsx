import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Keep these in sync with Socials.tsx
const SOCIALS = [
  "https://instagram.com/trust_church",
  "https://github.com/trustchurch",
  "https://primal.net/trustchurch",
  "https://x.com/TrustChurchOrg",
] as const;

export const metadata: Metadata = {
  metadataBase: new URL("https://trustchurch.org"),
  title: { default: "Trust Church", template: "%s | Trust Church" },
  description:
    "Trust Church is a community built on faith, love, and discipleship. Join us in worship, connection, and purpose.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Trust Church",
    description:
      "Trust Church is a community built on faith, love, and discipleship. Discover our mission and join us at trustchurch.org.",
    url: "https://trustchurch.org",
    siteName: "Trust Church",
    images: [
      { url: "/logo.png", width: 1200, height: 630, alt: "Trust Church Logo" },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trust Church",
    description:
      "Trust Church is a community built on faith, love, and discipleship.",
    images: ["/logo.png"],
    creator: "@TrustChurchOrg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Trust Church",
    url: "https://trustchurch.org",
    logo: "https://trustchurch.org/logo.png",
    sameAs: [...SOCIALS],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          // Must be a string
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
