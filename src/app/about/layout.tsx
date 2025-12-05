// src/app/about/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Trust Church—our mission, vision, and commitment to loving God deeply and serving people practically.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us",
    description:
      "Discover the heart behind Trust Church—awakening hearts, uniting the Church, and stepping boldly into the mission of Christ.",
    url: "https://trustchurch.org/about",
    siteName: "Trust Church",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Trust Church Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us",
    description:
      "Learn about Trust Church’s mission to bring hope, healing, and transformation through Christ.",
    images: ["/logo.png"],
    creator: "@trust_church",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add JSON-LD structured data specific to the About page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Us | Trust Church",
    url: "https://trustchurch.org/about",
    isPartOf: {
      "@type": "WebSite",
      name: "Trust Church",
      url: "https://trustchurch.org",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://trustchurch.org",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: "https://trustchurch.org/about",
        },
      ],
    },
    // Optional: include a concise summary pulled from your About content
    description:
      "Trust Church exists to awaken hearts, unite the Church, and step boldly into the mission of Christ.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Prevent hydration mismatch warnings for inline JSON
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
