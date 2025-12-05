"use client"; // needed for hooks in Next.js App Router

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";

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
        const res = await fetch("/api/volunteer"); // clean alias route
        if (!res.ok) throw new Error("Failed to fetch careers");
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
    <div className="font-sans grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen px-6 pt-8 pb-16 gap-y-8 sm:px-12 sm:pt-12">
      <main className="flex flex-col items-center justify-start py-6 px-4 w-full">
        {/* Logo just above the content */}
        <Image
          src="/logo.png"
          alt="Homepage logo"
          width={150}
          height={150}
          priority
          className="mb-6"
        />

        <h1 className="text-3xl font-bold mb-6">Currently Seeking</h1>

        <div className="max-w-2xl text-center text-lg text-gray-700 space-y-6 w-full">
          {loading ? (
            <p className="text-gray-500">Loading opportunities...</p>
          ) : careers.length === 0 ? (
            <p className="text-gray-500">No opportunities posted yet.</p>
          ) : (
            <ul className="space-y-6">
              {careers.map((career) => (
                <li
                  key={career.id}
                  className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition"
                >
                  <Link href={`/volunteer/${career.id}`} className="block">
                    <h2 className="text-xl font-semibold">{career.title}</h2>
                    {career.subTitle && (
                      <p className="text-gray-600 italic">{career.subTitle}</p>
                    )}
                    {career.location && (
                      <p className="text-sm text-gray-500">Location: {career.location}</p>
                    )}
                    {career.positionDetails && (
                      <p className="mt-3 text-gray-700">{career.positionDetails}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

        <Footer />
    </div>
  );
}
