import { NextRequest, NextResponse } from "next/server";
import { db, bucket } from "@/lib/firebase-admin";
import {
  sendVolunteerApplicationReceipt,
  notifyAdminOfVolunteer,
} from "@/lib/mail/postmark";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/heic",
]);

function getFileExtension(file: File): string {
  const extensionMap: Record<string, string> = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/heic": "heic",
  };

  return extensionMap[file.type] || "bin";
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;

    if (!id) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      );
    }

    const form = await req.formData();

    const firstName = form.get("firstName");
    const middleName = form.get("middleName");
    const lastName = form.get("lastName");
    const phone = form.get("phone");
    const email = form.get("email");
    const socials = form.get("socials");
    const resume = form.get("resume");

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof phone !== "string" ||
      typeof email !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "firstName, lastName, phone, and email are required.",
        },
        { status: 400 }
      );
    }

    const normalizedFirstName = firstName.trim();
    const normalizedMiddleName =
      typeof middleName === "string" && middleName.trim()
        ? middleName.trim()
        : null;
    const normalizedLastName = lastName.trim();
    const normalizedPhone = phone.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      !normalizedFirstName ||
      !normalizedLastName ||
      !normalizedPhone ||
      !normalizedEmail
    ) {
      return NextResponse.json(
        {
          error:
            "firstName, lastName, phone, and email are required.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // Verify the job exists and resolve its title
    // ---------------------------------------------------------

    const jobDoc = await db
      .collection("careers")
      .doc(id)
      .get();

    if (!jobDoc.exists) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    const jobData = jobDoc.data() || {};

    const jobTitle =
      jobData.title ||
      jobData.name ||
      jobData.jobTitle ||
      null;

    // ---------------------------------------------------------
    // Parse and normalize social links
    // ---------------------------------------------------------

    let socialsParsed: unknown = [];

    if (typeof socials === "string" && socials.trim()) {
      try {
        socialsParsed = JSON.parse(socials);
      } catch {
        socialsParsed = socials
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    const socialsNormalized: Record<string, string> = {};

    if (Array.isArray(socialsParsed)) {
      socialsParsed.forEach((entry) => {
        if (typeof entry !== "string") return;

        const [platform, handle] = entry
          .split(/[:=]/)
          .map((s) => s.trim());

        if (platform && handle) {
          socialsNormalized[platform.toLowerCase()] = handle;
        }
      });
    } else if (
      typeof socialsParsed === "object" &&
      socialsParsed !== null
    ) {
      Object.entries(socialsParsed).forEach(
        ([platform, handle]) => {
          if (platform && handle) {
            socialsNormalized[platform.toLowerCase()] =
              String(handle).trim();
          }
        }
      );
    }

    // ---------------------------------------------------------
    // Validate resume
    // ---------------------------------------------------------

    let resumeFile: File | null = null;

    if (resume instanceof File && resume.size > 0) {
      resumeFile = resume;

      if (!ALLOWED_FILE_TYPES.has(resume.type)) {
        return NextResponse.json(
          { error: "Unsupported file type" },
          { status: 400 }
        );
      }

      if (resume.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json(
          {
            error: "Resume exceeds the 10 MB maximum file size.",
          },
          { status: 400 }
        );
      }
    }

    // ---------------------------------------------------------
    // Create Firestore document
    // ---------------------------------------------------------

    const docRef = db.collection("volunteers").doc();

    let resumeUrl: string | null = null;

    // ---------------------------------------------------------
    // Upload resume to Firebase Storage
    // ---------------------------------------------------------

    if (resumeFile) {
      const extension = getFileExtension(resumeFile);

      const fileName = `volunteers/${docRef.id}/resume.${extension}`;

      const file = bucket.file(fileName);

      const buffer = Buffer.from(
        await resumeFile.arrayBuffer()
      );

      await file.save(buffer, {
        contentType: resumeFile.type,
        resumable: false,
        metadata: {
          cacheControl:
            "private, max-age=0, no-transform",
        },
      });

      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires:
          Date.now() +
          7 * 24 * 60 * 60 * 1000,
      });

      resumeUrl = signedUrl;
    }

    // ---------------------------------------------------------
    // Save volunteer application
    // ---------------------------------------------------------

    const createdAt = new Date();

    await docRef.set({
      firstName: normalizedFirstName,
      middleName: normalizedMiddleName,
      lastName: normalizedLastName,
      phone: normalizedPhone,
      email: normalizedEmail,
      socials: socialsNormalized,
      resumeUrl,
      resumeUploaded: Boolean(resumeFile),
      createdAt,
      status: "new",
      jobId: id,
      jobTitle,
    });

    // ---------------------------------------------------------
    // Prepare admin email payload
    // ---------------------------------------------------------

    const applicantPayload = {
      id: docRef.id,
      firstName: normalizedFirstName,
      middleName: normalizedMiddleName,
      lastName: normalizedLastName,
      phone: normalizedPhone,
      email: normalizedEmail,
      socials: socialsNormalized,
      resumeUrl,
      createdAt: createdAt.toISOString(),
    };

    // ---------------------------------------------------------
    // Send emails without blocking the API response
    // ---------------------------------------------------------

    Promise.allSettled([
      sendVolunteerApplicationReceipt({
        to: normalizedEmail,
        firstName: normalizedFirstName,
        jobTitle,
        jobId: id,
      }),

      notifyAdminOfVolunteer({
        applicant: applicantPayload,
        jobTitle,
        jobId: id,
      }),
    ]).then((results) => {
      results.forEach((result) => {
        if (result.status === "rejected") {
          console.error(
            "Volunteer email failed:",
            result.reason
          );
        }
      });
    });

    // ---------------------------------------------------------
    // Response
    // ---------------------------------------------------------

    return NextResponse.json({
      message: "Application received",
      id: docRef.id,
      resumeUploaded: Boolean(resumeFile),
      job: {
        id,
        title: jobTitle,
      },
    });
  } catch (error) {
    console.error("Volunteer application error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}