"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

type FirestoreTimestamp = { _seconds: number; _nanoseconds: number };

type Career = {
  id: string;
  title: string;
  subTitle?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  positionDetails?: string;

  // New fields from the API
  salaryRange?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  active?: boolean;
  postedAt?: FirestoreTimestamp;
};

function formatPostedAt(ts?: FirestoreTimestamp) {
  if (!ts || typeof ts._seconds !== "number") return undefined;
  return new Date(ts._seconds * 1000).toLocaleDateString();
}

export default function CareerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // unwrap the promise
  const { id } = use(params);

  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const go = async () => {
      try {
        const res = await fetch(`/api/volunteer/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setCareer(data.career ?? null);
      } finally {
        setLoading(false);
      }
    };
    go();
  }, [id]);

  if (loading) return <p className="p-6">Loading…</p>;
  if (!career) return <p className="p-6">Career not found.</p>;

  const postedAt = formatPostedAt(career.postedAt);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/volunteer" className="text-sm text-blue-700 hover:underline">
        ← Back to volunteer
      </Link>

      {/* Title row */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{career.title}</h1>
          {career.subTitle && (
            <h2 className="text-lg italic text-gray-700 mt-1">{career.subTitle}</h2>
          )}
        </div>

        {/* Active badge (if present) */}
        {typeof career.active === "boolean" && (
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
              career.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
            }`}
            aria-label={career.active ? "Position is active" : "Position is inactive"}
            title={career.active ? "Position is active" : "Position is inactive"}
          >
            {career.active ? "Active" : "Inactive"}
          </span>
        )}
      </div>

      {/* Meta details */}
      <div className="mt-6 grid gap-2 text-gray-700">
        {career.department && (
          <p>
            <strong>Department:</strong> {career.department}
          </p>
        )}
        {career.location && (
          <p>
            <strong>Location:</strong> {career.location}
          </p>
        )}
        {career.employmentType && (
          <p>
            <strong>Employment Type:</strong> {career.employmentType}
          </p>
        )}
        {career.salaryRange && (
          <p>
            <strong>Compensation:</strong> {career.salaryRange}
          </p>
        )}
        {postedAt && (
          <p>
            <strong>Posted:</strong> {postedAt}
          </p>
        )}
      </div>

      {/* Position description */}
      {career.positionDetails && (
        <div className="prose max-w-none mt-6 text-gray-900">
          {career.positionDetails}
        </div>
      )}

      {/* Lists */}
      <div className="mt-8 grid gap-6">
        {career.requirements?.length ? (
          <section>
            <h3 className="text-xl font-semibold">Requirements</h3>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              {career.requirements.map((item, i) => (
                <li key={`req-${i}`}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {career.responsibilities?.length ? (
          <section>
            <h3 className="text-xl font-semibold">Responsibilities</h3>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              {career.responsibilities.map((item, i) => (
                <li key={`resp-${i}`}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {career.benefits?.length ? (
          <section>
            <h3 className="text-xl font-semibold">Benefits</h3>
            <ul className="mt-2 list-disc ml-6 space-y-1">
              {career.benefits.map((item, i) => (
                <li key={`ben-${i}`}>{item}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {/* Apply button */}
      <div className="mt-10">
        <Link
          href={`/volunteer/${career.id}/apply`}
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Apply
        </Link>
      </div>
      <Footer />
    </div>
  );
}
