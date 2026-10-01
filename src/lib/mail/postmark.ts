import "server-only";

import { ServerClient } from "postmark";

let client: ServerClient | null = null;

function getPostmarkToken(): string {
  const token = process.env.POSTMARK_TOKEN?.trim();

  if (!token) {
    throw new Error(
      "Missing POSTMARK_TOKEN. Set the Postmark Server API Token in your environment."
    );
  }

  return token;
}

function getClient(): ServerClient {
  if (!client) {
    client = new ServerClient(getPostmarkToken());

    console.log("[Postmark] ServerClient initialized.", {
      tokenConfigured: true,
      tokenLength: getPostmarkToken().length,
    });
  }

  return client;
}

/**
 * Get the verified sender address.
 */
function getFromEmail(): string {
  const from = process.env.FROM_EMAIL?.trim();

  if (!from) {
    throw new Error(
      "Missing FROM_EMAIL. Set it to a verified sender address in Postmark."
    );
  }

  return from;
}

function getMessageStream(): string {
  return process.env.POSTMARK_MESSAGE_STREAM?.trim() || "outbound";
}

const TRUST_CHURCH_COPY_EMAIL = "welcome@trustchurch.org";

function getCopyRecipient(primaryRecipient: string): string | undefined {
  const primary = normalizeEmail(primaryRecipient);
  const copy = normalizeEmail(TRUST_CHURCH_COPY_EMAIL);

  return primary === copy ? undefined : copy;
}

/**
 * Normalize an email address.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Basic email format validation.
 *
 * This is intentionally not a complete RFC implementation.
 * It catches obviously malformed addresses before sending.
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || email.length > 254) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate and normalize an email address.
 */
export function validateRecipientEmail(email: string): string {
  if (typeof email !== "string") {
    throw new Error("Email address must be a string.");
  }

  const normalized = normalizeEmail(email);

  if (!isValidEmailFormat(normalized)) {
    throw new Error(`Invalid email address: ${normalized}`);
  }

  return normalized;
}

export class InactiveRecipientError extends Error {
  public readonly code = 406;
  public readonly email: string;

  constructor(email: string, message?: string) {
    super(
      message ||
        `Postmark has marked ${email} as an inactive recipient. Email was not sent.`
    );

    this.name = "InactiveRecipientError";
    this.email = email;
  }
}

function getPostmarkErrorDetails(error: unknown): {
  errorCode?: number;
  message: string;
} {
  if (error instanceof Error) {
    const postmarkError = error as Error & {
      ErrorCode?: number;
      Message?: string;
      code?: number | string;
    };

    const errorCode =
      typeof postmarkError.ErrorCode === "number"
        ? postmarkError.ErrorCode
        : typeof postmarkError.code === "number"
          ? postmarkError.code
          : undefined;

    const message =
      postmarkError.Message ||
      postmarkError.message ||
      "Unknown Postmark error";

    return {
      errorCode,
      message,
    };
  }

  if (typeof error === "object" && error !== null) {
    const postmarkError = error as {
      ErrorCode?: number;
      Message?: string;
      message?: string;
      code?: number;
    };

    const errorCode =
      typeof postmarkError.ErrorCode === "number"
        ? postmarkError.ErrorCode
        : typeof postmarkError.code === "number"
          ? postmarkError.code
          : undefined;

    return {
      errorCode,
      message:
        postmarkError.Message ||
        postmarkError.message ||
        "Unknown Postmark error",
    };
  }

  return {
    message: String(error || "Unknown Postmark error"),
  };
}


function handlePostmarkError(
  error: unknown,
  recipient: string
): never {
  const { errorCode, message } = getPostmarkErrorDetails(error);

  if (errorCode === 406) {
    throw new InactiveRecipientError(recipient, message);
  }

  throw new Error(
    `Postmark failed to send email to ${recipient}. ` +
      `ErrorCode: ${errorCode ?? "unknown"}. ` +
      `Message: ${message}`
  );
}

function assertPostmarkSuccess(
  result: {
    ErrorCode?: number;
    MessageID?: string;
    SubmittedAt?: string;
    Message?: string;
  },
  recipient: string
) {
  if (result.ErrorCode !== 0) {
    if (result.ErrorCode === 406) {
      throw new InactiveRecipientError(
        recipient,
        result.Message ||
          `Postmark marked ${recipient} as an inactive recipient.`
      );
    }

    throw new Error(
      `Postmark rejected the email to ${recipient}. ` +
        `ErrorCode: ${result.ErrorCode ?? "unknown"}. ` +
        `Message: ${result.Message || "Unknown Postmark response"}`
    );
  }

  if (!result.MessageID) {
    throw new Error(
      `Postmark returned success for ${recipient}, but no MessageID was returned.`
    );
  }

  return result;
}



/**
 * Send the welcome email to a new subscriber.
 */
