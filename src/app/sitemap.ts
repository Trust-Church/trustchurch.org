// src/app/sitemap.ts

import type {
  MetadataRoute,
} from "next";

type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

type Career = {
  id: string;
  active?: boolean;
  postedAt?: FirestoreTimestamp;
};

type CareersResponse = {
  careers?: Career[];
};

const SITE_URL =
  "https://trustchurch.org";

async function getCareers(): Promise<
  Career[]
> {
  try {
    const response =
      await fetch(
        `${SITE_URL}/api/volunteer`,
        {
          next: {
            revalidate: 3600,
          },
        }
      );

    if (!response.ok) {
      return [];
    }

    const data =
      (await response.json()) as CareersResponse;

    return data.careers ?? [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<
  MetadataRoute.Sitemap
> {
  const careers =
    await getCareers();

  const staticPages:
    MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency:
        "weekly",
      priority: 1,
    },

    {
      url: `${SITE_URL}/about`,
      changeFrequency:
        "monthly",
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/volunteer`,
      changeFrequency:
        "daily",
      priority: 0.9,
    },
  ];

  const volunteerPages:
    MetadataRoute.Sitemap =
    careers
      .filter(
        (career) =>
          career.active !== false
      )
      .map((career) => {
        const lastModified =
          career.postedAt?._seconds
            ? new Date(
                career.postedAt
                  ._seconds *
                  1000
              )
            : undefined;

        return {
          url:
            `${SITE_URL}/volunteer/${encodeURIComponent(
              career.id
            )}`,

          ...(lastModified
            ? {
                lastModified,
              }
            : {}),

          changeFrequency:
            "weekly" as const,

          priority: 0.8,
        };
      });

  return [
    ...staticPages,
    ...volunteerPages,
  ];
}