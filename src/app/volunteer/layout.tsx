// src/app/volunteer/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer",

  description:
    "Explore current volunteer opportunities at Trust Church. Serve with your gifts and help bring hope, healing, and transformation to our communities.",

  alternates: {
    canonical: "/volunteer",
  },

  openGraph: {
    title: "Volunteer Opportunities | Trust Church",
    description:
      "Explore current opportunities to serve with Trust Church and put your gifts into action.",
    url: "https://trustchurch.org/volunteer",
    siteName: "Trust Church",

    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Trust Church",
      },
    ],

    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "Volunteer Opportunities | Trust Church",

    description:
      "Explore current opportunities to serve with Trust Church and put your gifts into action.",

    images: ["/logo.png"],

    creator: "@TrustChurchOrg",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function VolunteerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",

    name: "Volunteer Opportunities | Trust Church",

    url: "https://trustchurch.org/volunteer",

    description:
      "Explore current volunteer opportunities at Trust Church and find ways to serve using your gifts, experience, and time.",

    isPartOf: {
      "@type": "WebSite",
      name: "Trust Church",
      url: "https://trustchurch.org",
    },

    about: {
      "@type": "Organization",
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
          name: "Volunteer",
          item: "https://trustchurch.org/volunteer",
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {children}
    </>
  );
}