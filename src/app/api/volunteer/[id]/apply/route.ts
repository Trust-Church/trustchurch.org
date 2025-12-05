// app/api/careers/[id]/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getApiUrl } from "@/lib/getApiUrl";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> } // <-- params is a Promise
) {
  try {
    const { id } = await ctx.params; // <-- unwrap it
    const base = getApiUrl().replace(/\/$/, "");

    if (!base) {
      return NextResponse.json({ error: "BACKEND_URL not set" }, { status: 500 });
    }

    const form = await req.formData();

    // include job metadata for your backend (safe if unused)
    if (!form.get("jobId")) form.set("jobId", id);

    // forward multipart form-data to your Express endpoint
    const upstream = await fetch(`${base}/api/volunteers/apply`, {
      method: "POST",
      body: form,
      // Do NOT set Content-Type; fetch will set the correct multipart boundary
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json";
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("apply proxy error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }
}
