import "server-only";

import { ServerClient } from "postmark";

let client: ServerClient | null = null;

function getClient(): ServerClient {
  const token = process.env.POSTMARK_TOKEN;

  if (!token) {
    throw new Error(
      "Missing POSTMARK_TOKEN. Set it in your environment before sending email."
    );
  }

  if (!client) {
    client = new ServerClient(token);
  }

  return client;
}

function getFromEmail(): string {
  const from = process.env.FROM_EMAIL;

  if (!from) {
    throw new Error(
      "Missing FROM_EMAIL. Set it in your environment before sending email."
    );
  }

  return from;
}

function getMessageStream(): string {
  return process.env.POSTMARK_MESSAGE_STREAM || "outbound";
}

/**
 * Send the welcome email to a new subscriber.
 */
export async function sendWelcomeEmail(to: string) {
  return getClient().sendEmail({
    From: getFromEmail(),
    To: to,
    Subject: "Welcome to Trust Church!",
    HtmlBody: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <h1 style="color:#2c3e50;">Welcome to Trust Church!</h1>

        <p>We’re so glad you’re here.</p>

        <p>
          This is more than just a community—it’s a family rooted in God,
          strengthened by faith, and dedicated to good works and goodwill
          toward all. Here, you’ll find encouragement, purpose, and a place
          to grow alongside others who share the same heart for service
          and connection.
        </p>

        <p>
          Our mission is simple: to walk in love, build each other up, and
          shine light into the world through faith and action. Together,
          we can make a difference.
        </p>

        <p>
          Thank you for joining us on this journey. We can’t wait to walk
          alongside you in faith and fellowship.
        </p>

        <p style="margin-top: 2em;">
          With gratitude and hope,<br />
          Trust Church
        </p>
      </div>
    `,

    TextBody: `
Welcome to Trust Church!

We’re so glad you’re here.

This is more than just a community—it’s a family rooted in God, strengthened by faith, and dedicated to good works and goodwill toward all. Here, you’ll find encouragement, purpose, and a place to grow alongside others who share the same heart for service and connection.

Our mission is simple: to walk in love, build each other up, and shine light into the world through faith and action. Together, we can make a difference.

Thank you for joining us on this journey. We can’t wait to walk alongside you in faith and fellowship.

With gratitude and hope,
Trust Church
    `,

    MessageStream: getMessageStream(),
  });
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
  const opportunityText = jobTitle
    ? `for the <strong>${escapeHtml(jobTitle)}</strong> opportunity`
    : "for a volunteer opportunity";

  const opportunityTextPlain = jobTitle
    ? `for the "${jobTitle}" opportunity`
    : "for a volunteer opportunity";

  return getClient().sendEmail({
    From: getFromEmail(),
    To: to,
    Subject: "Thank you for volunteering with Trust Church!",
    HtmlBody: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h1 style="color:#2c3e50;">
          Thank You, ${escapeHtml(firstName)}!
        </h1>

        <p>
          We have received your volunteer application ${opportunityText}.
        </p>

        <p>
          Thank you for your willingness to serve and be part of what God
          is doing through Trust Church.
        </p>

        <p>
          Our team will review your application and reach out if we need
          any additional information or would like to discuss next steps.
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
      </div>
    `,

    TextBody: `
Thank You, ${firstName}!

We have received your volunteer application ${opportunityTextPlain}.

Thank you for your willingness to serve and be part of what God is doing through Trust Church.

Our team will review your application and reach out if we need any additional information or would like to discuss next steps.

${
  jobId
    ? `Application opportunity ID: ${jobId}`
    : ""
}

With gratitude,
Trust Church
    `,

    MessageStream: getMessageStream(),
  });
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

  return getClient().sendEmail({
    From: getFromEmail(),
    To: adminEmail,
    Subject: `New Volunteer Application${jobTitle ? ` - ${jobTitle}` : ""}`,

    HtmlBody: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h1 style="color:#2c3e50;">
          New Volunteer Application
        </h1>

        <p>
          A new volunteer application has been submitted through
          the Trust Church website.
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

A new volunteer application has been submitted through the Trust Church website.

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
