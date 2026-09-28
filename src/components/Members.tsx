"use client";

import { useEffect, useState } from "react";

export default function MemberCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadCount() {
      try {
        const response = await fetch("/api/subscribers", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (typeof data?.count === "number") {
          setCount(data.count);
        }
      } catch (error) {
        console.error("Unable to load member count:", error);
      }
    }

    loadCount();
  }, []);

  if (count === null) {
    return null;
  }

  return (
    <section className="border-t border-[#dcdcd3] bg-[#20241e] py-20 text-[#f7f6f1] sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.6fr_1.4fr] lg:items-end">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#abb69a]">
            God&apos;s community
          </p>

          <div>
            <p className="font-serif text-[clamp(4rem,9vw,8rem)] font-normal leading-none tracking-[-0.055em]">
              {count.toLocaleString()}
            </p>

            <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">
              believers connected with Trust Church and growing together in
              faith, service, and purpose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}