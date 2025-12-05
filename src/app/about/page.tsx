import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen px-6 pt-8 pb-16 gap-y-8 sm:px-12 sm:pt-12">
      <main className="flex flex-col items-center justify-start py-6 px-4">
        {/* Logo just above the content */}
        <Image
          src="/logo.png"
          alt="Homepage logo"
          width={150}
          height={150}
          priority
          className="mb-6"
        />

        <h1 className="text-3xl font-bold mb-6">About Us</h1>

        <div className="max-w-2xl text-justify text-lg text-gray-700 space-y-6">
          <p>
            At <span className="font-semibold">Trust Church</span>, we believe <span className="font-semibold">God</span> has
            called His people to something greater than Sunday services. We are
            here to awaken hearts, unite the Church, and step boldly into the
            mission of <span className="font-semibold">Christ</span> — bringing hope, healing, and transformation to a
            broken world.
          </p>

          <p>
            Our vision is simple, yet profound:{" "}
            <span className="italic">to love <span className="font-semibold">God</span> deeply and to love people practically.</span>{" "}
            That means moving beyond the walls of the church and into the
            streets, schools, and neighborhoods — wherever there is a need.
          </p>

          <p>
            We are not content with watching the world struggle in darkness. We
            believe the Church is <span className="font-semibold">God’s</span> answer. By donating time, resources, and
            love, we are committed to solving real problems, restoring dignity,
            and showing that faith is not passive — it’s alive, active, and
            world-changing.
          </p>

          <p>
            Trust Church exists to call people into this bigger mission: a life
            surrendered to <span className="font-semibold">Christ</span>, united in His body, and empowered by His
            Spirit to make a lasting difference. Together, we will shine His
            light, lift the broken, and bring glory to <span className="font-semibold">God</span> through good deeds
            and worship.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
