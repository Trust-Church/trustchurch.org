"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Career {
  id: string;
  title: string;
  subTitle?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  positionDetails?: string;
}

export default function VolunteersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const res = await fetch("/api/volunteer");

        if (!res.ok) {
          throw new Error("Failed to fetch volunteer opportunities");
        }

        const data = await res.json();

        setCareers(data.careers || []);
      } catch (err) {
        console.error("Error fetching careers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  return (
    <main className="bg-[#f5f3ed] text-[#1b1d19]">
      {/* Hero */}
      <section className="border-b border-[#dcdcd3] py-20 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
              Volunteer
            </p>

            <h1 className="font-serif text-[clamp(3.75rem,7vw,6.75rem)] font-normal leading-[0.94] tracking-[-0.055em]">
              Put your gifts
              <br />
              <span className="italic text-[#657052]">
                into action.
              </span>
            </h1>

            <p className="mt-9 max-w-2xl text-lg leading-8 text-[#6c7067] sm:text-xl">
              Serve alongside people who want to love God deeply and love
              people practically. Explore current opportunities to contribute
              your time, skills, and experience.
            </p>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-col gap-4 border-b border-[#dcdcd3] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
                Current opportunities
              </p>

              <h2 className="font-serif text-4xl font-normal tracking-[-0.04em] sm:text-5xl">
                Currently seeking
              </h2>
            </div>

            {!loading && (
              <p className="text-sm text-[#6c7067]">
                {careers.length}{" "}
                {careers.length === 1 ? "opportunity" : "opportunities"}
              </p>
            )}
          </div>

          {loading ? (
            <div className="border-b border-[#dcdcd3] py-16">
              <p className="text-[#6c7067]">
                Loading opportunities…
              </p>
            </div>
          ) : careers.length === 0 ? (
            <div className="border-b border-[#dcdcd3] py-16">
              <h3 className="font-serif text-3xl tracking-[-0.03em]">
                Nothing open right now.
              </h3>

              <p className="mt-4 max-w-xl leading-7 text-[#6c7067]">
                We do not have any volunteer opportunities posted at the
                moment. Check back soon as new ways to serve become available.
              </p>
            </div>
          ) : (
            <div className="border-t border-[#dcdcd3]">
              {careers.map((career, index) => (
                <Link
                  key={career.id}
                  href={`/volunteer/${career.id}`}
                  className="group grid gap-6 border-b border-[#dcdcd3] py-8 text-inherit no-underline transition-colors hover:bg-[#fbfaf6] sm:px-4 lg:grid-cols-[60px_minmax(0,1fr)_260px_40px] lg:items-center"
                >
                  <span className="font-mono text-xs text-[#90928b]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="font-serif text-3xl font-normal tracking-[-0.035em] transition-colors group-hover:text-[#657052]">
                      {career.title}
                    </h3>

                    {career.subTitle && (
                      <p className="mt-2 text-sm leading-6 text-[#6c7067]">
                        {career.subTitle}
                      </p>
                    )}

                    {career.positionDetails && (
                      <p className="mt-4 max-w-2xl line-clamp-2 text-sm leading-6 text-[#6c7067]">
                        {career.positionDetails}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6c7067] lg:flex-col lg:gap-1">
                    {career.department && (
                      <span>{career.department}</span>
                    )}

                    {career.location && (
                      <span>{career.location}</span>
                    )}

                    {career.employmentType && (
                      <span>{career.employmentType}</span>
                    )}
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-xl transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Closing statement */}
      <section className="pb-24 sm:pb-28 lg:pb-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-12 bg-[#20241e] px-6 py-12 text-[#f7f6f1] sm:px-10 lg:grid-cols-[0.6fr_1.4fr] lg:px-16 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#abb69a]">
              Why volunteer
            </p>

            <div>
              <h2 className="max-w-3xl font-serif text-[clamp(2.8rem,5vw,4.75rem)] font-normal leading-[1.02] tracking-[-0.045em]">
                Service is one way faith becomes visible.
              </h2>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/60">
                Whether you bring professional skills, practical experience,
                creativity, compassion, or simply a willingness to help,
                there is value in showing up for others.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}