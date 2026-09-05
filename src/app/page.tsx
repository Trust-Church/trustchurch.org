"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";

type TrustVersePayload = {
  verse?: string;
  text?: string;
  passage?: string;
  message?: string;
  reference?: string;
  ref?: string;
  [key: string]: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(obj: Record<string, unknown>, key: string): string | undefined {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}

function extractVerse(payload: TrustVersePayload): { text: string; reference?: string } {
  if (!isRecord(payload)) return { text: "" };
  const text =
    getString(payload, "verse") ||
    getString(payload, "text") ||
    getString(payload, "passage") ||
    getString(payload, "message") ||
    "";
  const reference = getString(payload, "reference") || getString(payload, "ref") || undefined;
  return { text, reference };
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "loading" | "success" | "error">(null);
  const [count, setCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);

  const [verseText, setVerseText] = useState<string>("");
  const [verseRef, setVerseRef] = useState<string | undefined>(undefined);
  const [loadingVerse, setLoadingVerse] = useState<boolean>(false);
  const [verseError, setVerseError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      setLoadingCount(true);
      const res = await fetch(`/api/subscribers/count`, { method: "GET" });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Count failed (HTTP ${res.status}) – ${text}`);
      }
      const data = (await res.json()) as { totalSubscribers: number };
      setCount(typeof data.totalSubscribers === "number" ? data.totalSubscribers : null);
    } catch (err) {
      console.error(err);
      setCount(null);
    } finally {
      setLoadingCount(false);
    }
  }, []);

  const fetchVerse = useCallback(async () => {
    try {
      setLoadingVerse(true);
      setVerseError(null);
      const res = await fetch(`/api/trust-verse`, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Verse request failed (HTTP ${res.status}) – ${body}`);
      }
      const payload = (await res.json()) as TrustVersePayload;
      const { text, reference } = extractVerse(payload);
      setVerseText(text);
      setVerseRef(reference);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to load verse";
      setVerseError(message);
      setVerseText("");
      setVerseRef(undefined);
    } finally {
      setLoadingVerse(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    fetchVerse();
  }, [fetchCount, fetchVerse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setEmail("");

      await fetchCount();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="font-sans grid min-h-screen grid-rows-[auto_1fr_auto] items-center justify-items-center px-8 pt-6 pb-10 sm:px-10 sm:pt-10 sm:pb-12">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-[500px]">
        <div className="flex justify-center w-full">
          <Image src="/logo.png" alt="Homepage logo" width={150} height={150} priority />
        </div>

        {/* Trust Verse Card */}
        <section className="w-full rounded-2xl border p-4 sm:p-6 shadow-sm">
          <div className="mb-3">
            <h2 className="text-base sm:text-lg font-semibold tracking-tight">Trust Verse</h2>
          </div>
          {verseError ? (
            <p className="text-sm text-red-600">{verseError}</p>
          ) : loadingVerse && !verseText ? (
            <p className="text-sm text-gray-500">Loading verse…</p>
          ) : verseText ? (
            <blockquote className="text-sm sm:text-base leading-relaxed">
              <p className="italic">“{verseText}”</p>
              {verseRef && <cite className="not-italic block mt-2 text-xs sm:text-sm text-gray-600">— {verseRef}</cite>}
            </blockquote>
          ) : (
            <p className="text-sm text-gray-500">No verse available right now.</p>
          )}
        </section>

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="tracking-[-.01em]">Find God&apos;s Community</li>
          <li className="mb-2 tracking-[-.01em]">Join our email list for upcoming apps and news</li>
        </ol>

        <form onSubmit={handleSubmit} className="flex gap-4 items-center flex-col sm:flex-row w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="rounded-md border px-4 py-2 text-sm sm:text-base w-full sm:w-64"
          />
          <button
            type="submit"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            disabled={status === "loading"}
          >
            Submit
          </button>
        </form>

        {status === "loading" && <p className="text-sm text-gray-500">Submitting...</p>}
        {status === "success" && (
          <>
            <p className="text-sm text-green-600">Welcome to God’s community!</p>
            <p className="text-sm text-gray-500">
              You’re now part of something bigger — welcome to Trust Church!
              <br />
              Keep an eye on your inbox for ways to help grow God’s community.
            </p>
          </>
        )}
        {status === "error" && <p className="text-sm text-red-600">Something went wrong.</p>}

        <div className="text-lg text-gray-700">
          {loadingCount ? "Loading member count" : `Members: ${count ?? "—"}`}
        </div>

          
      </main>

        <Footer />


    </div>
  );
}
