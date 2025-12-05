import { NextResponse } from "next/server";
import { getApiUrl } from "@/lib/getApiUrl";

export const dynamic = "force-dynamic"; // ensure no static caching in dev

export async function GET() {
  try {
    const base = getApiUrl().replace(/\/$/, "");
    const target = `${base}/api/get-careers`;

    const upstream = await fetch(target, {
      method: "GET",
      // Avoid any caching layers between Next and your backend
      cache: "no-store",
      headers: {
        // Pass through anything useful if you like (optional)
        "Accept": "application/json",
      },
    });

    const contentType = upstream.headers.get("content-type") ?? "application/json";
    const text = await upstream.text();

    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("Count proxy error:", err);
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}
