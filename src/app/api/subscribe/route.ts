import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/getApiUrl";

export async function POST(req: Request) {
  try {
    const payload = await req.json(); // e.g. { email }
    const base = getApiUrl().replace(/\/$/, "");
    const target = `${base}/api/subscribe`;

    const upstream = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json";
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}

