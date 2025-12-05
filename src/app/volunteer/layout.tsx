// src/app/volunteer/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Explore current volunteer opportunities at Trust Church. Serve with your gifts and help us bring hope, healing, and transformation to our community.",
  alternates: {
    canonical: "/volunteer",
  },
  openGraph: {
    title: "Volunteer Opportunities",
    description:
      "Join Trust Church in serving our city—see open roles and ways to get involved.",
    url: "https://trustchurch.org/volunteer",
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
    title: "Volunteer Opportunities",
    description:
      "Serve with Trust Church—find roles and start making a difference.",
    images: ["/logo.png"],
    creator: "@trust_church",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Volunteer Opportunities | Trust Church",
    url: "https://trustchurch.org/volunteer",
    isPartOf: {
      "@type": "WebSite",
      name: "Trust Church",
      url: "https://trustchurch.org",
    },
    description:
      "Discover volunteer opportunities at Trust Church and get involved in ministry, outreach, and events.",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://trustchurch.org" },
        { "@type": "ListItem", position: 2, name: "Volunteer", item: "https://trustchurch.org/volunteer" },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
