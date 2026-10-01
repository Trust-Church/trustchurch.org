// src/app/volunteer/[id]/apply/layout.tsx

import type { Metadata } from "next";
import { headers } from "next/headers";

type Career = {
  id: string;
  title: string;
};

type CareerResponse = {
  career?: Career | null;
};

async function getBaseUrl() {
  const headerStore =
    await headers();

  const host =
    headerStore.get(
      "x-forwarded-host"
    ) ||
    headerStore.get("host");

  const protocol =
    headerStore.get(
      "x-forwarded-proto"
    ) ||
    (process.env.NODE_ENV ===
    "production"
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
    const baseUrl =
      await getBaseUrl();

    const response =
      await fetch(
        `${baseUrl}/api/volunteer/${encodeURIComponent(
          id
        )}`,
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}): Promise<Metadata> {
  const { id } =
    await params;

  const career =
    await getCareer(id);

  const title = career
    ? `Apply for ${career.title}`
    : "Volunteer Application";

  const description =
    career
      ? `Apply for the ${career.title} volunteer opportunity with Trust Church.`
      : "Submit a volunteer application to Trust Church.";

  return {
    title,

    description,

    robots: {
      index: false,
      follow: true,

      googleBot: {
        index: false,
        follow: true,
      },
    },

    openGraph: {
      title: `${title} | Trust Church`,
      description,
      siteName: "Trust Church",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: "Trust Church",
        },
      ],
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        `${title} | Trust Church`,

      description,

      images: [
        "/logo.png",
      ],

      creator:
        "@TrustChurchOrg",
    },
  };
}

export default function ApplyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}