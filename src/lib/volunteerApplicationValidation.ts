export const APPLICATION_LIMITS = {
  firstName: 80,
  middleName: 80,
  lastName: 80,
  phone: 25,
  email: 254,
  socialUrl: 250,
  resumeBytes: 10 * 1024 * 1024,
} as const;

export const ACCEPTED_RESUME_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".heic",
] as const;

export const ACCEPTED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;

export type SocialPlatform =
  | "twitter"
  | "linkedin"
  | "github"
  | "instagram";

type ValidationResult = {
  valid: boolean;
  message?: string;
};

export type SocialNormalizationResult =
  | {
      valid: true;
      value: string;
    }
  | {
      valid: false;
      message: string;
    };

const SOCIAL_HOSTS = {
  twitter: [
    "x.com",
    "www.x.com",
    "twitter.com",
    "www.twitter.com",
  ],
  linkedin: [
    "linkedin.com",
    "www.linkedin.com",
  ],
  github: [
    "github.com",
    "www.github.com",
  ],
  instagram: [
    "instagram.com",
    "www.instagram.com",
  ],
} as const;

function cleanValue(value: string): string {
  return value.trim();
}

function stripLeadingAt(value: string): string {
  return value.replace(/^@+/, "");
}

function pathParts(url: URL): string[] {
  return url.pathname
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

function looksLikeUrl(value: string): boolean {
  return (
    /^https?:\/\//i.test(value) ||
    /^www\./i.test(value) ||
    /^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i.test(value)
  );
}

function parseLooseUrl(value: string): URL | null {
  try {
    const candidate = /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;

    return new URL(candidate);
  } catch {
    return null;
  }
}

function validateTwitterUsername(username: string): boolean {
  return /^[A-Za-z0-9_]{1,15}$/.test(username);
}

function validateGithubUsername(username: string): boolean {
  if (username.length < 1 || username.length > 39) {
    return false;
  }

  if (!/^[A-Za-z0-9-]+$/.test(username)) {
    return false;
  }

  if (
    username.startsWith("-") ||
    username.endsWith("-") ||
    username.includes("--")
  ) {
    return false;
  }

  return true;
}

function validateInstagramUsername(username: string): boolean {
  return /^[A-Za-z0-9._]{1,30}$/.test(username);
}

function validateLinkedInUsername(username: string): boolean {
  if (username.length < 1 || username.length > 100) {
    return false;
  }

  return /^[A-Za-z0-9_%.-]+$/.test(username);
}

function validateUsername(
  platform: SocialPlatform,
  username: string
): boolean {
  switch (platform) {
    case "twitter":
      return validateTwitterUsername(username);

    case "linkedin":
      return validateLinkedInUsername(username);

    case "github":
      return validateGithubUsername(username);

    case "instagram":
      return validateInstagramUsername(username);
  }
}

function buildCanonicalSocialUrl(
  platform: SocialPlatform,
  username: string
): string {
  switch (platform) {
    case "twitter":
      return `https://x.com/${username}`;

    case "linkedin":
      return `https://www.linkedin.com/in/${username}`;

    case "github":
      return `https://github.com/${username}`;

    case "instagram":
      return `https://www.instagram.com/${username}`;
  }
}

function hostnameAllowed(
  platform: SocialPlatform,
  hostname: string
): boolean {
  const normalized = hostname.toLowerCase();

  return (SOCIAL_HOSTS[platform] as readonly string[]).includes(
    normalized
  );
}

function extractUsernameFromUrl(
  platform: SocialPlatform,
  url: URL
): string | null {
  if (!hostnameAllowed(platform, url.hostname)) {
    return null;
  }

  /*
   * Reject credentials and custom ports.
   */
  if (url.username || url.password || url.port) {
    return null;
  }

  const parts = pathParts(url);

  switch (platform) {
    case "twitter":
    case "github":
    case "instagram": {
      if (parts.length !== 1) {
        return null;
      }

      return parts[0];
    }

    case "linkedin": {
      if (
        parts.length !== 2 ||
        parts[0].toLowerCase() !== "in"
      ) {
        return null;
      }

      return parts[1];
    }
  }
}

export function normalizeSocialInput(
  platform: SocialPlatform,
  input: string
): SocialNormalizationResult {
  const value = cleanValue(input);

  /*
   * Social profiles are optional.
   */
  if (!value) {
    return {
      valid: true,
      value: "",
    };
  }

  if (value.length > APPLICATION_LIMITS.socialUrl) {
    return {
      valid: false,
      message: "The profile value is too long.",
    };
  }

  /*
   * Bare usernames:
   *
   * B3POio
   * @B3POio
   */
  if (!looksLikeUrl(value)) {
    const username = stripLeadingAt(value);

    if (!validateUsername(platform, username)) {
      return {
        valid: false,
        message:
          "Enter a valid username or profile URL.",
      };
    }

    return {
      valid: true,
      value: buildCanonicalSocialUrl(
        platform,
        username
      ),
    };
  }

  /*
   * URL-like values:
   *
   * github.com/B3POio
   * www.github.com/B3POio
   * http://github.com/B3POio
   * https://github.com/B3POio
   */
  const url = parseLooseUrl(value);

  if (!url) {
    return {
      valid: false,
      message:
        "Enter a valid username or profile URL.",
    };
  }

  /*
   * Only HTTP/HTTPS input is accepted.
   * Output is always normalized to HTTPS.
   */
  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    return {
      valid: false,
      message:
        "Enter a valid HTTP or HTTPS profile URL.",
    };
  }

  /*
   * We want the profile itself, not tracking,
   * query parameters, anchors, etc.
   */
  if (url.search || url.hash) {
    return {
      valid: false,
      message:
        "Enter the direct profile URL without query parameters or fragments.",
    };
  }

  const username = extractUsernameFromUrl(
    platform,
    url
  );

  if (!username) {
    return {
      valid: false,
      message:
        "The profile URL does not match the expected website.",
    };
  }

  if (!validateUsername(platform, username)) {
    return {
      valid: false,
      message:
        "The profile username is not valid.",
    };
  }

  /*
   * Rebuild instead of trusting the original URL.
   *
   * Example:
   * http://www.github.com/B3POio
   *
   * becomes:
   * https://github.com/B3POio
   */
  return {
    valid: true,
    value: buildCanonicalSocialUrl(
      platform,
      username
    ),
  };
}

