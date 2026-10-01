import { NextResponse } from "next/server";

import {
  DEFAULT_TRUST_VERSE,
  getRandomTrustVerse,
  getTrustVerseById,
} from "@/lib/trustVerses";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");

    const verse = id
      ? getTrustVerseById(id)
      : getRandomTrustVerse();

    const selectedVerse =
      verse ?? DEFAULT_TRUST_VERSE;

    return NextResponse.json(
      {
        id: selectedVerse.id,
        reference: selectedVerse.reference,
        text: selectedVerse.text,
        url: selectedVerse.url,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error(
      "Error loading trust verse:",
      error
    );

    return NextResponse.json(
      {
        id: DEFAULT_TRUST_VERSE.id,
        reference: DEFAULT_TRUST_VERSE.reference,
        text: DEFAULT_TRUST_VERSE.text,
        url: DEFAULT_TRUST_VERSE.url,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=60",
        },
      }
    );
  }
}