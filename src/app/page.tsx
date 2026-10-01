import Link from "next/link";

import Members from "@/components/Members";
import TrustVerse from "@/components/TrustVerse";
import NewsletterForm from "@/components/NewsletterForm";
import SubscribeCallout from "@/components/SubscribeCallout";

const principles = [
  {
    number: "01",
    title: "Connect",
    description:
      "Build meaningful relationships with believers who want to live their faith beyond Sunday.",
  },
  {
    number: "02",
    title: "Serve",
    description:
      "Give your time, resources, skills, and love where they can make a real difference.",
  },
  {
    number: "03",
    title: "Encourage",
    description:
      "Strengthen one another toward love, good works, and a life centered on Christ.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f5f3ed] text-[#1b1d19]">
      {/* Hero */}
      <section className="py-20 sm:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.65fr)] lg:items-end lg:gap-24">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
                Trust Church
              </p>

              <h1 className="max-w-5xl font-serif text-[clamp(3.75rem,8vw,7.25rem)] font-normal leading-[0.91] tracking-[-0.055em]">
                Love God.
                <br />
                Love people.
                <br />
                <span className="italic text-[#657052]">
                  Live it out.
                </span>
              </h1>

              <p className="mt-9 max-w-xl text-lg leading-8 tracking-[-0.015em] text-[#6c7067] sm:text-xl">
                A community of believers connecting, serving, and putting
                faith into action wherever there is a need.
              </p>

              <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
                <Link
                  href="/about"
                  className="inline-flex min-h-12 items-center justify-between gap-8 bg-[#1b1d19] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Our mission
                  <span aria-hidden="true">→</span>
                </Link>

                <Link
                  href="/volunteer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1b1d19] underline-offset-4 hover:underline"
                >
                  Find a way to serve
                  <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
            <TrustVerse />


          </div>
        </div>
      </section>

      <SubscribeCallout />

      {/* Purpose */}
      <section className="border-t border-[#dcdcd3] bg-[#fbfaf6] py-24 sm:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-20">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
              Our purpose
            </p>

            <div>
              <h2 className="max-w-5xl font-serif text-[clamp(2.7rem,5vw,5rem)] font-normal leading-[1.04] tracking-[-0.045em]">
                Faith was never meant to remain inside the walls of a church.
              </h2>

              <p className="mt-10 max-w-2xl text-lg leading-8 text-[#6c7067]">
                Trust Church exists to unite believers around a simple mission:
                love God deeply and love people practically. We want to help
                Christians turn conviction into action in their communities.
              </p>

              <Link
                href="/about"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                More about Trust Church
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* God's Community */}
      <Members />

      {/* Principles */}
      <section className="border-t border-[#dcdcd3] py-24 sm:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-16 max-w-3xl lg:mb-20">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
              How we live it
            </p>

            <h2 className="font-serif text-[clamp(2.7rem,4.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.04em]">
              Simple principles.
              <br />
              Meaningful action.
            </h2>
          </div>

          <div className="grid border-t border-[#dcdcd3] lg:grid-cols-3">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className={[
                  "flex min-h-[280px] flex-col justify-between py-8 lg:min-h-[320px] lg:pr-10",
                  index > 0
                    ? "border-t border-[#dcdcd3] lg:border-l lg:border-t-0 lg:pl-10"
                    : "",
                ].join(" ")}
              >
                <span className="mb-14 font-mono text-xs text-[#6c7067] lg:mb-0">
                  {principle.number}
                </span>

                <div>
                  <h3 className="font-serif text-4xl font-normal tracking-[-0.035em]">
                    {principle.title}
                  </h3>

                  <p className="mt-4 max-w-xs text-[15px] leading-7 text-[#6c7067]">
                    {principle.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Service */}
      <section className="pb-24 sm:pb-28 lg:pb-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid min-h-[560px] gap-20 bg-[#20241e] px-6 py-10 text-[#f7f6f1] sm:px-10 sm:py-12 lg:grid-cols-[0.55fr_1.45fr] lg:items-end lg:px-16 lg:py-16">
            <p className="self-start text-xs font-semibold uppercase tracking-[0.14em] text-[#abb69a]">
              Beyond Sunday
            </p>

            <div className="max-w-3xl">
              <h2 className="font-serif text-[clamp(3rem,5vw,5.25rem)] font-normal leading-[0.98] tracking-[-0.045em]">
                Meet people where the need is.
              </h2>

              <p className="mt-8 max-w-xl text-lg leading-8 text-white/60">
                In neighborhoods, schools, hospitals, homes, and communities,
                we believe faith should be visible through generosity,
                compassion, service, and good works.
              </p>

              <Link
                href="/volunteer"
                className="mt-8 inline-flex min-h-12 items-center gap-8 bg-[#f7f6f1] px-5 text-sm font-semibold text-[#20241e] transition-transform hover:-translate-y-0.5"
              >
                Find a way to serve
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-[#dcdcd3] py-24 sm:py-28 lg:py-32">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-28">
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
                Stay connected
              </p>

              <h2 className="font-serif text-[clamp(3rem,5vw,5rem)] font-normal tracking-[-0.045em]">
                Join God&apos;s community.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#6c7067]">
                Stay connected with Trust Church and hear about new projects,
                opportunities to serve, and ways to grow together in faith.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}