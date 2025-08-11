import { NextRequest } from "next/server";

const FD_BASE = "https://api.football-data.org/v4";

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  const { slug } = await context.params;
  const path = slug?.join("/") ?? "";
  const url = `${FD_BASE}/${path}${req.nextUrl.search}`;

  const res = await fetch(url, {
    headers: apiKey ? { "X-Auth-Token": apiKey } : undefined,
    next: { revalidate: 30 },
  });

  const body = await res.arrayBuffer();
  return new Response(body, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
      "cache-control": res.headers.get("cache-control") || "public, max-age=30",
    },
  });
}


