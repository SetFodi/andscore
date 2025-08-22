import { NextRequest, NextResponse } from "next/server";

const FD_BASE = "https://api.football-data.org/v4";

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  try {
    const apiKey = process.env.FOOTBALL_DATA_API_KEY;
    const { slug } = await context.params;
    const path = slug?.join("/") ?? "";
    const url = `${FD_BASE}/${path}${req.nextUrl.search}`;

    const res = await fetch(url, {
      headers: apiKey ? { "X-Auth-Token": apiKey } : undefined,
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API request failed: ${res.status} ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "cache-control": "public, max-age=30",
      },
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


