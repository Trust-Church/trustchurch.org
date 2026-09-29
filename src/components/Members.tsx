"use client";

import { useEffect, useState } from "react";

type CountState =
  | { status: "loading" }
  | { status: "success"; count: number }
  | { status: "error" };

export default function Members() {
  const [state, setState] = useState<CountState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      try {
        const response = await fetch("/api/subscribers/count", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Subscriber count request failed with status ${response.status}`
          );
        }

        const data = await response.json();
        const count = data?.totalSubscribers;

        if (
          typeof count !== "number" ||
          !Number.isFinite(count) ||
          count < 0
        ) {
          throw new Error(
            "Subscriber count API returned an invalid response."
          );
        }

        if (!cancelled) {
          setState({
            status: "success",
            count,
          });
        }
      } catch (error) {
        console.error("Unable to load member count:", error);

        if (!cancelled) {
          setState({
            status: "error",
          });
        }
      }
    }

    loadCount();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#20241e] text-[#f7f6f1]">
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/[0.04]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/[0.05]"
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-32">
        <div className="max-w-5xl">
          <div className="mb-12 flex items-center gap-4">
            <span className="h-2 w-2 rounded-full bg-[#abb69a]" />

            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#abb69a]">
              God&apos;s community
            </p>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {state.status === "loading" && (
            <div>
              <p className="font-serif text-[clamp(5rem,13vw,10rem)] font-normal leading-[0.82] tracking-[-0.065em] text-white/15">
                —
              </p>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-white/45">
                A growing community of believers living out their faith
                together.
              </p>
            </div>
          )}

          {state.status === "success" && (
            <>
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)] lg:items-end">
                <div>
                  <p className="font-serif text-[clamp(5rem,13vw,10rem)] font-normal leading-[0.82] tracking-[-0.065em]">
                    {state.count.toLocaleString()}
                  </p>

                  <p className="mt-7 font-serif text-[clamp(2rem,4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.04em] text-[#dfe4d7]">
                    {state.count === 1 ? "member" : "members"} .
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
                  <p className="text-lg leading-8 text-white/60">
                    Growing together in faith, service, and purpose.
                  </p>

                  <p className="mt-6 text-sm leading-6 text-white/40">
                    Every person represents another opportunity to encourage,
                    serve, and strengthen God&apos;s kingdom.
                  </p>
                </div>
              </div>

              <div className="mt-16 border-t border-white/10 pt-7">
                <p className="max-w-3xl font-serif text-2xl leading-snug tracking-[-0.025em] text-white/75 sm:text-3xl">
                  Not just a number. A community being built one person at a
                  time.
                </p>
              </div>
            </>
          )}

          {state.status === "error" && (
            <div>
              <h2 className="font-serif text-[clamp(3rem,6vw,5rem)] font-normal leading-[1] tracking-[-0.045em]">
                Our community is growing.
              </h2>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/55">
                Believers are connecting with Trust Church and growing together
                in faith, service, and purpose.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}