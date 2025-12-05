"use client";

import { use, useEffect, useMemo, useState } from "react";
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";
import Link from "next/link";
import Footer from "@/components/Footer";

type Career = {
  id: string;
  title: string;
  subTitle?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  positionDetails?: string;
};

export default function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // unwrap promise per latest Next.js behavior for client components
  const { id } = use(params);

  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  useEffect(() => {
    const go = async () => {
      try {
        const res = await fetch(`/api/volunteer/${id}`);
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setCareer(data.career ?? null);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message || "Failed to load job");
        } else {
          setError("Failed to load job");
        }
      } finally {
        setLoading(false);
      }
    };
    go();
  }, [id]);

  const acceptExt = useMemo(
    () =>
      // keep in sync with your multer fileFilter on the backend
      ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.heic",
    []
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setOkMsg(null);

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      // include job metadata (optional)
      fd.set("jobId", id);
      if (career?.title) fd.set("jobTitle", career.title);

      // Send socials as { platform: handle }
      const twitter = (fd.get("twitter") as string | null)?.trim() || "";
      const linkedin = (fd.get("linkedin") as string | null)?.trim() || "";
      const github = (fd.get("github") as string | null)?.trim() || "";
      const instagram = (fd.get("instagram") as string | null)?.trim() || "";

      const socialsObj: Record<string, string> = {};
      if (twitter) socialsObj.twitter = twitter.replace(/^@/, "");
      if (instagram) socialsObj.instagram = instagram.replace(/^@/, "");
      if (linkedin) socialsObj.linkedin = linkedin; // URL or slug—either is fine
      if (github) socialsObj.github = github;

      fd.set("socials", JSON.stringify(socialsObj));

      const res = await fetch(`/api/volunteer/${id}/apply`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Submit failed (${res.status})`);
      }

      const data: unknown = await res.json().catch(() => ({}));
      const message =
        typeof data === "object" && data !== null && "message" in data
          ? String((data as { message?: unknown }).message ?? "Application submitted!")
          : "Application submitted!";
      setOkMsg(message);

      form.reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Submission failed");
      } else {
        setError("Submission failed");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-6">Loading…</p>;
  if (!career) return <p className="p-6">Job not found.</p>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href={`/volunteer/${id}`} className="text-sm text-blue-700 hover:underline">
        ← Back to opportunity
      </Link>

      <h1 className="text-2xl font-bold mt-4">Apply for: {career.title}</h1>
      {career.location && <p className="text-gray-600 mt-1">{career.location}</p>}

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input name="firstName" required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Middle name</label>
            <input name="middleName" className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input name="lastName" required className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              required
              className="w-full border rounded-lg px-3 py-2"
              inputMode="tel"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div className="sm:col-span-2 space-y-4">
            <label className="block text-sm font-medium mb-2">Socials</label>

            {/* Twitter */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaTwitter className="text-sky-500 mr-2" />
              <input
                type="text"
                name="twitter"
                className="flex-1 outline-none"
                placeholder="@username"
              />
            </div>

            {/* LinkedIn */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaLinkedin className="text-blue-700 mr-2" />
              <input
                type="text"
                name="linkedin"
                className="flex-1 outline-none"
                placeholder="linkedin.com/in/username"
              />
            </div>

            {/* GitHub */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaGithub className="text-gray-800 mr-2" />
              <input
                type="text"
                name="github"
                className="flex-1 outline-none"
                placeholder="github.com/username"
              />
            </div>

            {/* Instagram */}
            <div className="flex items-center border rounded-lg px-3 py-2">
              <FaInstagram className="text-pink-500 mr-2" />
              <input
                type="text"
                name="instagram"
                className="flex-1 outline-none"
                placeholder="@username"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Resume</label>
          <input type="file" name="resume" accept={acceptExt} className="block w-full text-sm" />
          <p className="text-xs text-gray-500 mt-1">
            Accepted: PDF, DOC, DOCX, PNG, JPG, JPEG, WEBP, HEIC. Max ~10MB.
          </p>
        </div>

        {error && (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        {okMsg && (
          <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            {okMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit application"}
        </button>
      </form>
      <Footer />
    </div>
  );
}
