import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export async function GET() {
  try {
    const snapshot = await db
      .collection("subscribers")
      .count()
      .get();

    const count = snapshot.data().count;

    return NextResponse.json({
      totalSubscribers: count,
    });
  } catch (error) {
    console.error("Error getting subscriber count:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
