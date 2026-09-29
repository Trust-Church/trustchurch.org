"use client";

import {
  use,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

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

function formatPostedAt(
  ts?: FirestoreTimestamp
) {
  if (
    !ts ||
    typeof ts._seconds !== "number"
  ) {
    return undefined;
  }

  return new Date(
    ts._seconds * 1000
  ).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CareerPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);

  const [
    career,
    setCareer,
  ] = useState<Career | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await fetch(
          `/api/volunteer/${id}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            "Volunteer opportunity not found"
          );
        }

        const data =
          await res.json();

        setCareer(
          data.career ?? null
        );
      } catch (error) {
        console.error(error);

        setCareer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#f5f3ed]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
          <p className="text-[#6c7067]">
            Loading opportunity…
          </p>
        </div>
      </main>
    );
  }

  if (!career) {
    return (
      <main className="min-h-[60vh] bg-[#f5f3ed]">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
            Volunteer
          </p>

          <h1 className="font-serif text-5xl tracking-[-0.045em]">
            Opportunity not found.
          </h1>

          <Link
            href="/volunteer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            ← Back to volunteer opportunities
          </Link>
        </div>
      </main>
    );
  }

  const postedAt =
    formatPostedAt(
      career.postedAt
    );

  const meta = [
    career.department && {
      label: "Department",
      value: career.department,
    },

    career.location && {
      label: "Location",
      value: career.location,
    },

    career.employmentType && {
      label: "Commitment",
      value:
        career.employmentType,
    },

    career.salaryRange && {
      label: "Compensation",
      value:
        career.salaryRange,
    },

    postedAt && {
      label: "Posted",
      value: postedAt,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
  }[];

  return (
    <main className="bg-[#f5f3ed] text-[#1b1d19]">
      <section className="border-b border-[#dcdcd3] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            href="/volunteer"
            className="inline-flex items-center gap-2 text-sm text-[#6c7067] underline-offset-4 hover:text-[#1b1d19] hover:underline"
          >
            ← Back to opportunities
          </Link>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)] lg:items-end">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
                  Volunteer opportunity
                </p>

                {typeof career.active ===
                  "boolean" && (
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      career.active
                        ? "border-[#9ca88a] bg-[#e4e8dc] text-[#526040]"
                        : "border-[#d0d0c9] bg-[#e9e8e3] text-[#777972]"
                    }`}
                  >
                    {career.active
                      ? "Open"
                      : "Closed"}
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl font-serif text-[clamp(3.5rem,7vw,6.5rem)] font-normal leading-[0.95] tracking-[-0.055em]">
                {career.title}
              </h1>

              {career.subTitle && (
                <p className="mt-8 max-w-2xl text-xl leading-8 text-[#6c7067]">
                  {career.subTitle}
                </p>
              )}
            </div>

            {meta.length > 0 && (
              <dl className="border-t border-[#dcdcd3]">
                {meta.map(
                  (item) => (
                    <div
                      key={
                        item.label
                      }
                      className="grid grid-cols-[110px_1fr] gap-4 border-b border-[#dcdcd3] py-4 text-sm"
                    >
                      <dt className="text-[#8c8f86]">
                        {
                          item.label
                        }
                      </dt>

                      <dd className="m-0 text-[#1b1d19]">
                        {
                          item.value
                        }
                      </dd>
                    </div>
                  )
                )}
              </dl>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 lg:py-28">
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:px-12">
          <article className="max-w-3xl">
            {career.positionDetails && (
              <section className="border-b border-[#dcdcd3] pb-16">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
                  The opportunity
                </p>

                <div className="whitespace-pre-line text-lg leading-8 text-[#4f534c]">
                  {
                    career.positionDetails
                  }
                </div>
              </section>
            )}

            {career
              .responsibilities
              ?.length ? (
              <section className="border-b border-[#dcdcd3] py-16">
                <h2 className="font-serif text-4xl font-normal tracking-[-0.04em]">
                  Responsibilities
                </h2>

                <ul className="mt-8 space-y-5">
                  {career.responsibilities.map(
                    (
                      item,
                      index
                    ) => (
                      <li
                        key={`resp-${index}`}
                        className="grid grid-cols-[24px_1fr] gap-4 leading-7 text-[#5d6159]"
                      >
                        <span className="text-[#657052]">
                          —
                        </span>

                        <span>
                          {
                            item
                          }
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </section>
            ) : null}

            {career
              .requirements
              ?.length ? (
              <section className="border-b border-[#dcdcd3] py-16">
                <h2 className="font-serif text-4xl font-normal tracking-[-0.04em]">
                  What we're looking
                  for
                </h2>

                <ul className="mt-8 space-y-5">
                  {career.requirements.map(
                    (
                      item,
                      index
                    ) => (
                      <li
                        key={`req-${index}`}
                        className="grid grid-cols-[24px_1fr] gap-4 leading-7 text-[#5d6159]"
                      >
                        <span className="text-[#657052]">
                          —
                        </span>

                        <span>
                          {
                            item
                          }
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </section>
            ) : null}

            {career
              .benefits
              ?.length ? (
              <section className="py-16">
                <h2 className="font-serif text-4xl font-normal tracking-[-0.04em]">
                  What you'll gain
                </h2>

                <ul className="mt-8 space-y-5">
                  {career.benefits.map(
                    (
                      item,
                      index
                    ) => (
                      <li
                        key={`ben-${index}`}
                        className="grid grid-cols-[24px_1fr] gap-4 leading-7 text-[#5d6159]"
                      >
                        <span className="text-[#657052]">
                          —
                        </span>

                        <span>
                          {
                            item
                          }
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </section>
            ) : null}
          </article>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="bg-[#20241e] p-7 text-[#f7f6f1]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#abb69a]">
                Interested?
              </p>

              <h2 className="mt-5 font-serif text-3xl font-normal tracking-[-0.035em]">
                Join the work.
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/60">
                Tell us a little
                about yourself and
                how you would like
                to contribute.
              </p>

              {career.active !==
              false ? (
                <Link
                  href={`/volunteer/${career.id}/apply`}
                  className="mt-7 flex min-h-12 items-center justify-between bg-[#f7f6f1] px-5 text-sm font-semibold text-[#20241e]"
                >
                  Apply

                  <span aria-hidden="true">
                    →
                  </span>
                </Link>
              ) : (
                <p className="mt-7 border-t border-white/10 pt-5 text-sm text-white/50">
                  This opportunity
                  is no longer
                  accepting
                  applications.
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}