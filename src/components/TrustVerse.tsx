"use client";

import { useEffect, useState } from "react";

type VerseResponse = {
  text?: string;
  verse?: string;
  reference?: string;
  url?: string;
};

type Verse = {
  text: string;
  reference: string;
  url?: string;
};

const DEFAULT_VERSE: Verse = {
  text: "Blessed is the one who trusts in the Lord, whose confidence is in him.",
  reference: "Jeremiah 17:7",
  url: "https://www.bible.com/bible/111/JER.17.7.NIV",
};

export default function TrustVerse() {
  const [verse, setVerse] = useState<Verse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVerse() {
      try {
        const response = await fetch("/api/trust-verse", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Trust verse request failed with status ${response.status}`
          );
        }

        const data: VerseResponse = await response.json();

        const text =
          typeof data.text === "string"
            ? data.text.trim()
            : typeof data.verse === "string"
              ? data.verse.trim()
              : "";

        const reference =
          typeof data.reference === "string"
            ? data.reference.trim()
            : "";

        const url =
          typeof data.url === "string"
            ? data.url.trim()
            : "";

        if (!text || !reference) {
          throw new Error(
            "Trust verse API returned an invalid response."
          );
        }

        if (!cancelled) {
          setVerse({
            text,
            reference,
            url: url || undefined,
          });
        }
      } catch (error) {
        console.error("Unable to load trust verse:", error);

        if (!cancelled) {
          setVerse(DEFAULT_VERSE);
        }
      }
    }

    loadVerse();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className="border-t border-[#dcdcd3] pt-7">
      <div className="mb-9 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-[#6c7067]">
        <span className="h-[7px] w-[7px] rounded-full bg-[#657052]" />
        <span>Trust Verse</span>
      </div>

      {verse ? (
        <>
          <blockquote className="font-serif text-2xl leading-snug tracking-[-0.025em] sm:text-3xl">
            “{verse.text}”
          </blockquote>

          {verse.url ? (
            <a
              href={verse.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm text-[#6c7067] underline decoration-[#c9c8bf] underline-offset-4 transition-colors hover:text-[#1b1d19]"
              aria-label={`Read ${verse.reference} in the NIV on Bible.com`}
            >
              {verse.reference} · NIV
            </a>
          ) : (
            <p className="mt-6 text-sm text-[#6c7067]">
              {verse.reference}
            </p>
          )}
        </>
      ) : (
        <div className="min-h-[150px]" aria-hidden="true" />
      )}
    </aside>
  );
}