export function validateName(
  value: string,
  label: string,
  required = false,
  maxLength = APPLICATION_LIMITS.firstName
): ValidationResult {
  const trimmed = value.trim();

  if (required && !trimmed) {
    return {
      valid: false,
      message: `${label} is required.`,
    };
  }

  if (!trimmed) {
    return {
      valid: true,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      message: `${label} is too long.`,
    };
  }

  /*
   * Reject control characters while otherwise
   * remaining friendly to international names.
   */
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return {
      valid: false,
      message: `${label} contains invalid characters.`,
    };
  }

  return {
    valid: true,
  };
}

export function validateEmail(
  value: string
): ValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      valid: false,
      message: "Email is required.",
    };
  }

  if (trimmed.length > APPLICATION_LIMITS.email) {
    return {
      valid: false,
      message: "Email address is too long.",
    };
  }

  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(trimmed)) {
    return {
      valid: false,
      message: "Enter a valid email address.",
    };
  }

  return {
    valid: true,
  };
}

export function validatePhone(
  value: string
): ValidationResult {
  const trimmed = value.trim();

  if (!trimmed) {
    return {
      valid: false,
      message: "Phone number is required.",
    };
  }

  if (
    trimmed.length < 7 ||
    trimmed.length > APPLICATION_LIMITS.phone
  ) {
    return {
      valid: false,
      message: "Enter a valid phone number.",
    };
  }

  if (!/^[0-9+().\-\s]+$/.test(trimmed)) {
    return {
      valid: false,
      message:
        "Phone number contains unsupported characters.",
    };
  }

  /*
   * Require a sensible number of actual digits,
   * not just punctuation.
   */
  const digits = trimmed.replace(/\D/g, "");

  if (digits.length < 7 || digits.length > 15) {
    return {
      valid: false,
      message: "Enter a valid phone number.",
    };
  }

  return {
    valid: true,
  };
}

export function validateResume(
  file: File | null
): ValidationResult {
  /*
   * Resume remains optional to preserve
   * current behavior.
   */
  if (!file || file.size === 0) {
    return {
      valid: true,
    };
  }

  if (file.size > APPLICATION_LIMITS.resumeBytes) {
    return {
      valid: false,
      message: "Resume must be 10 MB or smaller.",
    };
  }

  const fileName = file.name.toLowerCase();

  const extensionValid =
    ACCEPTED_RESUME_EXTENSIONS.some((extension) =>
      fileName.endsWith(extension)
    );

  if (!extensionValid) {
    return {
      valid: false,
      message:
        "Resume must be PDF, DOC, DOCX, PNG, JPG, JPEG, WEBP, or HEIC.",
    };
  }

  /*
   * Some browsers leave File.type blank.
   * If they provide a MIME type, validate it.
   */
  if (
    file.type &&
    !(
      ACCEPTED_RESUME_MIME_TYPES as readonly string[]
    ).includes(file.type)
  ) {
    return {
      valid: false,
      message:
        "The selected resume file type is not supported.",
    };
  }

  return {
    valid: true,
  };
}