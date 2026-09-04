import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
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

    const doc = await db
      .collection("careers")
      .doc(id)
      .get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        career: {
          id: doc.id,
          ...doc.data(),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error getting volunteer opportunity:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}