import NewsletterForm from "@/components/NewsletterForm";

export default function SubscribeCallout() {
  return (
    <section className="border-t border-[#dcdcd3] bg-[#fbfaf6] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
              Stay connected
            </p>

            <h2 className="font-serif text-[clamp(2.25rem,4vw,3.75rem)] font-normal leading-[1.05] tracking-[-0.04em]">
              Join God&apos;s community.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#6c7067]">
              Hear about new opportunities to serve, community updates, and
              ways to grow together in faith.
            </p>
          </div>

          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}