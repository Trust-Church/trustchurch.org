// src/app/volunteer/[id]/layout.tsx

import type { Metadata } from "next";
import { headers } from "next/headers";

type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

type Career = {
  id: string;
  title: string;
  subTitle?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  positionDetails?: string;
  salaryRange?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  active?: boolean;
  postedAt?: FirestoreTimestamp;
};

type CareerResponse = {
  career?: Career | null;
};

async function getBaseUrl() {
  const headerStore = await headers();

  const host =
    headerStore.get("x-forwarded-host") ||
    headerStore.get("host");

  const protocol =
    headerStore.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production"
      ? "https"
      : "http");

  if (host) {
    return `${protocol}://${host}`;
  }

  return "https://trustchurch.org";
}

async function getCareer(
  id: string
): Promise<Career | null> {
  try {
    const baseUrl = await getBaseUrl();

    const response = await fetch(
      `${baseUrl}/api/volunteer/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data =
      (await response.json()) as CareerResponse;

    return data.career ?? null;
  } catch {
    return null;
  }
}

function createDescription(
  career: Career
): string {
  if (career.subTitle?.trim()) {
    return career.subTitle.trim().slice(0, 160);
  }

  if (career.positionDetails?.trim()) {
    const plainText = career.positionDetails
      .replace(/\s+/g, " ")
      .trim();

    return plainText.length > 157
      ? `${plainText.slice(0, 157)}...`
      : plainText;
  }

  return `Learn about the ${career.title} volunteer opportunity at Trust Church and find out how you can serve.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}): Promise<Metadata> {
  const { id } = await params;

  const career = await getCareer(id);

  if (!career) {
    return {
      title: "Volunteer Opportunity",

      description:
        "Explore volunteer opportunities at Trust Church.",

      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const description = createDescription(career);

  const canonicalPath = `/volunteer/${encodeURIComponent(
    career.id
  )}`;

  return {
    title: career.title,

    description,

    alternates: {
      canonical: canonicalPath,
    },

    openGraph: {
      title: `${career.title} | Trust Church`,

      description,

      url: `https://trustchurch.org${canonicalPath}`,

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

      title: `${career.title} | Trust Church`,

      description,

      images: ["/logo.png"],

      creator: "@TrustChurchOrg",
    },

    robots: {
      index: career.active !== false,
      follow: true,

      googleBot: {
        index: career.active !== false,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export default async function CareerLayout({
  children,
  params,
}: {
  children: React.ReactNode;

  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const career = await getCareer(id);

  const canonicalUrl =
    `https://trustchurch.org/volunteer/${encodeURIComponent(
      id
    )}`;

  const jsonLd = career
    ? {
        "@context": "https://schema.org",

        "@type": "WebPage",

        name: `${career.title} | Trust Church`,

        url: canonicalUrl,

        description: createDescription(career),

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
              item:
                "https://trustchurch.org/volunteer",
            },

            {
              "@type": "ListItem",
              position: 3,
              name: career.title,
              item: canonicalUrl,
            },
          ],
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}

      {children}
    </>
  );
}