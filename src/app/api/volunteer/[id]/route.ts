// app/api/careers/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getApiUrl } from "@/lib/getApiUrl";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // <-- params is a Promise
) {
  try {
    const { id } = await ctx.params; // <-- await it
    const base = getApiUrl().replace(/\/$/, "");

    // Use your Express path-style detail route
    const target = `${base}/api/get-career/${encodeURIComponent(id)}`;

    const upstream = await fetch(target, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json";
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("Career item proxy error:", err);
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