export async function sendWelcomeEmail(to: string) {
  const recipient = validateRecipientEmail(to);
  const copyRecipient = getCopyRecipient(recipient);

  try {
    const result = await getClient().sendEmail({
      From: getFromEmail(),
      To: recipient,
      ...(copyRecipient ? { Bcc: copyRecipient } : {}),
      Subject: "Welcome to Trust Church",

      HtmlBody: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h1 style="color:#2c3e50;">Welcome to Trust Church</h1>

          <p>We are glad you are here.</p>

          <p>
            Trust Church is a community of believers learning to love God,
            love people, and live out our faith through connection, service,
            encouragement, and action.
          </p>

          <p>
            Our goal is simple: help believers grow in faith, build meaningful
            relationships, serve others with what God has given them, and
            encourage one another to live for Christ beyond Sunday.
          </p>

          <p>
            As Trust Church grows, we hope you will find practical ways to
            connect, serve, encourage others, and take part in what God is
            building through this community.
          </p>

          <p style="margin-top: 2em;">
            Welcome to the community,<br />
            Trust Church
          </p>

          <p style="font-size:13px; color:#777; margin-top:2em;">
            Love God. Love people. Live it out.
          </p>
        </div>
      `,

      TextBody: `
Welcome to Trust Church

We are glad you are here.

Trust Church is a community of believers learning to love God, love people, and live out our faith through connection, service, encouragement, and action.

Our goal is simple: help believers grow in faith, build meaningful relationships, serve others with what God has given them, and encourage one another to live for Christ beyond Sunday.

As Trust Church grows, we hope you will find practical ways to connect, serve, encourage others, and take part in what God is building through this community.

Welcome to the community,
Trust Church

Love God. Love people. Live it out.
      `,

      MessageStream: getMessageStream(),
    });

    const accepted = assertPostmarkSuccess(result, recipient);
    return accepted;
  } catch (error) {
    if (error instanceof InactiveRecipientError) {
      console.warn("[Postmark] Inactive recipient:", {
        to: recipient,
        message: error.message,
      });

      throw error;
    }

    console.error("[Postmark] Welcome email failed:", {
      to: recipient,
      error,
    });

    handlePostmarkError(error, recipient);
  }
}

/**
 * Send confirmation to the person who submitted a volunteer application.
 */
export async function sendVolunteerApplicationReceipt({
  to,
  firstName,
  jobTitle,
  jobId,
}: {
  to: string;
  firstName: string;
  jobTitle?: string | null;
  jobId?: string;
}) {
  const recipient = validateRecipientEmail(to);
  const copyRecipient = getCopyRecipient(recipient);
  const safeFirstName = escapeHtml(firstName);

  const opportunityText = jobTitle
    ? `for the <strong>${escapeHtml(jobTitle)}</strong> opportunity`
    : "for a volunteer opportunity";

  const opportunityTextPlain = jobTitle
    ? `for the "${jobTitle}" opportunity`
    : "for a volunteer opportunity";

  try {
    const result = await getClient().sendEmail({
      From: getFromEmail(),
      To: recipient,
      ...(copyRecipient ? { Bcc: copyRecipient } : {}),
      Subject: "We received your Trust Church volunteer application",

      HtmlBody: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h1 style="color:#2c3e50;">Thank you for being willing to serve, ${safeFirstName}</h1>

          <p>
            We received your volunteer application ${opportunityText}.
          </p>

          <p>
            Trust Church exists to help believers connect, serve, encourage one
            another, and put faith into action. Your willingness to offer your
            time and skills is part of that mission.
          </p>

          <p>
            Our team will review your application and reach out if we need
            additional information or would like to discuss next steps.
          </p>

          <p>
            Thank you for taking a step toward serving with the Trust Church
            community.
          </p>

          ${
            jobId
              ? `
          <p style="color:#666; font-size:13px;">
            Application opportunity ID: ${escapeHtml(jobId)}
          </p>
          `
              : ""
          }

          <p style="margin-top: 2em;">
            With gratitude,<br />
            Trust Church
          </p>

          <p style="font-size:13px; color:#777; margin-top:2em;">
            Love God. Love people. Live it out.
          </p>
        </div>
      `,

      TextBody: `
Thank you for being willing to serve, ${firstName}

We received your volunteer application ${opportunityTextPlain}.

Trust Church exists to help believers connect, serve, encourage one another, and put faith into action. Your willingness to offer your time and skills is part of that mission.

Our team will review your application and reach out if we need additional information or would like to discuss next steps.

Thank you for taking a step toward serving with the Trust Church community.

${
  jobId
    ? `Application opportunity ID: ${jobId}`
    : ""
}

With gratitude,
Trust Church

Love God. Love people. Live it out.
      `,

      MessageStream: getMessageStream(),
    });

    const accepted = assertPostmarkSuccess(result, recipient);

    return accepted;
  } catch (error) {
    if (error instanceof InactiveRecipientError) {
      console.warn("[Postmark] Inactive volunteer recipient:", {
        to: recipient,
        message: error.message,
      });

      throw error;
    }

    console.error("[Postmark] Volunteer receipt failed:", {
      to: recipient,
      error,
    });

    handlePostmarkError(error, recipient);
  }
}

