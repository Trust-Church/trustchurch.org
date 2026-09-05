import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BIBLE_API_KEY = process.env.BIBLE_API_KEY;
const BIBLE_BASE_URL = "https://api.scripture.api.bible/v1/bibles";

// NIV
const BIBLE_ID = "de4e12af7f28f599-02";

// Randomly selected when no ?ref= is provided
const verses = [
  "PRO.3.5-PRO.3.6", // Proverbs 3:5–6
  "PSA.37.5",
  "JER.17.7-JER.17.8",
  "ISA.26.3-ISA.26.4",
  "PSA.56.3-PSA.56.4",
  "NAM.1.7", // not found
  "PSA.28.7",
  "JHN.14.1",
  "2CO.5.7",
  "ROM.15.13",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const bibleId = searchParams.get("bibleId") || BIBLE_ID;

  const reference =
    searchParams.get("ref") ||
    verses[Math.floor(Math.random() * verses.length)];

  if (!BIBLE_API_KEY) {
    console.error("Missing BIBLE_API_KEY");

    return NextResponse.json(
      {
        reference,
        bibleId,
        error: "Failed to fetch verse",
      },
      { status: 500 }
    );
  }

  try {
    const isRange = reference.includes("-");
    const endpoint = isRange ? "passages" : "verses";

    const url = new URL(
      `${BIBLE_BASE_URL}/${bibleId}/${endpoint}/${encodeURIComponent(reference)}`
    );

    url.searchParams.set("content-type", "text");
    url.searchParams.set("include-verse-numbers", "false");
    url.searchParams.set("include-chapter-numbers", "false");
    url.searchParams.set("include-titles", "false");
    url.searchParams.set("include-notes", "false");

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "api-key": BIBLE_API_KEY,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          reference,
          bibleId,
          error:
            response.status === 404
              ? "Verse not found for this Bible"
              : "Failed to fetch verse",
          ...(process.env.NODE_ENV !== "production" && {
            details: data,
          }),
        },
        { status: response.status }
      );
    }

    const content = data?.data?.content ?? "";
    const returnedReference = data?.data?.reference ?? reference;
    const verseId = data?.data?.id ?? null;

    return NextResponse.json(
      {
        reference: returnedReference,
        verseId,
        bibleId,
        text: content,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching trust verse:", error);

    return NextResponse.json(
      {
        reference,
        bibleId,
        error: "Failed to fetch verse",
        ...(process.env.NODE_ENV !== "production" && {
          details:
            error instanceof Error ? error.message : String(error),
        }),
      },
      { status: 500 }
    );
  }
}
