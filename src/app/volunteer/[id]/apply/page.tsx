"use client";

import {
  use,
  useEffect,
  useMemo,
  useState,
  type FocusEvent,
  type FormEvent,
} from "react";

import Link from "next/link";

import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";

import {
  ACCEPTED_RESUME_EXTENSIONS,
  APPLICATION_LIMITS,
  normalizeSocialInput,
  validateEmail,
  validateName,
  validatePhone,
  validateResume,
  type SocialPlatform,
} from "@/lib/volunteerApplicationValidation";

type Career = {
  id: string;
  title: string;
  subTitle?: string;
  department?: string;
  location?: string;
  employmentType?: string;
  positionDetails?: string;
};

type SocialErrors = Partial<
  Record<SocialPlatform, string>
>;

export default function ApplyPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);

  const [career, setCareer] =
    useState<Career | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [okMsg, setOkMsg] =
    useState<string | null>(null);

  const [socialErrors, setSocialErrors] =
    useState<SocialErrors>({});

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const res = await fetch(
          `/api/volunteer/${encodeURIComponent(id)}`
        );

        if (!res.ok) {
          throw new Error(
            "Opportunity not found"
          );
        }

        const data = await res.json();

        setCareer(data.career ?? null);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(
            e.message ||
              "Failed to load opportunity"
          );
        } else {
          setError(
            "Failed to load opportunity"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCareer();
  }, [id]);

  const acceptExt = useMemo(
    () =>
      ACCEPTED_RESUME_EXTENSIONS.join(","),
    []
  );

  function normalizeSocialField(
    event: FocusEvent<HTMLInputElement>,
    platform: SocialPlatform
  ) {
    const value =
      event.currentTarget.value.trim();

    if (!value) {
      setSocialErrors((current) => ({
        ...current,
        [platform]: undefined,
      }));

      return;
    }

    const result = normalizeSocialInput(
      platform,
      value
    );

    if (!result.valid) {
      setSocialErrors((current) => ({
        ...current,
        [platform]: result.message,
      }));

      return;
    }

    /*
     * Update the visible field so users can
     * see exactly what canonical profile URL
     * will be submitted.
     */
    event.currentTarget.value = result.value;

    setSocialErrors((current) => ({
      ...current,
      [platform]: undefined,
    }));
  }

  function validateApplication(
    fd: FormData
  ): string | null {
    const firstName = String(
      fd.get("firstName") ?? ""
    ).trim();

    const middleName = String(
      fd.get("middleName") ?? ""
    ).trim();

    const lastName = String(
      fd.get("lastName") ?? ""
    ).trim();

    const phone = String(
      fd.get("phone") ?? ""
    ).trim();

    const email = String(
      fd.get("email") ?? ""
    )
      .trim()
      .toLowerCase();

    const firstNameResult = validateName(
      firstName,
      "First name",
      true,
      APPLICATION_LIMITS.firstName
    );

    if (!firstNameResult.valid) {
      return (
        firstNameResult.message ||
        "Enter a valid first name."
      );
    }

    const middleNameResult = validateName(
      middleName,
      "Middle name",
      false,
      APPLICATION_LIMITS.middleName
    );

    if (!middleNameResult.valid) {
      return (
        middleNameResult.message ||
        "Enter a valid middle name."
      );
    }

    const lastNameResult = validateName(
      lastName,
      "Last name",
      true,
      APPLICATION_LIMITS.lastName
    );

    if (!lastNameResult.valid) {
      return (
        lastNameResult.message ||
        "Enter a valid last name."
      );
    }

    const phoneResult =
      validatePhone(phone);

    if (!phoneResult.valid) {
      return (
        phoneResult.message ||
        "Enter a valid phone number."
      );
    }

    const emailResult =
      validateEmail(email);

    if (!emailResult.valid) {
      return (
        emailResult.message ||
        "Enter a valid email address."
      );
    }

const socialPlatforms: SocialPlatform[] = [
  "twitter",
  "linkedin",
  "github",
  "instagram",
];

const socialsObj: Record<string, string> = {};

for (const platform of socialPlatforms) {
  const rawValue = String(
    fd.get(platform) ?? ""
  ).trim();

  if (!rawValue) {
    continue;
  }

  const result = normalizeSocialInput(
    platform,
    rawValue
  );

  if (!result.valid) {
    const label =
      platform === "twitter"
        ? "X / Twitter"
        : platform.charAt(0).toUpperCase() +
          platform.slice(1);

    throw new Error(
      `${label}: ${result.message}`
    );
  }

  /*
   * Save canonical HTTPS URL.
   *
   * Examples:
   *
   * B3POio
   * github.com/B3POio
   * http://www.github.com/B3POio
   *
   * all become:
   *
   * https://github.com/B3POio
   */
  const canonicalUrl = result.value;

  socialsObj[platform] = canonicalUrl;

  /*
   * Preserve the original FormData fields,
   * but replace their values with the
   * validated canonical HTTPS URL.
   */
  fd.set(
    platform,
    canonicalUrl
  );
}

/*
 * Preserve the existing serialized
 * socials object expected by the backend.
 */
fd.set(
  "socials",
  JSON.stringify(socialsObj)
);

    const resumeValue =
      fd.get("resume");

    const resume =
      resumeValue instanceof File
        ? resumeValue
        : null;

    const resumeResult =
      validateResume(resume);

    if (!resumeResult.valid) {
      return (
        resumeResult.message ||
        "Select a valid resume file."
      );
    }

    return null;
  }

  async function onSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);
    setOkMsg(null);
    setSocialErrors({});

    const form = event.currentTarget;
    const fd = new FormData(form);

    const validationError =
      validateApplication(fd);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);

    try {
      /*
       * Normalize personal information.
       */
      const firstName = String(
        fd.get("firstName") ?? ""
      ).trim();

      const middleName = String(
        fd.get("middleName") ?? ""
      ).trim();

      const lastName = String(
        fd.get("lastName") ?? ""
      ).trim();

      const phone = String(
        fd.get("phone") ?? ""
      ).trim();

      const email = String(
        fd.get("email") ?? ""
      )
        .trim()
        .toLowerCase();

      fd.set("firstName", firstName);
      fd.set("middleName", middleName);
      fd.set("lastName", lastName);
      fd.set("phone", phone);
      fd.set("email", email);

      /*
       * Preserve your existing API contract.
       */
      fd.set("jobId", id);

      if (career?.title) {
        fd.set(
          "jobTitle",
          career.title
        );
      }

      /*
       * Normalize all social fields into
       * canonical HTTPS URLs.
       */
      const socialPlatforms: SocialPlatform[] = [
        "twitter",
        "linkedin",
        "github",
        "instagram",
      ];

      const socialsObj: Record<
        string,
        string
      > = {};

      for (const platform of socialPlatforms) {
        const rawValue = String(
          fd.get(platform) ?? ""
        ).trim();

        if (!rawValue) {
          continue;
        }

        const result =
          normalizeSocialInput(
            platform,
            rawValue
          );

        /*
         * Should already have been caught
         * during validateApplication(), but
         * keep the submission path defensive.
         */
        if (!result.valid) {
          throw new Error(
            result.message
          );
        }

        if (result.value) {
          socialsObj[platform] =
            result.value;
        }
      }

      /*
       * Backend already expects socials as
       * JSON inside the multipart request.
       */
      fd.set(
        "socials",
        JSON.stringify(socialsObj)
      );

      const res = await fetch(
        `/api/volunteer/${encodeURIComponent(
          id
        )}/apply`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (!res.ok) {
        const text =
          await res.text();

        throw new Error(
          text ||
            `Submit failed (${res.status})`
        );
      }

      const data: unknown =
        await res
          .json()
          .catch(() => ({}));

      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data
          ? String(
              (
                data as {
                  message?: unknown;
                }
              ).message ??
                "Application submitted!"
            )
          : "Application submitted!";

      setOkMsg(message);

      form.reset();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(
          err.message ||
            "Submission failed"
        );
      } else {
        setError(
          "Submission failed"
        );
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

  const socialInputClass =
    "min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-[#a1a39c]";

  const socialWrapperClass =
    "mt-2 flex items-center border border-[#cbc9bf] bg-[#fbfaf6] px-4 transition-colors focus-within:border-[#657052]";

  const socialErrorClass =
    "mt-2 text-xs leading-5 text-[#853c32]";

  return (
    <main className="bg-[#f5f3ed] text-[#1b1d19]">
      {/* Header */}
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

      {/* Application */}
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
                    minLength={1}
                    maxLength={
                      APPLICATION_LIMITS.firstName
                    }
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
                    maxLength={
                      APPLICATION_LIMITS.middleName
                    }
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
                    minLength={1}
                    maxLength={
                      APPLICATION_LIMITS.lastName
                    }
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
                    minLength={7}
                    maxLength={
                      APPLICATION_LIMITS.phone
                    }
                    pattern="[0-9+().\-\s]{7,25}"
                    title="Enter a valid phone number."
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
                    maxLength={
                      APPLICATION_LIMITS.email
                    }
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
              </div>
            </fieldset>

            {/* Social profiles */}
            <fieldset className="border-t border-[#dcdcd3] pt-14">
              <legend className="font-serif text-3xl tracking-[-0.035em]">
                Social profiles
              </legend>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6c7067]">
                Optional. Enter a username or profile URL. We&apos;ll
                automatically convert valid profiles to their secure HTTPS
                address.
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {/* X / Twitter */}
                <div>
                  <label
                    htmlFor="twitter"
                    className={labelClass}
                  >
                    X / Twitter
                  </label>

                  <div className={socialWrapperClass}>
                    <FaTwitter
                      aria-hidden="true"
                      className="mr-3 shrink-0 text-[#6c7067]"
                    />

                    <input
                      id="twitter"
                      type="text"
                      name="twitter"
                      maxLength={
                        APPLICATION_LIMITS.socialUrl
                      }
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className={socialInputClass}
                      placeholder="username or x.com/username"
                      aria-invalid={
                        Boolean(
                          socialErrors.twitter
                        )
                      }
                      aria-describedby={
                        socialErrors.twitter
                          ? "twitter-error"
                          : undefined
                      }
                      onBlur={(event) =>
                        normalizeSocialField(
                          event,
                          "twitter"
                        )
                      }
                    />
                  </div>

                  {socialErrors.twitter && (
                    <p
                      id="twitter-error"
                      className={
                        socialErrorClass
                      }
                    >
                      {socialErrors.twitter}
                    </p>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <label
                    htmlFor="linkedin"
                    className={labelClass}
                  >
                    LinkedIn
                  </label>

                  <div className={socialWrapperClass}>
                    <FaLinkedin
                      aria-hidden="true"
                      className="mr-3 shrink-0 text-[#6c7067]"
                    />

                    <input
                      id="linkedin"
                      type="text"
                      name="linkedin"
                      maxLength={
                        APPLICATION_LIMITS.socialUrl
                      }
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className={socialInputClass}
                      placeholder="username or linkedin.com/in/username"
                      aria-invalid={
                        Boolean(
                          socialErrors.linkedin
                        )
                      }
                      aria-describedby={
                        socialErrors.linkedin
                          ? "linkedin-error"
                          : undefined
                      }
                      onBlur={(event) =>
                        normalizeSocialField(
                          event,
                          "linkedin"
                        )
                      }
                    />
                  </div>

                  {socialErrors.linkedin && (
                    <p
                      id="linkedin-error"
                      className={
                        socialErrorClass
                      }
                    >
                      {socialErrors.linkedin}
                    </p>
                  )}
                </div>

                {/* GitHub */}
                <div>
                  <label
                    htmlFor="github"
                    className={labelClass}
                  >
                    GitHub
                  </label>

                  <div className={socialWrapperClass}>
                    <FaGithub
                      aria-hidden="true"
                      className="mr-3 shrink-0 text-[#6c7067]"
                    />

                    <input
                      id="github"
                      type="text"
                      name="github"
                      maxLength={
                        APPLICATION_LIMITS.socialUrl
                      }
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className={socialInputClass}
                      placeholder="username or github.com/username"
                      aria-invalid={
                        Boolean(
                          socialErrors.github
                        )
                      }
                      aria-describedby={
                        socialErrors.github
                          ? "github-error"
                          : undefined
                      }
                      onBlur={(event) =>
                        normalizeSocialField(
                          event,
                          "github"
                        )
                      }
                    />
                  </div>

                  {socialErrors.github && (
                    <p
                      id="github-error"
                      className={
                        socialErrorClass
                      }
                    >
                      {socialErrors.github}
                    </p>
                  )}
                </div>

                {/* Instagram */}
                <div>
                  <label
                    htmlFor="instagram"
                    className={labelClass}
                  >
                    Instagram
                  </label>

                  <div className={socialWrapperClass}>
                    <FaInstagram
                      aria-hidden="true"
                      className="mr-3 shrink-0 text-[#6c7067]"
                    />

                    <input
                      id="instagram"
                      type="text"
                      name="instagram"
                      maxLength={
                        APPLICATION_LIMITS.socialUrl
                      }
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className={socialInputClass}
                      placeholder="username or instagram.com/username"
                      aria-invalid={
                        Boolean(
                          socialErrors.instagram
                        )
                      }
                      aria-describedby={
                        socialErrors.instagram
                          ? "instagram-error"
                          : undefined
                      }
                      onBlur={(event) =>
                        normalizeSocialField(
                          event,
                          "instagram"
                        )
                      }
                    />
                  </div>

                  {socialErrors.instagram && (
                    <p
                      id="instagram-error"
                      className={
                        socialErrorClass
                      }
                    >
                      {socialErrors.instagram}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {/* Resume */}
            <fieldset className="border-t border-[#dcdcd3] pt-14">
              <legend className="font-serif text-3xl tracking-[-0.035em]">
                Resume
              </legend>

              <p className="mt-3 text-sm leading-6 text-[#6c7067]">
                Upload a resume or supporting document that helps us understand
                your experience.
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
                  PDF, DOC, DOCX, PNG, JPG, JPEG, WEBP, or HEIC. Maximum 10 MB.
                </p>
              </div>
            </fieldset>

            {/* General error */}
            {error && (
              <div
                role="alert"
                className="border border-[#d7aaa3] bg-[#fbefed] px-4 py-3 text-sm text-[#853c32]"
              >
                {error}
              </div>
            )}

            {/* Success */}
            {okMsg && (
              <div
                role="status"
                className="border border-[#b6c09f] bg-[#edf0e7] px-4 py-3 text-sm text-[#526040]"
              >
                {okMsg}
              </div>
            )}

            {/* Submit */}
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