/**
 * Notify the Trust Church team that a new volunteer application
 * has been submitted.
 */
export async function notifyAdminOfVolunteer({
  applicant,
  jobTitle,
  jobId,
}: {
  applicant: {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    phone: string;
    email: string;
    socials?: Record<string, string>;
    resumeUrl?: string | null;
    createdAt?: string;
  };
  jobTitle?: string | null;
  jobId?: string;
}) {
  const adminEmail = process.env.VOLUNTEER_ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error(
      "Missing VOLUNTEER_ADMIN_EMAIL. Set it in your environment before sending volunteer notifications."
    );
  }

  const recipient = validateRecipientEmail(adminEmail);
  const copyRecipient = getCopyRecipient(recipient);

  const fullName = [
    applicant.firstName,
    applicant.middleName,
    applicant.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const socials = applicant.socials || {};

  const socialsHtml =
    Object.keys(socials).length > 0
      ? `
        <h3>Socials</h3>
        <ul>
          ${Object.entries(socials)
            .map(
              ([platform, handle]) =>
                `<li><strong>${escapeHtml(platform)}:</strong> ${escapeHtml(handle)}</li>`
            )
            .join("")}
        </ul>
      `
      : "<p><strong>Socials:</strong> None provided</p>";

  const socialsText =
    Object.keys(socials).length > 0
      ? Object.entries(socials)
          .map(([platform, handle]) => `${platform}: ${handle}`)
          .join("\n")
      : "None provided";

  try {
    const result = await getClient().sendEmail({
      From: getFromEmail(),
      To: recipient,
      ...(copyRecipient ? { Bcc: copyRecipient } : {}),
      Subject: `New Volunteer Application${jobTitle ? ` - ${jobTitle}` : ""}`,

      HtmlBody: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h1 style="color:#2c3e50;">
            New Volunteer Application
          </h1>

          <p>
            A new volunteer application has been submitted by someone interested
            in serving the Trust Church mission.
          </p>

          <p>
            Please review the applicant details below and follow up as appropriate.
          </p>

          <hr />

          <h2>Applicant</h2>

          <p>
            <strong>Name:</strong> ${escapeHtml(fullName)}<br />
            <strong>Email:</strong>
            <a href="mailto:${escapeHtml(applicant.email)}">
              ${escapeHtml(applicant.email)}
            </a><br />
            <strong>Phone:</strong> ${escapeHtml(applicant.phone)}
          </p>

          <h2>Opportunity</h2>

          <p>
            <strong>Position:</strong>
            ${jobTitle ? escapeHtml(jobTitle) : "Not specified"}<br />
            <strong>Job ID:</strong>
            ${jobId ? escapeHtml(jobId) : "Not specified"}
          </p>

          ${socialsHtml}

          ${
            applicant.resumeUrl
              ? `
          <h3>Resume</h3>
          <p>
            <a href="${escapeHtml(applicant.resumeUrl)}">
              Download/View Resume
            </a>
          </p>
          `
              : `
          <p>
            <strong>Resume:</strong> No resume uploaded
          </p>
          `
          }

          <hr />

          <p style="font-size:13px; color:#777;">
            Volunteer application ID: ${escapeHtml(applicant.id)}<br />
            Submitted:
            ${
              applicant.createdAt
                ? escapeHtml(
                    new Date(applicant.createdAt).toLocaleString()
                  )
                : "Unknown"
            }
          </p>
        </div>
      `,

      TextBody: `
New Volunteer Application

A new volunteer application has been submitted by someone interested in serving the Trust Church mission.

Please review the applicant details below and follow up as appropriate.

APPLICANT
Name: ${fullName}
Email: ${applicant.email}
Phone: ${applicant.phone}

OPPORTUNITY
Position: ${jobTitle || "Not specified"}
Job ID: ${jobId || "Not specified"}

SOCIALS
${socialsText}

RESUME
${
  applicant.resumeUrl
    ? applicant.resumeUrl
    : "No resume uploaded"
}

APPLICATION ID
${applicant.id}

SUBMITTED
${applicant.createdAt || "Unknown"}
      `,

      MessageStream: getMessageStream(),
    });

    const accepted = assertPostmarkSuccess(result, recipient);


    return accepted;
  } catch (error) {
    if (error instanceof InactiveRecipientError) {
      console.warn("[Postmark] Inactive admin recipient:", {
        to: recipient,
        message: error.message,
      });

      throw error;
    }

    console.error("[Postmark] Volunteer admin notification failed:", {
      to: recipient,
      error,
    });

    handlePostmarkError(error, recipient);
  }
}

/**
 * Basic HTML escaping for values inserted into email HTML.
 */
function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
