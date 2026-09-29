import { NextResponse } from "next/server";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await db
      .collection("careers")
      .where("active", "==", true)
      .get();

    const careers = snapshot.docs.map(
      (doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    return NextResponse.json(
      { careers },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error getting volunteer opportunities:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}