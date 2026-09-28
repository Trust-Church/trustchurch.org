"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";

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
  const { id } = use(params);

  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await fetch(`/api/volunteer/${id}`);

        if (!res.ok) {
          throw new Error("Opportunity not found");
        }

        const data = await res.json();

        setCareer(data.career ?? null);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message || "Failed to load opportunity");
        } else {
          setError("Failed to load opportunity");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [id]);

  const acceptExt = useMemo(
    () => ".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.heic",
    []
  );

  async function onSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSubmitting(true);
    setError(null);
    setOkMsg(null);

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      fd.set("jobId", id);

      if (career?.title) {
        fd.set("jobTitle", career.title);
      }

      const twitter =
        (fd.get("twitter") as string | null)?.trim() || "";

      const linkedin =
        (fd.get("linkedin") as string | null)?.trim() || "";

      const github =
        (fd.get("github") as string | null)?.trim() || "";

      const instagram =
        (fd.get("instagram") as string | null)?.trim() || "";

      const socialsObj: Record<string, string> = {};

      if (twitter) {
        socialsObj.twitter = twitter.replace(/^@/, "");
      }

      if (instagram) {
        socialsObj.instagram = instagram.replace(/^@/, "");
      }

      if (linkedin) {
        socialsObj.linkedin = linkedin;
      }

      if (github) {
        socialsObj.github = github;
      }

      fd.set("socials", JSON.stringify(socialsObj));

      const res = await fetch(
        `/api/volunteer/${id}/apply`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (!res.ok) {
        const text = await res.text();

        throw new Error(
          text || `Submit failed (${res.status})`
        );
      }

      const data: unknown = await res
        .json()
        .catch(() => ({}));

      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data
          ? String(
              (data as { message?: unknown }).message ??
                "Application submitted!"
            )
          : "Application submitted!";

      setOkMsg(message);

      form.reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message || "Submission failed"
        );
      } else {
        setError("Submission failed");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[60vh] bg-[#f5f3ed]">
        <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
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
        <div className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
          <h1 className="font-serif text-5xl tracking-[-0.04em]">
            Opportunity not found.
          </h1>

          <Link
            href="/volunteer"
            className="mt-8 inline-block text-sm underline-offset-4 hover:underline"
          >
            ← Back to volunteer opportunities
          </Link>
        </div>
      </main>
    );
  }

  const inputClass =
    "mt-2 w-full border border-[#cbc9bf] bg-[#fbfaf6] px-4 py-3 text-[#1b1d19] outline-none transition-colors placeholder:text-[#a1a39c] focus:border-[#657052]";

  const labelClass =
    "block text-sm font-medium text-[#34372f]";

  return (
    <main className="bg-[#f5f3ed] text-[#1b1d19]">
      <section className="border-b border-[#dcdcd3] py-16 sm:py-20">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <Link
            href={`/volunteer/${id}`}
            className="text-sm text-[#6c7067] underline-offset-4 hover:text-[#1b1d19] hover:underline"
          >
            ← Back to opportunity
          </Link>

          <p className="mb-5 mt-12 text-xs font-semibold uppercase tracking-[0.14em] text-[#657052]">
            Volunteer application
          </p>

          <h1 className="font-serif text-[clamp(3.25rem,7vw,5.75rem)] font-normal leading-[0.97] tracking-[-0.05em]">
            Apply for
            <br />
            <span className="italic text-[#657052]">
              {career.title}
            </span>
          </h1>

          {career.location && (
            <p className="mt-7 text-lg text-[#6c7067]">
              {career.location}
            </p>
          )}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          <form
            onSubmit={onSubmit}
            className="space-y-16"
          >
            {/* Personal information */}
            <fieldset>
              <legend className="font-serif text-3xl tracking-[-0.035em]">
                Your information
              </legend>

              <p className="mt-3 text-sm leading-6 text-[#6c7067]">
                Tell us how we can contact you.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className={labelClass}
                  >
                    First name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="middleName"
                    className={labelClass}
                  >
                    Middle name
                  </label>

                  <input
                    id="middleName"
                    name="middleName"
                    autoComplete="additional-name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className={labelClass}
                  >
                    Last name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className={labelClass}
                  >
                    Phone
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="email"
                    className={labelClass}
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
              </div>
            </fieldset>

            {/* Socials */}
            <fieldset className="border-t border-[#dcdcd3] pt-14">
              <legend className="font-serif text-3xl tracking-[-0.035em]">
                Social profiles
              </legend>

              <p className="mt-3 text-sm leading-6 text-[#6c7067]">
                Optional. Share any profiles that help us learn more about
                your work and interests.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="twitter"
                    className={labelClass}
                  >
                    X / Twitter
                  </label>

                  <div className="mt-2 flex items-center border border-[#cbc9bf] bg-[#fbfaf6] px-4 focus-within:border-[#657052]">
                    <FaTwitter
                      aria-hidden="true"
                      className="mr-3 text-[#6c7067]"
                    />

                    <input
                      id="twitter"
                      type="text"
                      name="twitter"
                      className="min-w-0 flex-1 bg-transparent py-3 outline-none"
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="linkedin"
                    className={labelClass}
                  >
                    LinkedIn
                  </label>

                  <div className="mt-2 flex items-center border border-[#cbc9bf] bg-[#fbfaf6] px-4 focus-within:border-[#657052]">
                    <FaLinkedin
                      aria-hidden="true"
                      className="mr-3 text-[#6c7067]"
                    />

                    <input
                      id="linkedin"
                      type="text"
                      name="linkedin"
                      className="min-w-0 flex-1 bg-transparent py-3 outline-none"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="github"
                    className={labelClass}
                  >
                    GitHub
                  </label>

                  <div className="mt-2 flex items-center border border-[#cbc9bf] bg-[#fbfaf6] px-4 focus-within:border-[#657052]">
                    <FaGithub
                      aria-hidden="true"
                      className="mr-3 text-[#6c7067]"
                    />

                    <input
                      id="github"
                      type="text"
                      name="github"
                      className="min-w-0 flex-1 bg-transparent py-3 outline-none"
                      placeholder="github.com/username"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="instagram"
                    className={labelClass}
                  >
                    Instagram
                  </label>

                  <div className="mt-2 flex items-center border border-[#cbc9bf] bg-[#fbfaf6] px-4 focus-within:border-[#657052]">
                    <FaInstagram
                      aria-hidden="true"
                      className="mr-3 text-[#6c7067]"
                    />

                    <input
                      id="instagram"
                      type="text"
                      name="instagram"
                      className="min-w-0 flex-1 bg-transparent py-3 outline-none"
                      placeholder="@username"
                    />
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Resume */}
            <fieldset className="border-t border-[#dcdcd3] pt-14">
              <legend className="font-serif text-3xl tracking-[-0.035em]">
                Resume
              </legend>

              <p className="mt-3 text-sm leading-6 text-[#6c7067]">
                Upload a resume or document that helps us understand your
                experience.
              </p>

              <div className="mt-8 border border-dashed border-[#aaa99f] bg-[#fbfaf6] p-6">
                <label
                  htmlFor="resume"
                  className={labelClass}
                >
                  Upload file
                </label>

                <input
                  id="resume"
                  type="file"
                  name="resume"
                  accept={acceptExt}
                  className="mt-4 block w-full text-sm text-[#6c7067] file:mr-4 file:border-0 file:bg-[#20241e] file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-white"
                />

                <p className="mt-3 text-xs leading-5 text-[#8b8e86]">
                  PDF, DOC, DOCX, PNG, JPG, JPEG, WEBP or HEIC. Maximum
                  approximately 10 MB.
                </p>
              </div>
            </fieldset>

            {error && (
              <div
                role="alert"
                className="border border-[#d7aaa3] bg-[#fbefed] px-4 py-3 text-sm text-[#853c32]"
              >
                {error}
              </div>
            )}

            {okMsg && (
              <div
                role="status"
                className="border border-[#b6c09f] bg-[#edf0e7] px-4 py-3 text-sm text-[#526040]"
              >
                {okMsg}
              </div>
            )}

            <div className="border-t border-[#dcdcd3] pt-8">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-12 items-center gap-8 bg-[#20241e] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Submitting…"
                  : "Submit application"}

                {!submitting && (
                  <span aria-hidden="true">
                    →
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}