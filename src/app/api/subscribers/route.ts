import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "@/lib/firebase-admin";
import { sendWelcomeEmail } from "@/lib/mail/postmark";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();

    await db
      .collection("subscribers")
      .doc(normalized)
      .set(
        {
          email: normalized,
          createdAt: FieldValue.serverTimestamp(),
          subscribed: true,
        },
        { merge: true }
      );

    // Don't make the subscription request wait for Postmark.
    Promise.resolve(sendWelcomeEmail(normalized)).catch((error) => {
      console.error(
        "Welcome email failed:",
        error?.message || error
      );
    });

    return NextResponse.json({
      message: `Saved: ${normalized}`,
    });
  } catch (error) {
    console.error("Error subscribing:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
